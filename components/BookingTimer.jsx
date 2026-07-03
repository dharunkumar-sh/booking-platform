"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, AlertTriangle } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";

export default function BookingTimer() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [expiredEventId, setExpiredEventId] = useState("");

  useEffect(() => {
    const store = useBookingStore.getState();
    const startedAtStr = store.bookingStartedAt;
    if (!startedAtStr) return;

    const startedAt = parseInt(startedAtStr, 10);
    const limit = 10 * 60 * 1000; // 10 minutes in milliseconds

    const updateTimer = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = limit - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        
        // Find event ID to redirect to
        let eventId = "";
        try {
          const pendingData = store.pendingBooking;
          if (pendingData) {
            if (pendingData?.event?.id) {
              eventId = pendingData.event.id;
            }
          }

          // Release pending seats in database immediately on expiration
          const dbBookingId = store.dbBookingId;
          if (dbBookingId) {
            fetch("/api/bookings", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bookingId: dbBookingId })
            }).catch(err => console.error("Error releasing expired booking:", err));
            store.clearDbBookingId();
          }
        } catch (e) {
          console.error(e);
        }

        setExpiredEventId(eventId);
        
        // Clear pending bookings immediately
        store.setBookingStartedAt(null);
        store.clearDbBookingId();
        store.clearPendingBooking();
        
        setShowExpiredModal(true);
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [router]);

  if (timeLeft === null) return null;
  if (timeLeft <= 0 && !showExpiredModal) return null;

  const handleExpiredConfirm = () => {
    setShowExpiredModal(false);
    if (expiredEventId) {
      router.push(`/seat-selection/${expiredEventId}`);
    } else {
      router.push("/");
    }
  };

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isLowTime = timeLeft > 0 && timeLeft < 2 * 60 * 1000; // Less than 2 minutes

  return (
    <>
      {timeLeft > 0 && (
        <div
          className={`w-full max-w-md mx-auto mb-6 p-4 rounded-2xl border-2 flex items-center justify-between text-sm transition-all duration-300 ${
            isLowTime
              ? "bg-neutral-950 border-red-500 text-red-500 animate-pulse shadow-lg shadow-red-500/10"
              : "bg-neutral-950 border-orange-500 text-orange-500 shadow-lg shadow-orange-500/10"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isLowTime ? <AlertTriangle size={18} className="text-red-500" /> : <Clock size={18} className="text-orange-500" />}
            <span className="font-semibold">
              {isLowTime ? "Session expiring soon!" : "Seat reservation secured"}
            </span>
          </div>
          <div className="font-mono font-extrabold text-base tracking-wider bg-neutral-950/40 px-3 py-1 rounded-xl border border-white/5">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      )}

      {showExpiredModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-orange-500/10 border-2 border-orange-500/30 text-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Clock size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Booking Session Ended</h3>
              <p className="text-sm text-neutral-400">
                Your booking session has ended. Please select your seats again.
              </p>
            </div>
            <button
              onClick={handleExpiredConfirm}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 hover:shadow-orange-500/20 transition-all cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
