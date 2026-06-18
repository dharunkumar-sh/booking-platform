"use client";
import { useState } from "react";
import Image from "next/image";

export default function FeaturedEvents() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const events = [
    {
      title: "Anirudh Live Concert",
      category: "music",
      venue: "Chennai Stadium",
      date: "Aug 25, 2026",
      time: "7:00 PM",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    },
    {
      title: "Vijay Antony Night",
      category: "music",
      venue: "Bangalore Arena",
      date: "Sep 10, 2026",
      time: "6:30 PM",
      rating: "4.5",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      title: "Stand-up Comedy Show",
      category: "comedy",
      venue: "Hyderabad Club",
      date: "Sep 15, 2026",
      time: "8:00 PM",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    },
    {
      title: "Drama Theatre Night",
      category: "drama",
      venue: "Mumbai Theatre",
      date: "Oct 05, 2026",
      time: "7:30 PM",
      rating: "4.3",
      image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d",
    },
    {
      title: "Dance Fiesta",
      category: "dance",
      venue: "Delhi Arena",
      date: "Oct 12, 2026",
      time: "6:00 PM",
      rating: "4.6",
      image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Gaming Championship",
      category: "games",
      venue: "Pune Expo Hall",
      date: "Oct 20, 2026",
      time: "5:00 PM",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    },
    {
      title: "Hip Hop Night",
      category: "dance",
      venue: "Chandigarh Club",
      date: "Nov 02, 2026",
      time: "7:30 PM",
      rating: "4.4",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
    },
    {
      title: "Live DJ Fest",
      category: "music",
      venue: "Goa Beach Arena",
      date: "Nov 15, 2026",
      time: "9:00 PM",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    },
  ];

  const categoryData = {
    music: ["Concert Night", "DJ Party", "Live Band"],
    comedy: ["Standup Special", "Improv Night"],
    drama: ["Stage Play", "Classic Theatre"],
    dance: ["Hip Hop Battle", "Dance Fest"],
    games: ["Esports Tournament", "Arcade Challenge"],
  };

  return (
    <div className="px-6 py-10 bg-neutral-950 min-h-screen text-white">
      
      <h2
        className="text-2xl font-extrabold mb-8"
        style={{
          background: "linear-gradient(90deg, #f97316, #ff5862)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        🎟 Featured Events
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event, i) => (
          <div
            key={i}
            onClick={() => setSelectedCategory(event.category)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-orange-500/40 transition duration-300"
          >
            {/* IMAGE */}
            <div className="relative h-72 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            {/* CONTENT */}
            <div className="absolute bottom-0 p-4 w-full">
              
              {/* Rating */}
              <div className="flex justify-between items-center mb-1">
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-xs px-2 py-1 rounded">
                  ⭐ {event.rating}
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur">
                  {event.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold">{event.title}</h3>

              <p className="text-xs text-gray-300">
                📍 {event.venue}
              </p>

              <p className="text-xs text-gray-300">
                📅 {event.date} • ⏰ {event.time}
              </p>

              {/* BOOK BUTTON */}
              <button
                className="mt-3 w-full bg-gradient-to-r from-orange-500 to-rose-500 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                🎟 Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORY SECTION */}
      {selectedCategory && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6 capitalize">
            {selectedCategory} Shows
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categoryData[selectedCategory].map((show, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-gradient-to-r from-orange-500 to-rose-500 transition transform hover:-translate-y-1"
              >
                🎭 {show}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-6 px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:opacity-90 cursor-pointer"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}