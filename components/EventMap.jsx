"use client";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Ticket, Sun, Moon, Compass } from "lucide-react";
import L from "leaflet";
import { useGeolocationContext } from "@/context/GeolocationContext";

const customMarkerIcon = typeof window !== "undefined" ? new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

// Dynamic Re-center helper component
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
}

// Dynamically generate distinct venues and coordinates based on category and event title
const getVenueDetails = (category, title, id) => {
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();
  
  // Deterministic offset based on ID to spread events around the base coordinate of their venue
  const offsetLat = ((id * 17) % 7) * 0.003 - 0.009;
  const offsetLng = ((id * 31) % 7) * 0.003 - 0.009;

  // 1. Movies -> Theatre
  if (cat === "movie" || t.includes("movie") || t.includes("film") || t.includes("cinema")) {
    return {
      venue: "PVR Theatre, Chennai",
      lat: 13.0531 + offsetLat,
      lng: 80.2598 + offsetLng
    };
  }
  // 2. Sports -> Stadium
  if (cat === "sports" || t.includes("match") || t.includes("stadium") || t.includes("cup") || t.includes("cricket") || t.includes("ipl") || t.includes("football")) {
    return {
      venue: "Jawaharlal Nehru Stadium, Chennai",
      lat: 13.0844 + offsetLat,
      lng: 80.2698 + offsetLng
    };
  }
  // 3. Concerts/Music -> Arena
  if (cat === "music" || cat === "concert" || t.includes("concert") || t.includes("live") || t.includes("festival") || t.includes("rahman")) {
    return {
      venue: "VibePass Arena, Chennai",
      lat: 13.0617 + offsetLat,
      lng: 80.2443 + offsetLng
    };
  }
  // 4. Comedy/Shows/Others -> Hall
  return {
    venue: "Kalaivanar Arangam Hall, Chennai",
    lat: 13.0189 + offsetLat,
    lng: 80.1895 + offsetLng
  };
};

export default function EventMap({ onBookEvent = () => {}, searchQuery = "", selectedCategories = [] }) {
  const { location } = useGeolocationContext();
  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapTheme, setMapTheme] = useState("dark"); // "dark" | "light"
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && data.events) {
          const mapped = data.events.map((e) => {
            const venueInfo = getVenueDetails(e.category, e.title, e.id);
            return {
              id: e.id,
              title: e.title,
              venue: venueInfo.venue,
              category: e.category,
              price: e.price != null ? `₹${Math.round(e.price / 100)}` : "₹0",
              image: e.image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
              lat: venueInfo.lat,
              lng: venueInfo.lng,
              originalEvent: {
                ...e,
                location: venueInfo.venue
              },
            };
          });
          setEvents(mapped);
        }
      } catch (err) {
        console.error("Failed to load events for map:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const coords = { lat: location.latitude, lng: location.longitude };
      setUserLocation(coords);
      setMapCenter([coords.lat, coords.lng]);
    } else {
      try {
        const saved = localStorage.getItem("vibepass_geo_location");
        if (saved) {
          const { location: savedLocation } = JSON.parse(saved);
          if (savedLocation?.latitude && savedLocation?.longitude) {
            const coords = { lat: savedLocation.latitude, lng: savedLocation.longitude };
            setUserLocation(coords);
            setMapCenter([coords.lat, coords.lng]);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(coords);
          setMapCenter([coords.lat, coords.lng]);
        },
        (error) => {}
      );
    }
  }, [location]);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setMapCenter([coords.lat, coords.lng]);
        },
        (error) => {
          alert("Unable to fetch location. Please check settings or permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategories && selectedCategories.length > 0) {
      if (!selectedCategories.includes((e.category || "").toLowerCase())) {
        return false;
      }
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (e.title || "").toLowerCase().includes(q) ||
        (e.venue || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section
      style={{
        background: "#0a0a0a",
        padding: "60px 40px",
        color: "white",
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              background: "linear-gradient(90deg, #f97316, #ff5862)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            Nearby Events
          </h1>
          
          <div className="flex items-center gap-3">
            {/* Locate Me Button */}
            <button
              onClick={handleLocateUser}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-neutral-900 border border-neutral-800 hover:border-orange-500 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
            >
              <Compass size={14} className="text-orange-500 animate-pulse" />
              <span>Locate Me</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setMapTheme(mapTheme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-neutral-900 border border-neutral-800 hover:border-orange-500 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
            >
              {mapTheme === "dark" ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>Light Map</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-indigo-400" />
                  <span>Dark Map</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center">
          {/* Map */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MapContainer
              center={mapCenter}
              zoom={11}
              attributionControl={false}
              style={{
                height: "600px",
                width: "100%",
                borderRadius: "12px",
                margin: "0 auto",
              }}
            >
              <MapRecenter center={mapCenter} />
              
              <TileLayer
                url={mapTheme === "dark" 
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                  : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                }
                attribution={mapTheme === "dark"
                  ? '&copy; <a href="https://carto.com/">CARTO</a>'
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                }
              />

              {userLocation && customMarkerIcon && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={customMarkerIcon}>
                  <Popup>
                    <div style={{ fontWeight: 600 }}>
                      📍 Your Current Location
                    </div>
                  </Popup>
                </Marker>
              )}

              {filteredEvents.map((event) => (
                customMarkerIcon && (
                  <Marker key={event.id} position={[event.lat, event.lng]} icon={customMarkerIcon}>
                    <Popup>
                      <div
                        style={{
                          width: "220px",
                          textAlign: "center",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginBottom: "10px",
                          }}
                        />

                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            margin: "0 0 6px",
                            color: "#1a1a2e",
                          }}
                        >
                          {event.title}
                        </h3>

                        <p
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            margin: "0 0 4px",
                          }}
                        >
                          📍 {event.venue}
                        </p>

                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#f97316",
                            margin: "0 0 6px",
                          }}
                        >
                          🎟 {event.price}
                        </p>

                        {userLocation && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              margin: "0 0 10px",
                            }}
                          >
                            📏 {calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng)} km away
                          </p>
                        )}

                        <button
                          onClick={() => onBookEvent({
                            id: event.id,
                            title: event.title,
                            venue: event.venue,
                            category: event.category,
                            priceVal: parseInt(event.price.replace("₹", ""))
                          })}
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "linear-gradient(90deg, #f97316, #ff5862)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <Ticket size={15} /> Book Tickets
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
