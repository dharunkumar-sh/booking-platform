"use client";

/* ── Arena specific logic ──────────────────────── */
// U-Shape representation
// We can represent this with distinct blocks: Left, Center, Right

const ARENA_CONFIG = {
  floor: { type: "floor", section: "Floor Pit", price: 1500, rows: 4, cols: 10 },
  lowerLeft: { type: "pit", section: "Lower Bowl Left", price: 900, rows: 6, cols: 4 },
  lowerRight: { type: "pit", section: "Lower Bowl Right", price: 900, rows: 6, cols: 4 },
  lowerCenter: { type: "pit", section: "Lower Bowl Center", price: 1000, rows: 5, cols: 12 },
  upperCenter: { type: "upper", section: "Upper Bowl Center", price: 500, rows: 4, cols: 16 },
};

import React, { useState, useEffect } from "react";

const BOOKED_ARENA = new Set();

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function ArenaSeatMap({ eventId, selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);
  const [dbBookedSeats, setDbBookedSeats] = useState(new Set());
  const [hasCheckedDb, setHasCheckedDb] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setDbBookedSeats(BOOKED_ARENA);
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

  const renderBlock = (blockId, config) => {
    const { type, section, price, rows, cols } = config;
    return (
      <div className="flex flex-col gap-1 items-center bg-neutral-900/20 p-3 rounded-xl border border-neutral-800/40">
        <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
          {section}
        </div>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-1">
            {Array.from({ length: cols }).map((_, cIdx) => {
              const rowNum = rIdx + 1;
              const colNum = cIdx + 1;
              const id = `${blockId}-${rowNum}-${colNum}`;
              const booked = hasCheckedDb && dbBookedSeats.has(id);
              const selected = isSelected(id);
              const seat = {
                id,
                label: `R${rowNum} S${colNum}`,
                type,
                section,
                price,
              };

              return (
                <div key={colNum} className="vp-tip-wrap">
                  <button
                    className={getSeatClass(type, selected, booked)}
                    onClick={() => !booked && onSeatToggle(seat)}
                    disabled={booked}
                    aria-label={`R${rowNum} S${colNum} · ${section} · ₹${price}`}
                  >
                    {/* Visual seat without numbers for arena scale */}
                  </button>
                  {!booked && (
                    <span className="vp-tip">
                      Row {rowNum} Seat {colNum} · {section} · ₹{price}
                    </span>
                  )}
                  {booked && <span className="vp-tip">Booked</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6" style={{ minWidth: 640 }}>
      {/* ── Arena Stage ── */}
      <div className="w-full max-w-sm h-16 vp-event-stage flex items-center justify-center mb-4">
        <span className="text-xs font-black tracking-[0.4em] text-orange-400/80 uppercase">
          Center Stage
        </span>
      </div>

      {/* ── Floor Seating ── */}
      <div className="flex justify-center mb-4">
        {renderBlock("floor", ARENA_CONFIG.floor)}
      </div>

      {/* ── Lower Bowl (U-Shape) ── */}
      <div className="flex justify-center items-end gap-6 w-full px-4">
        <div className="transform -rotate-12 translate-y-4">
          {renderBlock("lowerLeft", ARENA_CONFIG.lowerLeft)}
        </div>
        
        <div className="flex flex-col items-center gap-4">
           {renderBlock("lowerCenter", ARENA_CONFIG.lowerCenter)}
           {renderBlock("upperCenter", ARENA_CONFIG.upperCenter)}
        </div>

        <div className="transform rotate-12 translate-y-4">
          {renderBlock("lowerRight", ARENA_CONFIG.lowerRight)}
        </div>
      </div>
    </div>
  );
}
