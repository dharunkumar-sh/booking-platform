"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import SeatSelection from "@/components/SeatSelection";
import TicketSelection from "@/app/tickets/TicketSelection";

function SeatSelectionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const title = params.id ? decodeURIComponent(params.id) : (searchParams.get("title") || "Special Event Concert");
  const venue = searchParams.get("venue") || "Main Arena";
  const priceVal = parseInt(searchParams.get("price") || "499", 10);
  const category = searchParams.get("category") || "";

  const eventDetails = {
    title,
    venue,
    priceVal,
    category,
  };

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
          onConfirmBooking={(ticketDetails) => {
            localStorage.setItem("pendingBooking", JSON.stringify(ticketDetails));
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
