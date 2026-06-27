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
    const query = new URLSearchParams({
      title: event.title,
      venue: event.venue || event.location || "",
      price: event.priceVal || 499,
    }).toString();
    router.push(`/seat-selection?${query}`);
  };

  return (
    <div>
      <Hero />
      
      <FeaturedEvents />
      <TrendingEvents />
      <EventMapWrapper /> 
    </div>
  );
}