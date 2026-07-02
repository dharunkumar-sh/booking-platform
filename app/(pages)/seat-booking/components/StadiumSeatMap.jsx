"use client";

const STADIUM_CONFIG = {
  field: { type: "floor", section: "Premium Field", price: 1500, rows: 4, cols: 10 },
  north: { type: "premium", section: "North Stand", price: 800, rows: 4, cols: 12 },
  south: { type: "premium", section: "South Stand", price: 800, rows: 4, cols: 12 },
  west: { type: "silver", section: "West Stand", price: 600, rows: 6, cols: 4 },
  east: { type: "silver", section: "East Stand", price: 600, rows: 6, cols: 4 },
};

import React, { useState, useEffect } from "react";

const BOOKED_STADIUM = new Set();

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function StadiumSeatMap({ eventId, selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);
  const [dbBookedSeats, setDbBookedSeats] = useState(new Set());
  const [hasCheckedDb, setHasCheckedDb] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setDbBookedSeats(BOOKED_STADIUM);
      setHasCheckedDb(true);
      return;
    }
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
  }, [eventId]);

  const renderBlock = (blockId, config) => {
    const { type, section, price, rows, cols } = config;

    return (
      <div className="flex flex-col gap-1.5 items-center p-1 rounded-xl">
        <div className="text-[8px] font-black tracking-widest uppercase text-neutral-400 mb-1">
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
                label: `${blockId.toUpperCase()} R${rowNum} S${colNum}`,
                type,
                section,
                price,
              };

              // Compute offset for curved stadium bowl layout
              let transformStyle = {};
              if (blockId === "north") {
                const offset = Math.pow(cIdx - (cols - 1) / 2, 2) * 1.8;
                transformStyle = { transform: `translateY(${offset}px)` };
              } else if (blockId === "south") {
                const offset = -Math.pow(cIdx - (cols - 1) / 2, 2) * 1.8;
                transformStyle = { transform: `translateY(${offset}px)` };
              } else if (blockId === "west") {
                const offset = Math.pow(rIdx - (rows - 1) / 2, 2) * 1.8;
                transformStyle = { transform: `translateX(${offset}px)` };
              } else if (blockId === "east") {
                const offset = -Math.pow(rIdx - (rows - 1) / 2, 2) * 1.8;
                transformStyle = { transform: `translateX(${offset}px)` };
              }

              return (
                <div key={colNum} className="vp-tip-wrap" style={transformStyle}>
                  <button
                    className={getSeatClass(type, selected, booked)}
                    onClick={() => !booked && onSeatToggle(seat)}
                    disabled={booked}
                    aria-label={`${section} R${rowNum} S${colNum} · ₹${price}`}
                  />
                  {!booked && (
                    <span className="vp-tip">
                      {section} Row {rowNum} Seat {colNum} · ₹{price}
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
    <div className="flex flex-col items-center gap-8 py-6 px-4 select-none" style={{ minWidth: 800 }}>
      {/* Stadium Header with Floodlights */}
      <div className="w-full flex justify-between items-center px-8 mb-2">
        {/* Left Floodlight */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-[0_0_15px_rgba(251,146,60,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
          </div>
          <span className="text-[7px] font-bold text-neutral-600 tracking-wider">GATE A-D LIGHTS</span>
        </div>

        {/* Big Screen */}
        <div className="w-80 h-10 bg-black/90 border border-neutral-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-gradient(from center, rgba(249,115,22,0.1), transparent) pointer-events-none" />
          <span className="text-[10px] font-black tracking-[0.4em] text-orange-400 uppercase animate-pulse">
            ★ STADIUM LIVE BOWL ★
          </span>
        </div>

        {/* Right Floodlight */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-[0_0_15px_rgba(251,146,60,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
          </div>
          <span className="text-[7px] font-bold text-neutral-600 tracking-wider">GATE E-H LIGHTS</span>
        </div>
      </div>

      {/* Stadium Outer Bowl Contour */}
      <div className="w-full max-w-[850px] border border-neutral-800/80 rounded-[48px] bg-neutral-950/40 p-8 flex flex-col items-center gap-8 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative">
        
        {/* Glow effect on the bowl */}
        <div className="absolute inset-0 rounded-[48px] border border-orange-500/10 pointer-events-none" />

        {/* ── North Stand (Top) ── */}
        <div className="flex justify-center w-full pb-4">
          <div className="bg-neutral-900/40 border border-neutral-800/50 p-4 rounded-3xl relative">
            {renderBlock("north", STADIUM_CONFIG.north)}
          </div>
        </div>

        {/* ── Middle Row: West Stand + Pitch Field + East Stand ── */}
        <div className="flex justify-between items-center w-full gap-4">
          
          {/* West Stand (Left Side) */}
          <div className="bg-neutral-900/40 border border-neutral-800/50 p-4 rounded-3xl">
            {renderBlock("west", STADIUM_CONFIG.west)}
          </div>

          {/* Realistic Turf Green Pitch/Field */}
          <div 
            className="flex-1 max-w-[420px] h-[280px] rounded-[36px] overflow-hidden border-2 border-emerald-600/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center relative"
            style={{
              background: "repeating-linear-gradient(90deg, #166534 0px, #166534 20px, #14532d 20px, #14532d 40px)",
            }}
          >
            {/* White Pitch Markings */}
            <div className="absolute inset-3 border border-white/20 rounded-[28px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/20 rounded-full pointer-events-none" />
            
            {/* Stage / Screen banner at the top of the field */}
            <div className="z-10 mb-3 bg-black/70 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[8px] font-black tracking-widest text-neutral-200 uppercase">STAGE AREA</span>
            </div>

            {/* Premium Field Seating glass container */}
            <div className="z-10 bg-black/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <div className="text-center mb-1">
                <span className="text-[7px] font-black tracking-widest text-green-400 uppercase">FIELD SEATS</span>
              </div>
              {renderBlock("field", STADIUM_CONFIG.field)}
            </div>
          </div>

          {/* East Stand (Right Side) */}
          <div className="bg-neutral-900/40 border border-neutral-800/50 p-4 rounded-3xl">
            {renderBlock("east", STADIUM_CONFIG.east)}
          </div>
        </div>

        {/* ── South Stand (Bottom) ── */}
        <div className="flex justify-center w-full pt-4">
          <div className="bg-neutral-900/40 border border-neutral-800/50 p-4 rounded-3xl relative">
            {renderBlock("south", STADIUM_CONFIG.south)}
          </div>
        </div>
      </div>

      {/* Seat Category Info Banner */}
      <div className="flex gap-4 items-center justify-center text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-2">
        <span>🏟 TOTAL STADIUM CAPACITY: 100 SEATS</span>
        <span>•</span>
        <span>🚪 GATE ACCESS ONLY</span>
      </div>
    </div>
  );
}
