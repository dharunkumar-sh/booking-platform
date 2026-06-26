"use client";

import { useEffect, useState } from "react";
import { X, Download, Check, MapPin, Calendar, Clock, Ticket } from "lucide-react";

const CAT_EMOJI = { movie: "🎬", event: "🎉", concert: "🎸", travel: "🚌" };

function generateRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "VP-";
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

export default function ConfirmationModal({
  show,
  category,
  selectedSeats,
  total,
  onClose,
}) {
  const [bookingRef] = useState(generateRef);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 120);
    return () => clearTimeout(t);
  }, []);

  const seatLabels = selectedSeats.map((s) => s.label).join(", ");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.75)" }}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden transition-all duration-400 ${
          showContent ? "vp-scale-in" : "opacity-0 scale-95"
        }`}
        style={{
          background: "linear-gradient(160deg, #0f0f1a, #16162a)",
          border: "1px solid rgba(249,115,22,0.25)",
          boxShadow:
            "0 0 80px rgba(249,115,22,0.1), 0 0 200px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Close button */}
        <button
          id="close-confirm-modal"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X size={15} />
        </button>

        {/* Success Banner */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{
            background:
              "linear-gradient(to bottom, rgba(16,185,129,0.12), transparent)",
            borderBottom: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          {/* Animated Check */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 vp-check-pop"
            style={{
              background: "linear-gradient(135deg, #059669, #10b981)",
              boxShadow: "0 0 30px rgba(16,185,129,0.4)",
            }}
          >
            <Check size={30} className="text-white" strokeWidth={3} />
          </div>

          <h2 className="text-xl font-extrabold text-white mb-1">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-neutral-400">
            Your tickets are ready. Have a great time!
          </p>

          {/* Booking Ref */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-neutral-800/60 border border-neutral-700/50">
            <Ticket size={13} className="text-orange-400" />
            <span className="text-sm font-mono font-bold text-orange-400 tracking-wider">
              {bookingRef}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="px-6 py-5 border-b border-neutral-800/50">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{CAT_EMOJI[category]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base leading-tight">
                {show?.title}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-orange-400" />
                  {show?.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-orange-400" />
                  {show?.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-orange-400" />
                  {show?.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seats + Price */}
        <div className="px-6 py-4 border-b border-neutral-800/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-\[10px] text-neutral-600 uppercase tracking-widest font-bold mb-1.5">
                Seats Booked
              </p>
              <p className="text-sm font-semibold text-white break-words">
                {seatLabels}
              </p>
              <p className="text-\[11px] text-neutral-500 mt-1">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-\[10px] text-neutral-600 uppercase tracking-widest font-bold mb-1">
                Amount Paid
              </p>
              <p className="text-xl font-extrabold text-orange-400">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex items-center justify-center py-5 border-b border-neutral-800/50">
          <div className="flex items-center gap-6">
            <div className="vp-qr" />
            <div>
              <p className="text-\[10px] text-neutral-600 uppercase tracking-widest font-bold mb-1">
                Scan to Check-In
              </p>
              <p className="text-xs text-neutral-400">
                Show at the gate
              </p>
              <p className="text-\[10px] text-neutral-600 mt-1 font-mono">
                {bookingRef}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 flex gap-3">
          <button
            id="download-ticket-btn"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/70 border border-neutral-700/50 text-sm font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <Download size={15} />
            Download Ticket
          </button>
          <button
            id="done-booking-btn"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer vp-proceed-btn"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}