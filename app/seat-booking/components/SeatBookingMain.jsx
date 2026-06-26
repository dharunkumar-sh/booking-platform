"use client";

import { useState, useCallback } from "react";
import {
  Film,
  Calendar,
  Music,
  Bus,
  ChevronRight,
} from "lucide-react";
import ShowCards from "./ShowCards";
import VenueHeader from "./VenueHeader";
import MovieSeatMap from "./MovieSeatMap";
import EventSeatMap from "./EventSeatMap";
import ConcertSeatMap from "./ConcertSeatMap";
import TravelSeatMap from "./TravelSeatMap";
import BookingSummary from "./BookingSummary";
import ConfirmationModal from "./ConfirmationModal";

/* ─── Static Data ─────────────────────────────────── */
const CATEGORIES = [
  {
    id: "movie",
    label: "Movies",
    Icon: Film,
    bg: "linear-gradient(135deg,#7c3aed,#9333ea)",
    shadow: "rgba(124,58,237,0.35)",
    inactiveBorder: "#3d2a6e",
    inactiveText: "#a78bfa",
  },
  {
    id: "event",
    label: "Events",
    Icon: Calendar,
    bg: "linear-gradient(135deg,#2563eb,#06b6d4)",
    shadow: "rgba(37,99,235,0.35)",
    inactiveBorder: "#1e3a5f",
    inactiveText: "#60a5fa",
  },
  {
    id: "concert",
    label: "Concerts",
    Icon: Music,
    bg: "linear-gradient(135deg,#f97316,#f43f5e)",
    shadow: "rgba(249,115,22,0.35)",
    inactiveBorder: "#7c2d12",
    inactiveText: "#fb923c",
  },
  {
    id: "travel",
    label: "Travel",
    Icon: Bus,
    bg: "linear-gradient(135deg,#059669,#0d9488)",
    shadow: "rgba(5,150,105,0.35)",
    inactiveBorder: "#064e3b",
    inactiveText: "#34d399",
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
  event: [
    { css: "bg-yellow-800/50 border-b-2 border-yellow-600", label: "VIP", price: "₹5,000" },
    { css: "bg-orange-800/50 border-b-2 border-orange-600", label: "Gold", price: "₹3,000" },
    { css: "bg-slate-700/50 border-b-2 border-slate-500", label: "Silver", price: "₹1,500" },
    { css: "bg-indigo-900/50 border-b-2 border-indigo-600", label: "General", price: "₹800" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked", price: "" },
  ],
  concert: [
    { css: "bg-rose-900/50 border-b-2 border-rose-600", label: "Pit", price: "₹8,000" },
    { css: "bg-emerald-900/50 border-b-2 border-emerald-600", label: "Floor", price: "₹4,000" },
    { css: "bg-indigo-900/50 border-b-2 border-indigo-600", label: "Block", price: "₹3,000" },
    { css: "bg-blue-900/50 border-b-2 border-blue-700", label: "Upper", price: "₹1,500" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked", price: "" },
  ],
  travel: [
    { css: "bg-sky-900/50 border-b-2 border-sky-600", label: "Window", price: "₹1,200" },
    { css: "bg-cyan-900/50 border-b-2 border-cyan-600", label: "Aisle", price: "₹1,100" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked", price: "" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected", price: "" },
  ],
};

export const SHOWS = {
  movie: [
    {
      id: "m1",
      title: "Interstellar: Remastered",
      venue: "PVR IMAX, Juhu",
      time: "07:00 PM",
      date: "Sat, 21 Jun",
      rating: "UA",
      duration: "2h 49m",
      genre: "Sci-Fi",
      language: "English",
      badge: "IMAX",
      priceFrom: 250,
    },
    {
      id: "m2",
      title: "KGF Chapter 3",
      venue: "INOX Megaplex, BKC",
      time: "08:30 PM",
      date: "Sat, 21 Jun",
      rating: "A",
      duration: "2h 35m",
      genre: "Action",
      language: "Hindi",
      badge: "4DX",
      priceFrom: 300,
    },
    {
      id: "m3",
      title: "Dune: Messiah",
      venue: "Cinepolis, Thane",
      time: "09:15 PM",
      date: "Sat, 21 Jun",
      rating: "UA",
      duration: "2h 22m",
      genre: "Sci-Fi",
      language: "English",
      badge: "DOLBY",
      priceFrom: 220,
    },
  ],
  event: [
    {
      id: "e1",
      title: "Sunburn Arena 2026",
      venue: "MMRDA Grounds, BKC",
      time: "06:00 PM",
      date: "Sun, 22 Jun",
      type: "Music Festival",
      priceFrom: 800,
      badge: "HOT",
    },
    {
      id: "e2",
      title: "Coldplay: Music of the Spheres",
      venue: "DY Patil Stadium",
      time: "07:30 PM",
      date: "Mon, 23 Jun",
      type: "Live Concert",
      priceFrom: 1500,
      badge: "TRENDING",
    },
    {
      id: "e3",
      title: "TEDxMumbai 2026",
      venue: "Jio World Centre",
      time: "10:00 AM",
      date: "Sat, 28 Jun",
      type: "Conference",
      priceFrom: 500,
      badge: null,
    },
  ],
  concert: [
    {
      id: "c1",
      title: "Arijit Singh Live",
      venue: "Wankhede Stadium",
      time: "08:00 PM",
      date: "Fri, 27 Jun",
      artist: "Arijit Singh",
      genre: "Bollywood",
      priceFrom: 1500,
      badge: "SELLING FAST",
    },
    {
      id: "c2",
      title: "AR Rahman Symphony Night",
      venue: "NESCO, Goregaon",
      time: "07:00 PM",
      date: "Sat, 28 Jun",
      artist: "AR Rahman",
      genre: "Film / Classical",
      priceFrom: 2000,
      badge: null,
    },
    {
      id: "c3",
      title: "The Weeknd: After Hours Tour",
      venue: "MMRDA Grounds, BKC",
      time: "09:00 PM",
      date: "Sun, 29 Jun",
      artist: "The Weeknd",
      genre: "R&B / Pop",
      priceFrom: 3000,
      badge: "LIMITED",
    },
  ],
  travel: [
    {
      id: "t1",
      title: "Mumbai → Goa",
      vehicle: "Volvo AC Sleeper",
      time: "10:00 PM",
      date: "Sat, 21 Jun",
      duration: "9h 30m",
      operator: "Orange Travels",
      priceFrom: 1100,
      badge: "AC",
    },
    {
      id: "t2",
      title: "Mumbai → Pune",
      vehicle: "AC Seater (2+2)",
      time: "06:00 AM",
      date: "Sun, 22 Jun",
      duration: "3h",
      operator: "IntraBus",
      priceFrom: 600,
      badge: null,
    },
    {
      id: "t3",
      title: "Mumbai → Delhi",
      vehicle: "Rajdhani Express (AC 2T)",
      time: "04:35 PM",
      date: "Sat, 21 Jun",
      duration: "16h 05m",
      operator: "Indian Railways",
      priceFrom: 1800,
      badge: "TRAIN",
    },
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
  const [selectedShowId, setSelectedShowId] = useState("m1");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const shows = SHOWS[activeCategory];
  const selectedShow =
    shows.find((s) => s.id === selectedShowId) || shows[0];

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setSelectedSeats([]);
    setSelectedShowId(SHOWS[cat][0].id);
  }, []);

  const handleShowSelect = useCallback((showId) => {
    setSelectedShowId(showId);
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

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = Math.round(subtotal * 0.1);
  const total = subtotal + convenienceFee;

  const handleProceed = () => {
    if (selectedSeats.length > 0) setShowConfirmModal(true);
  };

  const handleBookingComplete = () => {
    setShowConfirmModal(false);
    setSelectedSeats([]);
  };

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
            Select up to 8 seats · Movies · Events · Concerts · Travel
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

        {/* Show Cards */}
        <ShowCards
          shows={shows}
          selectedShowId={selectedShowId}
          onShowSelect={handleShowSelect}
          category={activeCategory}
        />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-\[1fr\_340px] gap-6 items-start">
          {/* ── Left: Seat Map ── */}
          <div className="vp-fade-up">
            <VenueHeader show={selectedShow} category={activeCategory} />

            {/* Seat Map Container */}
            <div className="mt-4 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-5 sm:p-7 overflow-x-auto vp-scroll">
              {activeCategory === "movie" && (
                <MovieSeatMap key={selectedShowId} {...mapProps} />
              )}
              {activeCategory === "event" && (
                <EventSeatMap key={selectedShowId} {...mapProps} />
              )}
              {activeCategory === "concert" && (
                <ConcertSeatMap key={selectedShowId} {...mapProps} />
              )}
              {activeCategory === "travel" && (
                <TravelSeatMap key={selectedShowId} {...mapProps} />
              )}
            </div>

            <SeatLegend category={activeCategory} />
          </div>

          {/* ── Right: Booking Summary ── */}
          <div className="lg:sticky lg:top-24 vp-slide-right">
            <BookingSummary
              show={selectedShow}
              category={activeCategory}
              selectedSeats={selectedSeats}
              subtotal={subtotal}
              convenienceFee={convenienceFee}
              total={total}
              onProceed={handleProceed}
              onClear={() => setSelectedSeats([])}
            />
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirmModal && (
        <ConfirmationModal
          show={selectedShow}
          category={activeCategory}
          selectedSeats={selectedSeats}
          total={total}
          onClose={handleBookingComplete}
        />
      )}
    </div>
  );
}