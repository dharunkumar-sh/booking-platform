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

const BOOKED_ARENA = new Set([
  "floor-1-3", "floor-1-4", "floor-2-8", "floor-3-1",
  "lowerLeft-1-2", "lowerLeft-3-3", "lowerRight-2-1",
  "lowerCenter-1-5", "lowerCenter-1-6", "lowerCenter-4-10",
  "upperCenter-1-8", "upperCenter-2-12", "upperCenter-3-4"
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function ArenaSeatMap({ selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);

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
              const booked = BOOKED_ARENA.has(id);
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
