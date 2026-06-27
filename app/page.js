"use client";

import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";
import { useRouter } from "next/navigation";

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

  const handleBookEvent = (event) => {
    const numericPrice = event.price ? parseInt(event.price.replace(/[^\d]/g, "")) : (event.priceVal || 499);
    const query = new URLSearchParams({
      venue: event.venue || event.location || "",
      price: numericPrice,
      category: event.category || "",
    }).toString();
    router.push(`/seat-selection/${encodeURIComponent(event.title)}?${query}`);
  };

  return (
    <div>
      <Hero />
      
      <FeaturedEvents onBookEvent={handleBookEvent} />
      <TrendingEvents onBookEvent={handleBookEvent} />
      <EventMapWrapper onBookEvent={handleBookEvent} /> 
    </div>
  );
}