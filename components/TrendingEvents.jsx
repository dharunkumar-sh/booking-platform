"use client";

import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function TrendingEvents() {
  const sliderRef = useRef(null);
  const [likedEvents, setLikedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  const toggleLike = (id) => {
    if (likedEvents.includes(id)) {
      setLikedEvents(likedEvents.filter((item) => item !== id));
    } else {
      setLikedEvents([...likedEvents, id]);
    }
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  const events = [
    {
      id: 1,
      title: "Coolie",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      date: "Now Showing",
      location: "PVR Palazzo Chennai",
      rating: "4.9",
    },
    {
      id: 2,
      title: "Vijay Antony Live Concert",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
      date: "20 Jun 2026",
      location: "YMCA Grounds Chennai",
      rating: "4.8",
    },
    {
      id: 3,
      title: "AR Rahman Live",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      date: "22 Jun 2026",
      location: "Nehru Indoor Stadium",
      rating: "4.9",
    },
    {
      id: 4,
      title: "CSK Fan Festival",
      image:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      date: "25 Jun 2026",
      location: "Chepauk Stadium",
      rating: "4.8",
    },
    {
      id: 5,
      title: "Comedy Night Chennai",
      image:
        "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
      date: "28 Jun 2026",
      location: "Kodambakkam",
      rating: "4.7",
    },
    {
      id: 6,
      title: "Food Festival",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      date: "30 Jun 2026",
      location: "Island Grounds",
      rating: "4.8",
    },
  ];

  return (
    <section
      style={{
        background: "#0F172A",
        padding: "60px 40px",
        position: "relative",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        Trending Events
      </h1>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        style={{
          position: "absolute",
          left: "10px",
          top: "55%",
          transform: "translateY(-50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#1E293B",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        style={{
          position: "absolute",
          right: "10px",
          top: "55%",
          transform: "translateY(-50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#1E293B",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <FaChevronRight size={20} />
      </button>

      <div
        ref={sliderRef}
        style={{
          display: "flex",
          gap: "25px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            style={{
              minWidth: "330px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              position: "relative",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-10px) scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0) scale(1)";
            }}
          >
            {index < 2 && (
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  background: "#EF4444",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                🔥 Trending
              </div>
            )}

            {/* Heart */}
            <button
              onClick={() => toggleLike(event.id)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              {likedEvents.includes(event.id) ? "❤️" : "🤍"}

              
            </button>

            <img
              src={event.image}
              alt={event.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                padding: "20px",
                color: "white",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                {event.title}
              </h2>

              <p>📅 {event.date}</p>
              <p>📍 {event.location}</p>
              <p>⭐ {event.rating}/5</p>

              <button
  onClick={() => {
    localStorage.setItem(
      "selectedEvent",
      JSON.stringify(event)
    );
    router.push("/event-details");
  }}
  style={{
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(90deg,#EF4444,#DC2626)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Book Now
</button>
            </div>
          </div>
        ))}
      </div>



      {selectedEvent && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "800px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <img
        src={selectedEvent.image}
        alt={selectedEvent.title}
        style={{
          width: "100%",
          height: "350px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "25px" }}>
        <h1>{selectedEvent.title}</h1>

        <p>
          <strong>📅 Event Date:</strong> {selectedEvent.date}
        </p>

        <p>
          <strong>📍 Venue:</strong> {selectedEvent.location}
        </p>

        <p>
          <strong>⭐ Rating:</strong> {selectedEvent.rating}/5
        </p>

        <p>
          <strong>🎟 Ticket Price:</strong> ₹499 onwards
        </p>

        <p>
          <strong>🕒 Time:</strong> 7:00 PM
        </p>

        <p>
          <strong>🎤 About Event:</strong>
          <br />
          Experience an unforgettable evening filled with music,
          entertainment, and live performances.
        </p>

        <h3 style={{ marginTop: "20px" }}>
          Available Show Timings
        </h3>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button>11:00 AM</button>
          <button>3:00 PM</button>
          <button>7:00 PM</button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#EF4444",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Select Seats
          </button>

          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              flex: 1,
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#E5E7EB",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </section>
  );
}