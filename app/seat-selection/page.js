"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SeatSelection from "@/components/SeatSelection";

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

  return (
    <SeatSelection
      event={eventDetails}
      onCancel={() => router.push("/")}
      onConfirmSelection={(details) => {
        console.log("Confirmed Ticket Booking:", details);
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
