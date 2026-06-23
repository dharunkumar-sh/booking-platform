"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function EventMap({ onBookEvent = () => {} }) {
  const [userLocation, setUserLocation] = useState(null);

  const events = [
    {
      id: 1,
      title: "Vijay Antony Concert",
      venue: "YMCA Grounds Chennai",
      price: "₹499",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
      lat: 13.042,
      lng: 80.233,
    },
    {
      id: 2,
      title: "AR Rahman Live",
      venue: "Nehru Indoor Stadium",
      price: "₹999",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      lat: 13.065,
      lng: 80.248,
    },
    {
      id: 3,
      title: "Coolie",
      venue: "PVR Palazzo Chennai",
      price: "₹190",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      lat: 13.087,
      lng: 80.278,
    },
  ];

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

  return (
    <section
      style={{
        background: "#0a0a0a",
        padding: "60px 40px",
        color: "white",
      }}
    >
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

      <div style={{ display: "flex", gap: "24px" }}>
        {/* Sidebar */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "20px",
            borderRadius: "16px",
            maxHeight: "640px",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "20px",
              color: "white",
            }}
          >
            Events
          </h2>

          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(249,115,22,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "white",
                }}
              >
                {event.title}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#a1a1aa",
                  marginBottom: "4px",
                }}
              >
                📍 {event.venue}
              </p>

              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fb923c",
                  marginBottom: "8px",
                }}
              >
                🎟 {event.price}
              </p>

              {userLocation && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#a1a1aa",
                    marginBottom: "12px",
                  }}
                >
                  📏 {calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng)} km
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
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Map */}
        <div
          style={{
            flex: 2,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <MapContainer
            center={[13.0827, 80.2707]}
            zoom={11}
            style={{
              height: "600px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div style={{ fontWeight: 600 }}>
                    📍 Your Current Location
                  </div>
                </Popup>
              </Marker>
            )}

            {events.map((event) => (
              <Marker key={event.id} position={[event.lat, event.lng]}>
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
                      }}
                    >
                      Book Tickets
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
