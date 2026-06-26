"use client";

/* ──────────────────────────────────────────────────
   TRAVEL SEAT MAP — Bus Layout (2 + 2, 10 rows)
   A = Window Left  (₹1,200)
   B = Aisle Left   (₹1,100)
   | aisle |
   C = Aisle Right  (₹1,100)
   D = Window Right (₹1,200)
   ────────────────────────────────────────────────── */

const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SEAT_CONFIG = {
  A: { type: "window", label: "Window", price: 1200, side: "left" },
  B: { type: "aisle", label: "Aisle", price: 1100, side: "left" },
  C: { type: "aisle", label: "Aisle", price: 1100, side: "right" },
  D: { type: "window", label: "Window", price: 1200, side: "right" },
};

const POSITIONS = ["A", "B", "C", "D"];

const BOOKED = new Set([
  "1A", "1C",
  "2B", "2D",
  "3A", "3D",
  "4C",
  "5A", "5B",
  "6D",
  "7A", "7C",
  "8B",
  "9A", "9D",
  "10C",
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function TravelSeatMap({ selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);

  return (
    <div className="flex flex-col items-center" style={{ minWidth: 320 }}>
      {/* Bus body wrapper */}
      <div className="vp-bus-wrap w-full max-w-xs rounded-2xl overflow-hidden">
        {/* Driver Cabin */}
        <div className="vp-bus-cabin px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚌</span>
            <div>
              <p className="text-\[10px] font-bold text-sky-400 tracking-widest uppercase">Driver Cabin</p>
              <p className="text-\[9px] text-neutral-600">Front of Bus</p>
            </div>
          </div>
          <div className="w-10 h-7 rounded-full border-2 border-sky-700/40 flex items-center justify-center">
            <span className="text-\[16px]">🛞</span>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center justify-center px-6 py-2 border-b border-sky-900/30">
          <div className="flex gap-1 w-full max-w-\[220px]">
            {/* Left side labels */}
            <div className="flex gap-1 flex-1 justify-end">
              <span className="text-\[9px] text-neutral-600 w-\[26px] text-center font-bold">A</span>
              <span className="text-\[9px] text-neutral-600 w-\[26px] text-center font-bold">B</span>
            </div>
            {/* Aisle */}
            <div className="w-7 text-center">
              <span className="text-\[8px] text-neutral-800">│</span>
            </div>
            {/* Right side labels */}
            <div className="flex gap-1 flex-1 justify-start">
              <span className="text-\[9px] text-neutral-600 w-\[26px] text-center font-bold">C</span>
              <span className="text-\[9px] text-neutral-600 w-\[26px] text-center font-bold">D</span>
            </div>
          </div>
        </div>

        {/* Seat Rows */}
        <div className="px-6 py-3 space-y-2">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-1">
              {/* Row number */}
              <span className="text-\[10px] text-neutral-700 font-mono w-4 text-right select-none flex-shrink-0">
                {row}
              </span>

              {/* Seats */}
              <div className="flex items-center gap-1 flex-1 justify-center">
                {/* Left block: A + B */}
                <div className="flex gap-1">
                  {["A", "B"].map((pos) => {
                    const id = `${row}${pos}`;
                    const cfg = SEAT_CONFIG[pos];
                    const booked = BOOKED.has(id);
                    const selected = isSelected(id);
                    const seat = { id, label: id, type: cfg.type, section: cfg.label, price: cfg.price };
                    return (
                      <div key={pos} className="vp-tip-wrap">
                        <button
                          id={`tseat-${id}`}
                          className={getSeatClass(cfg.type, selected, booked)}
                          onClick={() => !booked && onSeatToggle(seat)}
                          disabled={booked}
                          aria-label={`Seat ${id} · ${cfg.label} · ₹${cfg.price}`}
                        >
                          {pos}
                        </button>
                        <span className="vp-tip">
                          {booked ? "Booked" : `${id} · ${cfg.label} · ₹${cfg.price.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className="w-7 flex items-center justify-center flex-shrink-0">
                  <div className="h-5 w-px bg-sky-900/40" />
                </div>

                {/* Right block: C + D */}
                <div className="flex gap-1">
                  {["C", "D"].map((pos) => {
                    const id = `${row}${pos}`;
                    const cfg = SEAT_CONFIG[pos];
                    const booked = BOOKED.has(id);
                    const selected = isSelected(id);
                    const seat = { id, label: id, type: cfg.type, section: cfg.label, price: cfg.price };
                    return (
                      <div key={pos} className="vp-tip-wrap">
                        <button
                          id={`tseat-${id}`}
                          className={getSeatClass(cfg.type, selected, booked)}
                          onClick={() => !booked && onSeatToggle(seat)}
                          disabled={booked}
                          aria-label={`Seat ${id} · ${cfg.label} · ₹${cfg.price}`}
                        >
                          {pos}
                        </button>
                        <span className="vp-tip">
                          {booked ? "Booked" : `${id} · ${cfg.label} · ₹${cfg.price.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available indicator */}
              <span className="w-4" />
            </div>
          ))}
        </div>

        {/* Rear Door */}
        <div className="flex items-center justify-center gap-2 px-6 py-3 border-t border-sky-900/30 bg-sky-950/20">
          <div className="h-px flex-1 bg-sky-900/30" />
          <span className="text-\[10px] text-neutral-700 tracking-widest uppercase font-bold">
            REAR DOOR
          </span>
          <div className="h-px flex-1 bg-sky-900/30" />
        </div>
      </div>

      {/* Availability note */}
      <p className="text-\[10px] text-neutral-600 mt-4">
        {40 - BOOKED.size} seats available · {BOOKED.size} booked
      </p>
    </div>
  );
}