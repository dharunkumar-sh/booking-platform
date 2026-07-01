"use client";

import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./EventMap"), { ssr: false });

export default function EventMapWrapper({ searchQuery = "", selectedCategories = [], onBookEvent = () => {} }) {
  return <EventMap searchQuery={searchQuery} selectedCategories={selectedCategories} onBookEvent={onBookEvent} />;
}
