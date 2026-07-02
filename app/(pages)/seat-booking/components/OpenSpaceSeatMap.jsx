"use client";

/* ── Open Space specific logic ──────────────────────── */
// Open space usually has VIP pods (tables/clusters) and General Admission (lawn)

const PODS_CONFIG = [
  { id: "pod-1", section: "VIP Pod 1", price: 2000, type: "vip", size: 6 },
  { id: "pod-2", section: "VIP Pod 2", price: 2000, type: "vip", size: 6 },
  { id: "pod-3", section: "VIP Pod 3", price: 2000, type: "vip", size: 6 },
  { id: "pod-4", section: "Premium Pod A", price: 1500, type: "premium", size: 4 },
  { id: "pod-5", section: "Premium Pod B", price: 1500, type: "premium", size: 4 },
];

const LAWN_CONFIG = {
  section: "General Admission Lawn",
  price: 500,
  type: "standard",
  rows: 5,
  cols: 14,
};

import React, { useState, useEffect } from "react";

const BOOKED_OPEN_SPACE = new Set([
  "pod-1-2", "pod-1-3", "pod-2-6", "pod-4-1",
  "lawn-1-5", "lawn-1-6", "lawn-2-10", "lawn-3-4", "lawn-4-12", "lawn-5-2"
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function OpenSpaceSeatMap({ eventId, selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);
  const [dbBookedSeats, setDbBookedSeats] = useState(new Set());
  const [hasCheckedDb, setHasCheckedDb] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setDbBookedSeats(BOOKED_OPEN_SPACE);
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

  return (
    <div className="flex flex-col items-center gap-8" style={{ minWidth: 600 }}>
      {/* ── Outdoor Stage ── */}
      <div className="w-full max-w-lg mb-4">
        <div className="h-12 w-full bg-linear-to-b from-orange-500/20 to-transparent border-t-2 border-orange-500 rounded-t-2xl flex items-center justify-center shadow-[0_-10px_40px_rgba(249,115,22,0.15)]">
          <span className="text-xs font-bold tracking-[0.3em] text-orange-400">
            FESTIVAL MAIN STAGE
          </span>
        </div>
      </div>

      {/* ── VIP Pods ── */}
      <div className="w-full flex flex-wrap justify-center gap-8 px-4">
        {PODS_CONFIG.map((pod) => (
          <div key={pod.id} className="flex flex-col items-center bg-neutral-900/30 p-3 rounded-[2rem] border border-neutral-700/50">
            <span className="text-[9px] font-bold tracking-wider uppercase text-neutral-400 mb-2">
              {pod.section}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5" style={{ width: pod.size > 4 ? "80px" : "60px" }}>
              {Array.from({ length: pod.size }).map((_, idx) => {
                const seatNum = idx + 1;
                const id = `${pod.id}-${seatNum}`;
                const booked = hasCheckedDb && dbBookedSeats.has(id);
                const selected = isSelected(id);
                const seat = {
                  id,
                  label: `${pod.section} S${seatNum}`,
                  type: pod.type,
                  section: pod.section,
                  price: pod.price,
                };

                return (
                  <div key={seatNum} className="vp-tip-wrap">
                    <button
                      className={getSeatClass(pod.type, selected, booked)}
                      style={{ borderRadius: "50%", height: "20px", width: "20px" }}
                      onClick={() => !booked && onSeatToggle(seat)}
                      disabled={booked}
                      aria-label={`${pod.section} Seat ${seatNum} · ₹${pod.price}`}
                    />
                    {!booked && (
                      <span className="vp-tip">
                        {pod.section} Seat {seatNum} · ₹{pod.price}
                      </span>
                    )}
                    {booked && <span className="vp-tip">Booked</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Lawn / General Admission ── */}
      <div className="w-full max-w-2xl bg-green-900/10 border border-green-800/30 rounded-3xl p-6 mt-4">
         <div className="text-center mb-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-green-500/80">
              {LAWN_CONFIG.section} (₹{LAWN_CONFIG.price})
            </span>
         </div>
         <div className="flex flex-col items-center gap-2">
           {Array.from({ length: LAWN_CONFIG.rows }).map((_, rIdx) => (
             <div key={rIdx} className="flex gap-2">
               {Array.from({ length: LAWN_CONFIG.cols }).map((_, cIdx) => {
                 // Creating a slightly scattered look for the lawn
                 const offset = (rIdx % 2 === 0) ? "translate-x-2" : "";
                 
                 const rowNum = rIdx + 1;
                 const colNum = cIdx + 1;
                 const id = `lawn-${rowNum}-${colNum}`;
                 const booked = hasCheckedDb && dbBookedSeats.has(id);
                 const selected = isSelected(id);
                 const seat = {
                   id,
                   label: `Lawn R${rowNum} S${colNum}`,
                   type: LAWN_CONFIG.type,
                   section: LAWN_CONFIG.section,
                   price: LAWN_CONFIG.price,
                 };

                 return (
                   <div key={colNum} className={`vp-tip-wrap ${offset}`}>
                     <button
                       className={getSeatClass(LAWN_CONFIG.type, selected, booked)}
                       style={{ borderRadius: "8px", width: "22px", height: "22px" }}
                       onClick={() => !booked && onSeatToggle(seat)}
                       disabled={booked}
                       aria-label={`Lawn R${rowNum} S${colNum} · ₹${LAWN_CONFIG.price}`}
                     />
                     {!booked && (
                       <span className="vp-tip">
                         Lawn Row {rowNum} Seat {colNum} · ₹{LAWN_CONFIG.price}
                       </span>
                     )}
                     {booked && <span className="vp-tip">Booked</span>}
                   </div>
                 );
               })}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
