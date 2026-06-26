"use client";

/* ──────────────────────────────────────────────────
   EVENT SEAT MAP — Stadium / Arena Layout
   Sections: VIP (front) · Gold (L/C/R) · Silver · General
   ────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "vip",
    label: "VIP",
    type: "vip",
    price: 5000,
    rows: ["V1", "V2", "V3"],
    cols: 8,
    accent: "#f59e0b",
    bg: "rgba(161,98,7,0.14)",
    border: "rgba(245,158,11,0.3)",
    description: "Front-Centre · Best View",
    full: false,
  },
  {
    id: "gold-l",
    label: "Gold — Left",
    type: "gold",
    price: 3000,
    rows: ["GL1", "GL2", "GL3", "GL4"],
    cols: 6,
    accent: "#fb923c",
    bg: "rgba(180,83,9,0.14)",
    border: "rgba(251,146,60,0.3)",
    description: "Left Block",
    full: false,
  },
  {
    id: "gold-c",
    label: "Gold — Centre",
    type: "gold",
    price: 3000,
    rows: ["GC1", "GC2", "GC3", "GC4"],
    cols: 8,
    accent: "#fb923c",
    bg: "rgba(180,83,9,0.14)",
    border: "rgba(251,146,60,0.3)",
    description: "Centre Block",
    full: false,
  },
  {
    id: "gold-r",
    label: "Gold — Right",
    type: "gold",
    price: 3000,
    rows: ["GR1", "GR2", "GR3", "GR4"],
    cols: 6,
    accent: "#fb923c",
    bg: "rgba(180,83,9,0.14)",
    border: "rgba(251,146,60,0.3)",
    description: "Right Block",
    full: false,
  },
  {
    id: "silver",
    label: "Silver",
    type: "silver",
    price: 1500,
    rows: ["S1", "S2", "S3", "S4", "S5"],
    cols: 14,
    accent: "#94a3b8",
    bg: "rgba(71,85,105,0.14)",
    border: "rgba(148,163,184,0.25)",
    description: "Mid Section",
    full: true,
  },
  {
    id: "general",
    label: "General",
    type: "general",
    price: 800,
    rows: ["G1", "G2", "G3"],
    cols: 18,
    accent: "#818cf8",
    bg: "rgba(55,48,163,0.14)",
    border: "rgba(129,140,248,0.25)",
    description: "Open Seating",
    full: true,
  },
];

/* Hard-coded booked seat IDs by section */
const BOOKED = new Set([
  "vip-V1-2","vip-V1-5","vip-V2-3","vip-V2-7","vip-V3-1","vip-V3-6",
  "gold-l-GL1-2","gold-l-GL1-5","gold-l-GL2-3","gold-l-GL3-1","gold-l-GL4-4",
  "gold-c-GC1-2","gold-c-GC1-6","gold-c-GC2-4","gold-c-GC2-7","gold-c-GC3-3","gold-c-GC4-1","gold-c-GC4-5",
  "gold-r-GR1-3","gold-r-GR2-1","gold-r-GR3-5","gold-r-GR4-2",
  "silver-S1-2","silver-S1-7","silver-S1-12","silver-S2-4","silver-S2-9","silver-S2-14",
  "silver-S3-3","silver-S3-8","silver-S3-11","silver-S4-5","silver-S4-10","silver-S5-2","silver-S5-7","silver-S5-13",
  "general-G1-3","general-G1-9","general-G1-15","general-G2-5","general-G2-11","general-G2-17",
  "general-G3-2","general-G3-7","general-G3-12","general-G3-16",
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

function SectionGrid({ sec, selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);

  return (
    <div
      className="rounded-xl p-3 sm:p-4 flex-shrink-0"
      style={{
        background: sec.bg,
        border: `1px solid ${sec.border}`,
        minWidth: sec.full ? "100%" : "auto",
      }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span
            className="text-[10px] font-extrabold tracking-widest uppercase"
            style={{ color: sec.accent }}
          >
            {sec.label}
          </span>
          <span className="text-\[9px] text-neutral-600 ml-2">{sec.description}</span>
        </div>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${sec.accent}18`, color: sec.accent }}
        >
          ₹{sec.price.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {sec.rows.map((row) => (
          <div key={row} className="flex items-center gap-1">
            <span className="text-\[9px] text-neutral-700 font-mono w-8 text-right select-none flex-shrink-0">
              {row}
            </span>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: sec.cols }, (_, i) => i + 1).map((col) => {
                const id = `${sec.id}-${row}-${col}`;
                const booked = BOOKED.has(id);
                const selected = isSelected(id);
                const seat = {
                  id,
                  label: `${row}-${col}`,
                  type: sec.type,
                  section: sec.label,
                  price: sec.price,
                };

                return (
                  <div key={col} className="vp-tip-wrap">
                    <button
                      id={`eseat-${id}`}
                      className={getSeatClass(sec.type, selected, booked)}
                      onClick={() => !booked && onSeatToggle(seat)}
                      disabled={booked}
                      aria-label={`${row}-${col} · ${sec.label} · ₹${sec.price}`}
                    >
                      {col}
                    </button>
                    <span className="vp-tip">
                      {booked ? "Booked" : `${row}-${col} · ₹${sec.price.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventSeatMap({ selectedSeats, onSeatToggle }) {
  return (
    <div className="space-y-4" style={{ minWidth: 520 }}>
      {/* Stage */}
      <div className="vp-event-stage rounded-xl p-3 text-center mb-2">
        <span className="text-xs font-extrabold tracking-\[0.3em] text-orange-300 uppercase">
          🎭 &nbsp; STAGE / SCREEN &nbsp; 🎭
        </span>
      </div>

      {/* VIP — Full width */}
      <SectionGrid
        sec={SECTIONS[0]}
        selectedSeats={selectedSeats}
        onSeatToggle={onSeatToggle}
      />

      {/* Gold — 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SECTIONS.slice(1, 4).map((sec) => (
          <SectionGrid
            key={sec.id}
            sec={sec}
            selectedSeats={selectedSeats}
            onSeatToggle={onSeatToggle}
          />
        ))}
      </div>

      {/* Silver — Full width */}
      <SectionGrid
        sec={SECTIONS[4]}
        selectedSeats={selectedSeats}
        onSeatToggle={onSeatToggle}
      />

      {/* General — Full width */}
      <SectionGrid
        sec={SECTIONS[5]}
        selectedSeats={selectedSeats}
        onSeatToggle={onSeatToggle}
      />
    </div>
  );
}