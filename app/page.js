"use client";

import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleBookEvent = (event) => {
    const query = new URLSearchParams({
      title: event.title,
      venue: event.venue,
      price: event.priceVal || 499,
    }).toString();
    router.push(`/seat-selection?${query}`);
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