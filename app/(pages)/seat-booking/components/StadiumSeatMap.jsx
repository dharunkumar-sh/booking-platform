"use client";

const STADIUM_CONFIG = {
  field: { type: "floor", section: "Premium Field", price: 1500, rows: 4, cols: 10 },
  north: { type: "premium", section: "North Stand", price: 800, rows: 4, cols: 12 },
  south: { type: "premium", section: "South Stand", price: 800, rows: 4, cols: 12 },
  west: { type: "silver", section: "West Stand", price: 600, rows: 6, cols: 4 },
  east: { type: "silver", section: "East Stand", price: 600, rows: 6, cols: 4 },
};

const BOOKED_STADIUM = new Set([
  "field-1-3", "field-2-8", "field-3-1",
  "north-1-2", "north-3-5", "south-2-1", "south-4-8",
  "west-2-3", "west-5-1", "east-1-2", "east-4-4"
]);

function getSeatClass(type, isSelected, isBooked) {
  if (isBooked) return "vp-seat vp-seat-booked";
  if (isSelected) return `vp-seat vp-seat-${type}-selected`;
  return `vp-seat vp-seat-${type}`;
}

export default function StadiumSeatMap({ selectedSeats, onSeatToggle }) {
  const isSelected = (id) => selectedSeats.some((s) => s.id === id);

  const renderBlock = (blockId, config) => {
    const { type, section, price, rows, cols } = config;
    return (
      <div className="flex flex-col gap-1 items-center bg-neutral-900/30 p-3 rounded-xl border border-neutral-800/40">
        <div className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
          {section}
        </div>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-1">
            {Array.from({ length: cols }).map((_, cIdx) => {
              const rowNum = rIdx + 1;
              const colNum = cIdx + 1;
              const id = `${blockId}-${rowNum}-${colNum}`;
              const booked = BOOKED_STADIUM.has(id);
              const selected = isSelected(id);
              const seat = {
                id,
                label: `${blockId.toUpperCase()} R${rowNum} S${colNum}`,
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
    <div className="flex flex-col items-center gap-6" style={{ minWidth: 680 }}>
      {/* ── Stadium Info / Scoreboard Banner ── */}
      <div className="w-full max-w-md h-12 bg-linear-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-2">
        <span className="text-[10px] font-black tracking-[0.5em] text-orange-400 uppercase">
          STADIUM MAIN SCREEN
        </span>
      </div>

      {/* ── North Stand (Top) ── */}
      <div className="flex justify-center w-full">
        {renderBlock("north", STADIUM_CONFIG.north)}
      </div>

      {/* ── Middle Row: West Stand + Field Seating + East Stand ── */}
      <div className="flex justify-center items-center gap-6 w-full px-2">
        {/* West Stand (Rotated 90 deg or left aligned) */}
        <div>
          {renderBlock("west", STADIUM_CONFIG.west)}
        </div>

        {/* Premium Field Seating */}
        <div className="p-4 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20">
          <div className="text-center mb-3">
             <span className="text-[9px] font-bold tracking-widest text-green-500 uppercase">Field Area</span>
          </div>
          {renderBlock("field", STADIUM_CONFIG.field)}
        </div>

        {/* East Stand */}
        <div>
          {renderBlock("east", STADIUM_CONFIG.east)}
        </div>
      </div>

      {/* ── South Stand (Bottom) ── */}
      <div className="flex justify-center w-full">
        {renderBlock("south", STADIUM_CONFIG.south)}
      </div>
    </div>
  );
}
