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
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    },
    {
      title: "Vijay Antony Night",
      category: "music",
      venue: "Bangalore Arena",
      date: "Sep 10, 2026",
      time: "6:30 PM",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      title: "Stand-up Comedy Show",
      category: "comedy",
      venue: "Hyderabad Club",
      date: "Sep 15, 2026",
      time: "8:00 PM",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    },
    {
      title: "Drama Theatre Night",
      category: "drama",
      venue: "Mumbai Theatre",
      date: "Oct 05, 2026",
      time: "7:30 PM",
      image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d",
    },
    {
      title: "Dance Fiesta",
      category: "dance",
      venue: "Delhi Arena",
      date: "Oct 12, 2026",
      time: "6:00 PM",
      image: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    },
    {
      title: "Gaming Championship",
      category: "games",
      venue: "Pune Expo Hall",
      date: "Oct 20, 2026",
      time: "5:00 PM",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    },
    {
      title: "Hip Hop Night",
      category: "dance",
      venue: "Chandigarh Club",
      date: "Nov 02, 2026",
      time: "7:30 PM",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
    },
    {
      title: "Live DJ Fest",
      category: "music",
      venue: "Goa Beach Arena",
      date: "Nov 15, 2026",
      time: "9:00 PM",
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
    <div className="px-6 py-8 bg-[#0b1a2d] min-h-screen text-white">
      
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">
        🎟 Featured Events
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event, i) => (
          <div
            key={i}
            onClick={() => setSelectedCategory(event.category)}
            className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-64 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 p-4">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-300">{event.category}</p>

              <div className="text-xs text-gray-200 mt-2 opacity-0 group-hover:opacity-100 transition">
                <p>📍 {event.venue}</p>
                <p>📅 {event.date}</p>
                <p>⏰ {event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORY DETAILS (same page) */}
      {selectedCategory && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 capitalize">
            {selectedCategory} Shows
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categoryData[selectedCategory].map((show, i) => (
              <div
                key={i}
                className="p-6 bg-[#1f2c3d] rounded-xl hover:bg-pink-600 transition"
              >
                {show}
              </div>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-6 px-4 py-2 bg-pink-600 rounded"
          >
            ← Back to Events
          </button>
        </div>
      )}
    </div>
  );
}