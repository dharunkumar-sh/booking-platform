"use client";
import React, { useState, useEffect } from "react";

/* ── Row/seat configuration ──────────────────────── */
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const ROW_SECTION = {
  A: { type: "standard", section: "Standard", price: 250 },
  B: { type: "standard", section: "Standard", price: 250 },
  C: { type: "standard", section: "Standard", price: 250 },
  D: { type: "premium", section: "Premium", price: 450 },
  E: { type: "premium", section: "Premium", price: 450 },
  F: { type: "premium", section: "Premium", price: 450 },
  G: { type: "premium", section: "Premium", price: 450 },
  H: { type: "premium", section: "Premium", price: 450 },
  I: { type: "recliner", section: "Recliner", price: 850 },
  J: { type: "recliner", section: "Recliner", price: 850 },
};

/* Section divider appears BEFORE these rows */
const SECTION_START = {
  A: {
    label: "STANDARD",
    price: "₹250",
    color: "text-neutral-400",
    line: "rgba(100,100,120,0.3)",
  },
  D: {
    label: "PREMIUM",
    price: "₹450",
    color: "text-purple-400",
    line: "rgba(139,92,246,0.3)",
  },
  I: {
    label: "RECLINER",
    price: "₹850",
    color: "text-amber-400",
    line: "rgba(251,191,36,0.3)",
  },
};

/* Hard-coded booked seats (deterministic, ~35% occupancy) */
const BOOKED = new Set([
  "A-2","A-8","A-11",
  "B-3","B-7","B-13",
  "C-1","C-5","C-9","C-14",
  "D-2","D-6","D-10","D-12",
  "E-1","E-7","E-11","E-14",
  "F-4","F-8","F-12",
  "G-3","G-7","G-9","G-13",
  "H-2","H-6","H-10","H-14",
  "I-3","I-7","I-11",
  "J-2","J-5","J-9","J-13",
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function MovieSeatMap({ eventId, selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);
  const [dbBookedSeats, setDbBookedSeats] = useState(new Set());
  const [hasCheckedDb, setHasCheckedDb] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setDbBookedSeats(BOOKED);
      setHasCheckedDb(true);
      return;
    }

    const fetchBookedSeats = () => {
      fetch(`/api/bookings?eventId=${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.seats) {
            setDbBookedSeats(new Set(data.seats));
          }
          setHasCheckedDb(true);
        })
        .catch((err) => {
          console.error("Error checking seat bookings:", err);
          setHasCheckedDb(true);
        });
    };

    fetchBookedSeats();
    const intervalId = setInterval(fetchBookedSeats, 3000);

    return () => clearInterval(intervalId);
  }, [eventId]);

  return (
    <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 480 }}>
      {/* ── Screen ── */}
      <div className="w-full mb-6">
        <div className="vp-screen" />
        <p className="vp-screen-label">SCREEN — ALL EYES THIS WAY</p>
      </div>

      {/* ── Seat Grid ── */}
      {ROWS.map((row) => {
        const secCfg = ROW_SECTION[row];
        const divider = SECTION_START[row];

        return (
          <div key={row} className="w-full">
            {/* Section Divider */}
            {divider && (
              <div className="vp-section-divider my-2">
                <span
                  className={`text-\[10px] font-bold tracking-widest uppercase whitespace-nowrap ${divider.color}`}
                >
                  {divider.label}
                </span>
                <span className={`text-\[10px] ${divider.color} opacity-60`}>
                  {divider.price}
                </span>
              </div>
            )}

            {/* Row */}
            <div className="flex items-center justify-center gap-1">
              {/* Left label */}
              <span className="text-\[11px] text-neutral-600 font-mono w-5 text-right select-none flex-shrink-0">
                {row}
              </span>

              {/* Seats */}
              <div className="flex gap-1">
                {COLS.map((col) => {
                  const id = `${row}-${col}`;
                  const booked = hasCheckedDb && dbBookedSeats.has(id);
                  const selected = isSelected(id);
                  const seat = {
                    id,
                    label: `${row}${col}`,
                    type: secCfg.type,
                    section: secCfg.section,
                    price: secCfg.price,
                  };

                  /* Aisle gap between cols 7 and 8 */
                  return (
                    <div key={col} className="flex items-center gap-1">
                      {col === 8 && (
                        <div className="w-5 flex-shrink-0" aria-hidden="true" />
                      )}
                      <div className="vp-tip-wrap">
                        <button
                          id={`mseat-${id}`}
                          className={getSeatClass(secCfg.type, selected, booked)}
                          onClick={() => !booked && onSeatToggle(seat)}
                          disabled={booked}
                          aria-label={`${row}${col} · ${secCfg.section} · ₹${secCfg.price}`}
                        >
                          {col}
                        </button>
                        {!booked && (
                          <span className="vp-tip">
                            {row}{col} · {secCfg.section} · ₹{secCfg.price}
                          </span>
                        )}
                        {booked && (
                          <span className="vp-tip">Booked</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right label */}
              <span className="text-\[11px] text-neutral-600 font-mono w-5 text-left select-none flex-shrink-0">
                {row}
              </span>
            </div>
          </div>
        );
      })}

      {/* Column Numbers */}
      <div className="flex items-center justify-center gap-1 mt-3 ml-6">
        {COLS.map((col) => (
          <div key={col} className="flex items-center gap-1">
            {col === 8 && <div className="w-5 flex-shrink-0" />}
            <span
              className="text-[9px] text-neutral-700 font-mono"
              style={{ width: 26, textAlign: "center" }}
            >
              {col}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}