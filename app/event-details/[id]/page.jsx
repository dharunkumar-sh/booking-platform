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

  useEffect(() => {
    try {
      const data = localStorage.getItem("selectedEvent");
      if (data) {
        const parsedEvent = JSON.parse(data);
        setEvent({
          title: parsedEvent.title,
          category: parsedEvent.category || "Event",
          date: parsedEvent.date,
          time: parsedEvent.time || "7:00 PM",
          venue: parsedEvent.venue || parsedEvent.location || "Venue TBA",
          rating: parsedEvent.rating,
          image: parsedEvent.image,
          description: parsedEvent.description,
          price: parsedEvent.price,
          organizer: parsedEvent.organizer,
          features: parsedEvent.features,
          crew: parsedEvent.crew,
          reviews: parsedEvent.reviews,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

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
          price={event.price || "₹499.00"} 
          organizer={event.organizer || "Live Nation"}
          description={event.description || `Experience an unforgettable evening filled with entertainment, and live performances. Join us for ${event.title} on ${event.date} at ${event.venue}. Book your tickets now before they sell out!`}
          features={event.features}
          crew={event.crew}
          reviews={event.reviews}
        />
      </div>
    </div>
  );
}
