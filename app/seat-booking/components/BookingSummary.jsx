"use client";

import { Ticket, X, ArrowRight, Trash2, Users } from "lucide-react";

const CAT_EMOJI = { movie: "🎬", event: "🎉", concert: "🎸", travel: "🚌" };

export default function BookingSummary({
  show,
  category,
  selectedSeats,
  subtotal,
  convenienceFee,
  total,
  onProceed,
  onClear,
}) {
  const hasSeats = selectedSeats.length > 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg, rgba(15,15,25,0.97), rgba(22,22,38,0.97))",
        border: "1px solid rgba(249,115,22,0.18)",
        boxShadow: "0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Ticket size={15} className="text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Booking Summary</p>
            <p className="text-\[10px] text-neutral-500">
              {selectedSeats.length}/8 seats selected
            </p>
          </div>
        </div>
        {hasSeats && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Show Info */}
      <div className="px-5 py-3 border-b border-neutral-800/40">
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0">{CAT_EMOJI[category]}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight truncate">
              {show?.title}
            </p>
            <p className="text-\[11px] text-neutral-500 mt-0.5 truncate">
              {show?.venue}
            </p>
            <p className="text-\[11px] text-orange-400 font-medium mt-0.5">
              {show?.date} · {show?.time}
            </p>
          </div>
        </div>
      </div>

      {/* Seat List */}
      <div className="px-5 py-4">
        {!hasSeats ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-neutral-800/60 flex items-center justify-center mx-auto mb-3">
              <Users size={20} className="text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 font-medium">No seats selected</p>
            <p className="text-\[11px] text-neutral-700 mt-1">
              Click on an available seat to begin
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-\[10px] text-neutral-600 uppercase tracking-widest font-bold mb-2">
              Selected Seats
            </p>
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-800/40 border border-neutral-700/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-5 rounded-t border-b-2 border-orange-600 bg-orange-500/80 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">{seat.label}</p>
                    <p className="text-\[10px] text-neutral-500 truncate">{seat.section}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-orange-400 flex-shrink-0 ml-2">
                  ₹{seat.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      {hasSeats && (
        <div className="px-5 pb-4 space-y-2">
          <div className="h-px bg-neutral-800/60 mb-3" />
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Subtotal ({selectedSeats.length} seats)</span>
            <span className="font-semibold text-white">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Convenience Fee (10%)</span>
            <span className="font-semibold text-white">
              ₹{convenienceFee.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-px bg-neutral-800/60 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Total Payable</span>
            <span className="text-lg font-extrabold text-orange-400">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          id="proceed-to-pay-btn"
          onClick={onProceed}
          disabled={!hasSeats}
          className="vp-proceed-btn w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
        >
          {hasSeats ? (
            <>
              Proceed to Pay · ₹{total.toLocaleString("en-IN")}
              <ArrowRight size={15} />
            </>
          ) : (
            "Select seats to continue"
          )}
        </button>

        {hasSeats && (
          <p className="text-center text-\[10px] text-neutral-600 mt-2">
            Secure payment · Instant e-ticket
          </p>
        )}
      </div>
    </div>
  );
}