"use client";

import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";
import { useRouter } from "next/navigation";

import { useState } from "react";

// Maps Hero mood keys → event category values stored in DB
const MOOD_TO_CATEGORY = {
  relaxed: ["comedy", "food"],
  adventure: ["sports"],
  romantic: ["drama"],
  productive: ["games"],
  luxury: ["music"],
};

import { useGeolocationContext } from "@/context/GeolocationContext";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { selectedState, setSelectedState } = useGeolocationContext();

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleMoodChange = (moodKey) => {
    if (!moodKey) {
      setSelectedCategories([]);
      return;
    }
    const cats = MOOD_TO_CATEGORY[moodKey] || [];
    setSelectedCategories(cats);
  };

  const handleBookEvent = (event) => {
    try {
      localStorage.setItem("selectedEvent", JSON.stringify(event));
    } catch (e) {
      console.error("Failed to save selected event to localStorage:", e);
    }
    const query = new URLSearchParams({
      venue: event.venue || event.location || "",
      category: event.category || "",
    }).toString();
    router.push(`/seat-selection/${encodeURIComponent(event.title)}?${query}`);
  };

  return (
    <div>
      <Hero
        onSearchChange={handleSearchChange}
        onMoodChange={handleMoodChange}
      />

      <FeaturedEvents
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedState={selectedState}
        onBookEvent={handleBookEvent}
      />
      <TrendingEvents
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedState={selectedState}
        onBookEvent={handleBookEvent}
      />
      <EventMapWrapper
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        onBookEvent={handleBookEvent}
      />
    </div>
  );
}