"use client";

import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";

export default function TrendingEvents({ onBookEvent = () => {} }) {
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
      category: "movie",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      date: "Now Showing",
      time: "Various Timings",
      location: "PVR Palazzo Theatre Chennai",
      rating: "4.9",
      description: "An action-packed blockbuster featuring stunning visuals, intense drama, and a gripping storyline that will keep you on the edge of your seat.",
      price: "₹350.00",
      organizer: "Sun Pictures",
      features: ["Dolby Atmos", "Recliner Seats", "Free Popcorn Combo"],
      crew: [
        { name: "Lokesh Kanagaraj", role: "Director", img: "https://ui-avatars.com/api/?name=Lokesh+Kanagaraj&background=random&size=200" },
        { name: "Rajinikanth", role: "Lead Actor", img: "https://ui-avatars.com/api/?name=Rajinikanth&background=random&size=200" }
      ],
      reviews: [
        { name: "Ashwin", rating: 5, comment: "Pure mass! The BGM is lit." }
      ]
    },
    {
      id: 2,
      title: "Vijay Antony Live Concert",
      category: "music",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
      date: "20 Jun 2026",
      time: "6:30 PM",
      location: "YMCA Stadium Chennai",
      rating: "4.8",
      description: "Experience the musical genius of Vijay Antony in a spectacular live show featuring all his greatest hits.",
      price: "₹1499.00",
      organizer: "Fatima Vijay Antony",
      features: ["VIP Seating", "Food Stalls", "Merchandise"],
      crew: [
        { name: "Vijay Antony", role: "Artist", img: "https://ui-avatars.com/api/?name=Vijay+Antony&background=random&size=200" }
      ],
      reviews: [
        { name: "Ram", rating: 5, comment: "Amazing vibes. Loved the classical fusion." }
      ]
    },
    {
      id: 3,
      title: "AR Rahman Live",
      category: "music",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      date: "22 Jun 2026",
      time: "7:00 PM",
      location: "Nehru Indoor Arena Chennai",
      rating: "4.9",
      description: "The Mozart of Madras returns with a magical symphony of his most iconic soundtracks, accompanied by a 50-piece orchestra.",
      price: "₹3499.00",
      organizer: "KM Music",
      features: ["Premium Acoustics", "Meet & Greet (VIP)", "Signed Merch"],
      crew: [
        { name: "A.R. Rahman", role: "Composer", img: "https://ui-avatars.com/api/?name=A+R+Rahman&background=random&size=200" },
        { name: "Shreya Ghoshal", role: "Singer", img: "https://ui-avatars.com/api/?name=Shreya+Ghoshal&background=random&size=200" }
      ],
      reviews: [
        { name: "Nisha", rating: 5, comment: "It felt heavenly! Literal goosebumps." }
      ]
    },
    {
      id: 4,
      title: "CSK Fan Festival",
      category: "sports",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      date: "25 Jun 2026",
      time: "4:00 PM",
      location: "Chepauk Stadium Chennai",
      rating: "4.8",
      description: "Join the yellow army for an exclusive fan festival! Meet the players, enjoy live music, and get access to exclusive merchandise.",
      price: "₹999.00",
      organizer: "Chennai Super Kings",
      features: ["Player Autographs", "Fan Zone Access", "Jersey Giveaway"],
      crew: [
        { name: "MS Dhoni", role: "Captain", img: "https://ui-avatars.com/api/?name=MS+Dhoni&background=random&size=200" },
        { name: "Ruturaj Gaikwad", role: "Player", img: "https://ui-avatars.com/api/?name=Ruturaj+Gaikwad&background=random&size=200" }
      ],
      reviews: [
        { name: "Kiran", rating: 5, comment: "Whistle Podu! Best day ever." }
      ]
    },
    {
      id: 5,
      title: "Comedy Night Chennai",
      category: "comedy",
      image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
      date: "28 Jun 2026",
      time: "8:00 PM",
      location: "Kodambakkam Hall Chennai",
      rating: "4.7",
      description: "An evening of endless laughter featuring the city's best local comics and a surprise guest performer.",
      price: "₹599.00",
      organizer: "Madras Comedy Club",
      features: ["Free Drink", "VIP Sofa Seating", "After-party"],
      crew: [
        { name: "Aravind SA", role: "Comedian", img: "https://ui-avatars.com/api/?name=Aravind+SA&background=random&size=200" }
      ],
      reviews: [
        { name: "Sneha", rating: 4, comment: "Really funny, great crowd work!" }
      ]
    },
    {
      id: 6,
      title: "Food Festival",
      category: "food",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      date: "30 Jun 2026",
      time: "11:00 AM",
      location: "Island Grounds Arena Chennai",
      rating: "4.8",
      description: "A culinary journey exploring street food and gourmet cuisines from all over the world. Taste the best dishes from top chefs.",
      price: "₹299.00",
      organizer: "Foodie Nation",
      features: ["Tasting Sessions", "Live Cooking Demos", "Chef Meet & Greet"],
      crew: [
        { name: "Chef Damu", role: "Head Chef", img: "https://ui-avatars.com/api/?name=Chef+Damu&background=random&size=200" }
      ],
      reviews: [
        { name: "Ravi", rating: 5, comment: "The biryani stall was amazing." }
      ]
    }
  ];

  return (
    <section
      className="bg-neutral-950"
      style={{
        padding: "60px 40px",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
          background: "linear-gradient(90deg, #f97316, #ff5862)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
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
            onClick={async () => {
              try {
                await fetch("/api/redis", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ key: "selectedEvent", value: event }),
                });
              } catch (e) {
                console.error(e);
              }
              router.push(`/event-details/${encodeURIComponent(event.title)}`);
            }}
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
              cursor: "pointer",
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
                  background: "linear-gradient(90deg, #f97316, #ff5862)",
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
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(event.id);
              }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onBookEvent(event);
                }}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: "linear-gradient(90deg, #f97316, #ff5862)",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Ticket size={16} /> Book Now
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
              background: "linear-gradient(90deg, #f97316, #ff5862)",
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