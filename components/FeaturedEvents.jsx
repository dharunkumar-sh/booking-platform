"use client";

import { useState } from "react";
import "@/app/featured.css";
export default function FeaturedEvents() {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("All");


  const events = [
    {
      title: "Anirudh Live Concert",
      image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
      venue: "Chennai Stadium",
      date: "Aug 20",
      time: "7 PM",
      category: "Music",
    },
    {
      title: "Vijay Antony Night",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      venue: "Bangalore Arena",
      date: "Sep 10",
      time: "6 PM",
      category: "Music",
    },
    {
      title: "Stand-up Comedy Show",
      image: "https://images.unsplash.com/photo-1521334884684-d80222895322",
      venue: "Hyderabad Club",
      date: "Aug 25",
      time: "8 PM",
      category: "Comedy",
    },
    {
      title: "Drama Theatre Night",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35",
      venue: "Delhi Theatre",
      date: "Sep 5",
      time: "5 PM",
      category: "Drama",
    },
  ];

  const filtered =
    category === "All"
      ? events
      : events.filter((e) => e.category === category);

  return (
    <div className="container">
      <h1>🎟 Featured Events</h1>

      {/* CATEGORY FILTER */}
      <div className="filters">
        {["All", "Music", "Comedy", "Drama"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid">
        {filtered.map((event, i) => (
          <div
            key={i}
            className="card"
            onClick={() => setSelected(event)}
          >
            <img src={event.image} alt="event" />
            <div className="card-info">
              <h3>{event.title}</h3>
              <p>{event.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} />
            <h2>{selected.title}</h2>
            <p>📍 {selected.venue}</p>
            <p>📅 {selected.date}</p>
            <p>⏰ {selected.time}</p>

            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}