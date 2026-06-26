"use client";

/* ──────────────────────────────────────────────────
   CONCERT SEAT MAP
   Layout (top → bottom, stage at top):
     Stage
     PIT (2 rows × 8)
     ─── Floor Left · Floor Centre · Floor Right ───
     Upper Left · Upper Right (3 rows × 8 each)
   ────────────────────────────────────────────────── */

const PIT_ROWS = ["P1", "P2"];
const PIT_COLS = 8;

const FLOOR_SECTIONS = [
  {
    id: "floor-l",
    label: "Floor — Left",
    type: "floor",
    price: 4000,
    rows: ["FL1", "FL2", "FL3", "FL4"],
    cols: 7,
    accent: "#34d399",
    bg: "rgba(6,78,59,0.18)",
    border: "rgba(52,211,153,0.28)",
  },
  {
    id: "floor-c",
    label: "Floor — Centre",
    type: "floor",
    price: 4000,
    rows: ["FC1", "FC2", "FC3", "FC4", "FC5"],
    cols: 10,
    accent: "#34d399",
    bg: "rgba(6,78,59,0.22)",
    border: "rgba(52,211,153,0.35)",
  },
  {
    id: "floor-r",
    label: "Floor — Right",
    type: "floor",
    price: 4000,
    rows: ["FR1", "FR2", "FR3", "FR4"],
    cols: 7,
    accent: "#34d399",
    bg: "rgba(6,78,59,0.18)",
    border: "rgba(52,211,153,0.28)",
  },
];

const UPPER_SECTIONS = [
  {
    id: "upper-l",
    label: "Upper Left",
    type: "upper",
    price: 1500,
    rows: ["UL1", "UL2", "UL3"],
    cols: 9,
    accent: "#818cf8",
    bg: "rgba(30,27,75,0.18)",
    border: "rgba(129,140,248,0.25)",
  },
  {
    id: "upper-r",
    label: "Upper Right",
    type: "upper",
    price: 1500,
    rows: ["UR1", "UR2", "UR3"],
    cols: 9,
    accent: "#818cf8",
    bg: "rgba(30,27,75,0.18)",
    border: "rgba(129,140,248,0.25)",
  },
];

const BOOKED = new Set([
  "pit-P1-1","pit-P1-4","pit-P1-7","pit-P2-2","pit-P2-5","pit-P2-8",
  "floor-l-FL1-2","floor-l-FL1-5","floor-l-FL2-3","floor-l-FL3-1","floor-l-FL4-4","floor-l-FL4-7",
  "floor-c-FC1-2","floor-c-FC1-6","floor-c-FC1-9","floor-c-FC2-4","floor-c-FC2-8",
  "floor-c-FC3-3","floor-c-FC3-7","floor-c-FC4-5","floor-c-FC5-2","floor-c-FC5-8",
  "floor-r-FR1-1","floor-r-FR1-5","floor-r-FR2-3","floor-r-FR3-6","floor-r-FR4-2",
  "upper-l-UL1-3","upper-l-UL1-7","upper-l-UL2-2","upper-l-UL2-5","upper-l-UL3-4","upper-l-UL3-8",
  "upper-r-UR1-2","upper-r-UR1-6","upper-r-UR2-4","upper-r-UR2-8","upper-r-UR3-3","upper-r-UR3-7",
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

function SeatGrid({ secId, type, rows, cols, selectedSeats, onSeatToggle, price }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);
  return (
    <div className="space-y-1">
      {rows.map((row) => (
        <div key={row} className="flex items-center gap-1">
          <span className="text-\[9px] text-neutral-700 font-mono w-8 text-right select-none flex-shrink-0">
            {row}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: cols }, (_, i) => i + 1).map((col) => {
              const id = `${secId}-${row}-${col}`;
              const booked = BOOKED.has(id);
              const selected = isSelected(id);
              const seat = { id, label: `${row}-${col}`, type, section: secId, price };
              return (
                <div key={col} className="vp-tip-wrap">
                  <button
                    id={`cseat-${id}`}
                    className={getSeatClass(type, selected, booked)}
                    onClick={() => !booked && onSeatToggle(seat)}
                    disabled={booked}
                    aria-label={`${row}-${col} · ₹${price}`}
                  >
                    {col}
                  </button>
                  <span className="vp-tip">
                    {booked ? "Booked" : `${row}-${col} · ₹${price.toLocaleString("en-IN")}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ sec, selectedSeats, onSeatToggle }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: sec.bg, border: `1px solid ${sec.border}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: sec.accent }}>
          {sec.label}
        </span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${sec.accent}18`, color: sec.accent }}>
          ₹{sec.price.toLocaleString("en-IN")}
        </span>
      </div>
      <SeatGrid
        secId={sec.id}
        type={sec.type}
        rows={sec.rows}
        cols={sec.cols}
        selectedSeats={selectedSeats}
        onSeatToggle={onSeatToggle}
        price={sec.price}
      />
    </div>
  );
}

export default function ConcertSeatMap({ selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);

  return (
    <div className="space-y-4" style={{ minWidth: 540 }}>
      {/* ── Stage ── */}
      <div className="vp-stage rounded-xl py-4 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-xl">🎸</span>
          <span className="text-base font-extrabold tracking-\[0.25em] uppercase text-violet-300">
            STAGE
          </span>
          <span className="text-xl">🎤</span>
        </div>
        <p className="text-\[10px] text-violet-500 tracking-widest">PERFORMER AREA — NO SEATING</p>
      </div>

      {/* ── PIT ── */}
      <div
        className="rounded-xl p-3"
        style={{
          background: "rgba(159,18,57,0.16)",
          border: "1px solid rgba(251,113,133,0.3)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-\[11px] font-extrabold tracking-widest uppercase text-rose-400">
            🔥 PIT — Floor Access
          </span>
          <span className="text-\[11px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400">
            ₹8,000
          </span>
        </div>
        <div className="flex justify-center">
          <SeatGrid
            secId="pit"
            type="pit"
            rows={PIT_ROWS}
            cols={PIT_COLS}
            selectedSeats={selectedSeats}
            onSeatToggle={onSeatToggle}
            price={8000}
          />
        </div>
      </div>

      {/* ── Floor Sections ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {FLOOR_SECTIONS.map((sec) => (
          <SectionBlock key={sec.id} sec={sec} selectedSeats={selectedSeats} onSeatToggle={onSeatToggle} />
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-neutral-800" />
        <span className="text-\[10px] text-neutral-600 tracking-widest uppercase">Upper Tier</span>
        <div className="flex-1 h-px bg-neutral-800" />
      </div>

      {/* ── Upper Sections ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {UPPER_SECTIONS.map((sec) => (
          <SectionBlock key={sec.id} sec={sec} selectedSeats={selectedSeats} onSeatToggle={onSeatToggle} />
        ))}
      </div>
    </div>
  );
}