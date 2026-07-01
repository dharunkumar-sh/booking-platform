"use client";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Ticket } from "lucide-react";
import L from "leaflet";

const customMarkerIcon = typeof window !== "undefined" ? new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

export default function EventMap({ onBookEvent = () => {}, searchQuery = "", selectedCategories = [] }) {
  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && data.events) {
          const mapped = data.events.map((e) => ({
            id: e.id,
            title: e.title,
            venue: e.location,
            category: e.category,
            price: e.price != null ? `₹${Math.round(e.price / 100)}` : "₹0",
            image: e.image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
            lat: e.latitude || 13.0827,
            lng: e.longitude || 80.2707,
            originalEvent: e,
          }));
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.log(error)
    );
  }, []);

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
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "32px",
            background: "linear-gradient(90deg, #f97316, #ff5862)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Nearby Events
        </h1>

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
              center={[13.0827, 80.2707]}
              zoom={11}
              attributionControl={false}
              style={{
                height: "600px",
                width: "100%",
                borderRadius: "12px",
                margin: "0 auto",
              }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
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
                          title: event.title,
                          venue: event.venue,
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
