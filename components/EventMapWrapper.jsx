"use client";

import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./EventMap"), { ssr: false });

export default function EventMapWrapper({ searchQuery = "", onBookEvent = () => {} }) {
  return <EventMap searchQuery={searchQuery} onBookEvent={onBookEvent} />;
}
