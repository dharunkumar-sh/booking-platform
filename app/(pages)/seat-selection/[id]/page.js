"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import SeatSelection from "@/components/SeatSelection";
import TicketSelection from "@/app/(pages)/tickets/TicketSelection";
import { useBookingStore } from "@/hooks/useBookingStore";

function SeatSelectionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const [eventDetails, setEventDetails] = useState({
    id: searchParams.get("id") ? parseInt(searchParams.get("id"), 10) : null,
    title: params.id ? decodeURIComponent(params.id) : (searchParams.get("title") || "Special Event Concert"),
    venue: searchParams.get("venue") || "Main Arena",
    priceVal: parseInt(searchParams.get("price") || "499", 10),
    category: searchParams.get("category") || "",
  });

  useEffect(() => {
    const store = useBookingStore.getState();
    const userProfile = store.user;
    if (!userProfile) {
      store.setLoginRedirect(window.location.pathname + window.location.search);
      router.push("/login");
      return;
    }

    const data = store.selectedEvent;
    if (data) {
      setEventDetails({
        id: data.id,
        title: data.title,
        venue: data.venue || data.location || "Main Arena",
        priceVal: data.price != null
          ? (typeof data.price === "number"
              ? (data.price >= 10000 ? Math.round(data.price / 100) : data.price)
              : parseInt(data.price.toString().replace(/[^\d]/g, ""), 10))
          : (data.priceVal || 499),
        category: data.category || "",
      });
    }
  }, [params.id, searchParams, router]);

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
            useBookingStore.getState().setPendingBooking(ticketDetails);
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
      onConfirmSelection={async (seats) => {
        setConfirmedSeats(seats);
        const store = useBookingStore.getState();
        store.setBookingStartedAt(Date.now().toString());

        // Create a pending booking in the database to hold selected seats
        try {
          const user = store.user;
          if (user) {
            const seatIds = seats.map((s) => s.id || s.label || s);
            const cancelBookingId = store.dbBookingId;
            const response = await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                phone: user.phone || "",
                eventId: eventDetails.id,
                seats: seatIds,
                seatsBooked: seats.length,
                totalPrice: seats.reduce((acc, curr) => acc + (curr.price || 0), 0),
                status: "pending",
                bookingStartedAt: Date.now().toString(),
                cancelBookingId: cancelBookingId || undefined
              })
            });
            const resData = await response.json();
            if (resData.success && resData.bookingId) {
              store.setDbBookingId(resData.bookingId.toString());
              console.log("Held seats. Pending booking ID:", resData.bookingId);
            }
          }
        } catch (err) {
          console.error("Failed to hold seats in database:", err);
        }

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
