"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SeatSelection from "@/components/SeatSelection";
import TicketSelection from "@/app/tickets/TicketSelection";

function SeatSelectionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get("title") || "Special Event Concert";
  const venue = searchParams.get("venue") || "Main Arena";
  const priceVal = parseInt(searchParams.get("price") || "499", 10);

  const eventDetails = {
    title,
    venue,
    priceVal,
  };

  const [step, setStep] = useState("seats"); // "seats" | "tickets"
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  if (step === "tickets") {
    return (
      <div style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        <TicketSelection
          event={eventDetails}
          confirmedSeats={confirmedSeats}
          onBack={() => setStep("seats")}
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
