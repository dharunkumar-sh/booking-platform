"use client";

import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./EventMap"), { ssr: false });

export default function EventMapWrapper({ onBookEvent = () => {} }) {
  return <EventMap onBookEvent={onBookEvent} />;
}
