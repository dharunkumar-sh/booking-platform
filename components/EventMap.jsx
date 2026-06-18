"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function EventMap() {
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

const calculateDistance = (
lat1,
lon1,
lat2,
lon2
) => {
const R = 6371;

```
const dLat =
  ((lat2 - lat1) * Math.PI) / 180;

const dLon =
  ((lon2 - lon1) * Math.PI) / 180;

const a =
  Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
  Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

const c =
  2 *
  Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

return (R * c).toFixed(1);
```

};

return (
<section
style={{
background: "#0F172A",
padding: "40px",
color: "white",
}}
>
<h1
style={{
fontSize: "32px",
marginBottom: "20px",
}}
>
Nearby Events </h1>


  <div
    style={{
      display: "flex",
      gap: "20px",
    }}
  >
    {/* Sidebar */}
    <div
      style={{
        flex: 1,
        background: "#1E293B",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      <h2>Events</h2>

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            background: "#334155",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <h3>{event.title}</h3>

          <p>📍 {event.venue}</p>

          <p>🎟 {event.price}</p>

          {userLocation && (
            <p>
              📏{" "}
              {calculateDistance(
                userLocation.lat,
                userLocation.lng,
                event.lat,
                event.lng
              )} km
            </p>
          )}

          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "#EF4444",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
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
        background: "#1E293B",
        borderRadius: "15px",
        padding: "20px",
      }}
    >
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={11}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "15px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker
            position={[
              userLocation.lat,
              userLocation.lng,
            ]}
          >
            <Popup>
              📍 Your Current Location
            </Popup>
          </Marker>
        )}

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[
              event.lat,
              event.lng,
            ]}
          >
            <Popup>
              <div
                style={{
                  width: "220px",
                  textAlign: "center",
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
                  }}
                />

                <h3>{event.title}</h3>

                <p>📍 {event.venue}</p>

                <p>🎟 {event.price}</p>

                {userLocation && (
                  <p>
                    📏{" "}
                    {calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      event.lat,
                      event.lng
                    )} km away
                  </p>
                )}

                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#EF4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
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
