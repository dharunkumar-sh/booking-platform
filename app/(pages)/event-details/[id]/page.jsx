"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EventHeader from "@/components/EventHeader";
import EventDetails from "@/components/EventDetails";

export default function EventDetailsPage() {
  const [event, setEvent] = useState(null);
  const router = useRouter();
  const params = useParams();

  const titleParam = params.id ? decodeURIComponent(params.id) : "";

  useEffect(() => {
    if (!titleParam) return;
    
    let found = false;
    try {
      const data = sessionStorage.getItem("selectedEvent");
      if (data) {
        const parsedEvent = JSON.parse(data);
        if (parsedEvent && parsedEvent.title === titleParam) {
          setEvent(parsedEvent);
          found = true;
        }
      }
    } catch (e) {
      console.error("Session storage read error for event:", e);
    }

    if (!found) {
      fetch(`/api/events?title=${encodeURIComponent(titleParam)}`)
        .then((res) => {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Event API response is not JSON");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success && data.events && data.events.length > 0) {
            const parsedEvent = data.events[0];
            setEvent(parsedEvent);
            try {
              sessionStorage.setItem("selectedEvent", JSON.stringify(parsedEvent));
            } catch (e) {
              console.error(e);
            }
          }
        })
        .catch((err) => {
          console.error("Failed fetching event details from API:", err);
        });
    }
  }, [titleParam]);

  if (!event) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4">Loading event details...</p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/5 hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft size={16} className="text-orange-500" />
          <span className="font-semibold text-sm">Back to Events</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <EventHeader event={event} />
        <EventDetails 
          event={event} 
          price={event.price != null 
            ? (typeof event.price === "string" && event.price.startsWith("₹") 
                ? event.price 
                : `₹${(Number(event.price) / 100).toFixed(0)}`) 
            : "₹499"} 
          organizer={event.organizer || "Live Nation"}
          description={event.description || `Experience an unforgettable evening filled with entertainment, and live performances. Join us for ${event.title} on ${event.date} at ${event.venue || event.location || "Venue TBA"}. Book your tickets now before they sell out!`}
          features={event.features}
          crew={event.crew}
          reviews={event.reviews}
        />
      </div>
    </div>
  );
}
