"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import SeatSelection from "@/components/SeatSelection";
import TicketSelection from "@/app/tickets/TicketSelection";

function SeatSelectionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const [eventDetails, setEventDetails] = useState({
    title: params.id ? decodeURIComponent(params.id) : (searchParams.get("title") || "Special Event Concert"),
    venue: searchParams.get("venue") || "Main Arena",
    priceVal: parseInt(searchParams.get("price") || "499", 10),
    category: searchParams.get("category") || "",
  });

  useEffect(() => {
    fetch("/api/redis?key=selectedEvent")
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          const parsed = res.data;
          setEventDetails({
            title: parsed.title,
            venue: parsed.venue || parsed.location || "Main Arena",
            priceVal: parsed.price ? parseInt(parsed.price.toString().replace(/[^\d]/g, "")) : (parsed.priceVal || 499),
            category: parsed.category || "",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [params.id, searchParams]);

  const { title, venue, priceVal, category } = eventDetails;

  const venueLower = venue.toLowerCase();
  const isConcert = category.toLowerCase() === "music" || 
                    category.toLowerCase() === "concert" || 
                    title.toLowerCase().includes("concert") || 
                    title.toLowerCase().includes("live");

  const isConcertWithoutSeats = isConcert && 
                                !venueLower.includes("stadium") && 
                                !venueLower.includes("arena");

  const [step, setStep] = useState(isConcertWithoutSeats ? "tickets" : "seats"); // "seats" | "tickets"
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  if (step === "tickets") {
    return (
      <div style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        <TicketSelection
          event={eventDetails}
          confirmedSeats={confirmedSeats}
          onBack={() => {
            if (isConcertWithoutSeats) {
              router.back();
            } else {
              setStep("seats");
            }
          }}
          onConfirmBooking={async (ticketDetails) => {
            try {
              await fetch("/api/redis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "pendingBooking", value: ticketDetails }),
              });
            } catch (e) {
              console.error(e);
            }
            router.push("/checkout");
          }}
        />
      </div>
    );
  }

  return (
    <SeatSelection
      event={eventDetails}
      onCancel={() => router.push("/")}
      onConfirmSelection={(seats) => {
        setConfirmedSeats(seats);
        setStep("tickets");
      }}
    />
  );
}

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={
      <div style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "18px"
      }}>
        Loading Seat Selection...
      </div>
    }>
      <SeatSelectionPageContent />
    </Suspense>
  );
}
