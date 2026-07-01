"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";
import { useRouter } from "next/navigation";

// Maps Hero mood keys → event category values stored in DB
const MOOD_TO_CATEGORY = {
  relaxed: ["comedy", "food"],
  adventure: ["sports"],
  romantic: ["drama"],
  productive: ["games"],
  luxury: ["music"],
};

const isTheatreEvent = (event) => {
  if (!event) return false;
  const title = (event.title || "").toLowerCase();
  const venue = (event.venue || event.location || "").toLowerCase();
  const category = (event.category || "").toLowerCase();
  return (
    category === "drama" ||
    category === "movie" ||
    category === "theatre" ||
    title.includes("theatre") ||
    title.includes("movie") ||
    title.includes("cinema") ||
    title.includes("play") ||
    title.includes("coolie") ||
    venue.includes("theatre") ||
    venue.includes("cinema") ||
    venue.includes("pvr") ||
    venue.includes("palazzo")
  );
};

export default function Home() {
  const router = useRouter();

  // ── Lifted search / filter state ─────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Mood key → DB categories mapping; toggling same mood clears the filter
  const handleMoodChange = (moodKey) => {
    if (!moodKey) {
      setSelectedCategories([]);
      return;
    }
    const cats = MOOD_TO_CATEGORY[moodKey] || [];
    setSelectedCategories(cats);
  };

  // ── Booking handler ───────────────────────────────────────────────────────
  const handleBookEvent = (event) => {
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
        onBookEvent={handleBookEvent}
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
      />

      <TrendingEvents
        onBookEvent={handleBookEvent}
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
      />

      <EventMapWrapper
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        onBookEvent={handleBookEvent}
      />
    </div>
  );
}