"use client";

import { useState, useCallback } from "react";
import {
  Film,
  ChevronRight,
  SunMedium,
  Activity
} from "lucide-react";

import MovieSeatMap from "./MovieSeatMap";
import ArenaSeatMap from "./ArenaSeatMap";
import OpenSpaceSeatMap from "./OpenSpaceSeatMap";

/* ─── Static Data ─────────────────────────────────── */
const CATEGORIES = [
  {
    id: "movie",
    label: "Theatre",
    Icon: Film,
    bg: "linear-gradient(135deg,#7c3aed,#9333ea)",
    shadow: "rgba(124,58,237,0.35)",
    inactiveBorder: "#3d2a6e",
    inactiveText: "#a78bfa",
  },
  {
    id: "open_space",
    label: "Open Space",
    Icon: SunMedium,
    bg: "linear-gradient(135deg,#f59e0b,#d97706)",
    shadow: "rgba(245,158,11,0.35)",
    inactiveBorder: "#78350f",
    inactiveText: "#fbbf24",
  },
  {
    id: "arena",
    label: "Arena",
    Icon: Activity,
    bg: "linear-gradient(135deg,#e11d48,#be123c)",
    shadow: "rgba(225,29,72,0.35)",
    inactiveBorder: "#881337",
    inactiveText: "#fb7185",
  },
];

const LEGEND = {
  movie: [
    { css: "bg-neutral-800 border-b-2 border-neutral-600", label: "Standard", price: "₹250" },
    { css: "bg-purple-900/60 border-b-2 border-purple-600", label: "Premium", price: "₹450" },
    { css: "bg-amber-900/50 border-b-2 border-amber-600", label: "Recliner", price: "₹850" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked", price: "" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected", price: "" },
  ],
  open_space: [
    { css: "bg-neutral-800 border-b-2 border-neutral-600", label: "General Admission", price: "₹500" },
    { css: "bg-purple-900/60 border-b-2 border-purple-600", label: "Premium Pod", price: "₹1500" },
    { css: "bg-yellow-900/60 border-b-2 border-yellow-600", label: "VIP Pod", price: "₹2000" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked", price: "" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected", price: "" },
  ],
  arena: [
    { css: "bg-green-900/60 border-b-2 border-green-600", label: "Floor Pit", price: "₹1500" },
    { css: "bg-rose-900/60 border-b-2 border-rose-600", label: "Lower Bowl", price: "₹900-1000" },
    { css: "bg-indigo-900/60 border-b-2 border-indigo-600", label: "Upper Bowl", price: "₹500" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked", price: "" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected", price: "" },
  ],
};



/* ─── Category Selector ───────────────────────────── */
function CategorySelector({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            id={`cat-btn-${cat.id}`}
            onClick={() => onCategoryChange(cat.id)}
            style={
              isActive
                ? { background: cat.bg, boxShadow: `0 4px 22px ${cat.shadow}`, transform: "scale(1.04)" }
                : { borderColor: "rgba(255,255,255,0.06)" }
            }
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              isActive
                ? "text-white border-transparent"
                : "bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800/80"
            }`}
          >
            <cat.Icon size={15} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Seat Legend ─────────────────────────────────── */
function SeatLegend({ category }) {
  const items = LEGEND[category] || [];
  return (
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5 justify-center px-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className={`w-5 h-\[18px] rounded-t inline-block flex-shrink-0 ${item.css}`}
          />
          <span className="text-\[11px] text-neutral-400 font-medium">
            {item.label}
            {item.price ? (
              <span className="text-neutral-500 ml-1">{item.price}</span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────── */
export default function SeatBookingMain() {
  const [activeCategory, setActiveCategory] = useState("movie");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setSelectedSeats([]);
  }, []);

  const handleSeatToggle = useCallback((seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= 8) return prev;
      return [...prev, seat];
    });
  }, []);

  const mapProps = { selectedSeats, onSeatToggle: handleSeatToggle };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* ── Page Banner ── */}
      <div className="border-b border-neutral-800/50 bg-neutral-950 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
            <a
              href="/"
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Home
            </a>
            <ChevronRight size={12} />
            <span className="text-orange-400 font-semibold">Seat Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Choose Your Seats
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Select up to 8 seats · Theatre
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Category Tabs */}
        <CategorySelector
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Seat Map */}
        <div className="vp-fade-up">

          {/* Seat Map Container */}
          <div className="mt-4 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-5 sm:p-7 overflow-x-auto vp-scroll">
            {activeCategory === "movie" && (
              <MovieSeatMap key="movie" {...mapProps} />
            )}
            {activeCategory === "open_space" && (
              <OpenSpaceSeatMap key="open_space" {...mapProps} />
            )}
            {activeCategory === "arena" && (
              <ArenaSeatMap key="arena" {...mapProps} />
            )}
          </div>

          <SeatLegend category={activeCategory} />
        </div>
      </div>
    </div>
  );
}