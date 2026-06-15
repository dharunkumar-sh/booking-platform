"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const HIGH_RES_IMAGES = {
  default: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  ],
  relaxed: [
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  ],
  adventure: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1200&q=80",
  ],
  romantic: [
    "https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1588733103629-b77afe0425ce?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
  ],
  productive: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552581230-c0159146269a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  ],
  luxury: [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  ],
};

const MOODS = [
  {
    name: "Relaxed 😌",
    key: "relaxed",
  },
  {
    name: "Adventurous 🏔️",
    key: "adventure",
  },
  {
    name: "Romantic ❤️",
    key: "romantic",
  },
  {
    name: "Productive 💻",
    key: "productive",
  },
  {
    name: "Luxury 👑",
    key: "luxury",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState("");
  const [images, setImages] = useState(HIGH_RES_IMAGES.default);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.name);
    setImages(HIGH_RES_IMAGES[mood.key] || HIGH_RES_IMAGES.default);
    setCurrentIndex(0);
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "620px" }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {images.length > 0 ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Event ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  transition: "transform 1s ease-in-out",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 100%)",
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8">
        <h1
          className="text-white font-bold mb-1"
          style={{
            fontSize: "clamp(22px, 3vw, 36px)",
          }}
        >
          Discover Your Next
        </h1>

        <h2
          className="font-extrabold mb-2"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#f97316",
          }}
        >
          Unforgettable Experience
        </h2>

        <p className="text-gray-300 mb-5 max-w-2xl">
          Explore concerts, shows, nightlife, destinations, travel packages, and
          exclusive experiences happening around you.
        </p>

        <form
          className="max-w-xl mb-5"
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <Search className="text-gray-400" size={18} />

            <input
              type="text"
              placeholder="Search events, artists, venues or ask AI: beach getaway, luxury trip..."
              className="flex-1 text-gray-700 bg-transparent outline-none"
            />

            <button
              type="submit"
              className="px-5 py-2 text-white font-semibold bg-linear-to-r from-[#FF9650] to-[#ff5862] rounded-md"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mb-5">
          <h3 className="text-white font-semibold mb-3">
            ✨ How do you want to feel?
          </h3>

          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                type="button"
                onClick={() => handleMoodSelect(mood)}
                className={
                  "px-4 py-2 rounded-full text-sm transition-all duration-200 " +
                  (selectedMood === mood.name
                    ? "bg-orange-500 text-white"
                    : "bg-white/20 text-white border border-white/30")
                }
              >
                {mood.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
