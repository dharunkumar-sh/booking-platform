"use client";

import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";
import { useRouter } from "next/navigation";

import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");

  const handleBookEvent = (event) => {
    const query = new URLSearchParams({
      venue: event.venue || event.location || "",
      category: event.category || "",
    }).toString();
    router.push(`/seat-selection/${encodeURIComponent(event.title)}?${query}`);
  };

  return (
    <div>
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <FeaturedEvents searchQuery={searchQuery} onBookEvent={handleBookEvent} />
      <TrendingEvents searchQuery={searchQuery} onBookEvent={handleBookEvent} />
      <EventMapWrapper searchQuery={searchQuery} onBookEvent={handleBookEvent} /> 
    </div>
  );
}