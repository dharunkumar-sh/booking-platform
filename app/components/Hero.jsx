"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const MOODS = [
  {
    name: "Relaxed 😌",
    suggestion: "Kerala Backwaters, Goa Resorts, Ooty",
  },
  {
    name: "Adventurous 🏔️",
    suggestion: "Manali Trekking, Leh Ladakh, Rishikesh",
  },
  {
    name: "Romantic ❤️",
    suggestion: "Udaipur, Maldives, Pondicherry",
  },
  {
    name: "Productive 💻",
    suggestion: "Bangalore Workcation, Coorg",
  },
  {
    name: "Luxury 👑",
    suggestion: "Dubai, Singapore, Taj Resorts",
  },
];

const Hero = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  const generateAiSuggestion = (textInput) => {
    const text = textInput.toLowerCase();

    if (
      text.includes("nature") ||
      text.includes("green") ||
      text.includes("mountain")
    ) {
      setAiSuggestion("🌿 Munnar, Coorg, Ooty");
    } else if (
      text.includes("beach") ||
      text.includes("sea")
    ) {
      setAiSuggestion("🏖️ Goa, Pondicherry, Andaman");
    } else if (
      text.includes("adventure") ||
      text.includes("trek")
    ) {
      setAiSuggestion("🏔️ Manali, Leh, Rishikesh");
    } else if (text.includes("luxury")) {
      setAiSuggestion("👑 Dubai, Maldives, Singapore");
    } else if (text.includes("romantic")) {
      setAiSuggestion("❤️ Udaipur, Maldives, Kashmir");
    } else {
      setAiSuggestion("✨ Goa, Kerala, Jaipur, Coorg");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      generateAiSuggestion(searchQuery);
      router.push(
        "/events?search=" + encodeURIComponent(searchQuery)
      );
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.name);
    setAiSuggestion(mood.suggestion);
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "620px" }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://storage.googleapis.com/ticket9-prod.appspot.com/videos/1765955219308_concert.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 100%)",
        }}
      />

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
          Explore concerts, shows, nightlife,
          destinations, travel packages, and
          exclusive experiences happening around you.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="max-w-xl mb-5"
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <Search
              className="text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, artists, venues or ask AI: beach getaway, luxury trip..."
              className="flex-1 text-gray-700 bg-transparent outline-none"
            />

            <button
              type="submit"
              className="px-5 py-2 text-white font-semibold bg-gradient-to-r from-[#FF9650] to-[#ff5862] rounded-md"
            >
              Search
            </button>
          </div>

          {aiSuggestion && (
            <div className="px-4 pb-4">
              <div className="bg-black/20 text-white p-3 rounded-md">
                Suggested Destinations:
                <br />
                <strong>{aiSuggestion}</strong>
              </div>
            </div>
          )}
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

