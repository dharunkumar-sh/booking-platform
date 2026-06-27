"use client";

import { useState } from "react";
import MovieSeatMap from "@/app/seat-booking/components/MovieSeatMap";
import ArenaSeatMap from "@/app/seat-booking/components/ArenaSeatMap";
import OpenSpaceSeatMap from "@/app/seat-booking/components/OpenSpaceSeatMap";
import "@/app/seat-booking/seat-booking.css";

const LEGENDS = {
  theatre: [
    { css: "bg-neutral-800 border-b-2 border-neutral-600", label: "Standard", price: "₹250" },
    { css: "bg-purple-900/60 border-b-2 border-purple-600", label: "Premium", price: "₹450" },
    { css: "bg-amber-900/50 border-b-2 border-amber-600", label: "Recliner", price: "₹850" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected" },
  ],
  open_space: [
    { css: "bg-neutral-800 border-b-2 border-neutral-600", label: "General Admission", price: "₹500" },
    { css: "bg-purple-900/60 border-b-2 border-purple-600", label: "Premium Pod", price: "₹1500" },
    { css: "bg-yellow-900/60 border-b-2 border-yellow-600", label: "VIP Pod", price: "₹2000" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected" },
  ],
  arena: [
    { css: "bg-green-900/60 border-b-2 border-green-600", label: "Floor Pit", price: "₹1500" },
    { css: "bg-rose-900/60 border-b-2 border-rose-600", label: "Lower Bowl", price: "₹900-1000" },
    { css: "bg-indigo-900/60 border-b-2 border-indigo-600", label: "Upper Bowl", price: "₹500" },
    { css: "bg-neutral-900/80 border-b-2 border-neutral-800 opacity-40", label: "Booked" },
    { css: "bg-orange-500 border-b-2 border-orange-700", label: "Selected" },
  ],
};

export default function SeatSelection({
  event = {
    title: "Special Event Concert",
    venue: "Main Arena",
    priceVal: 499,
  },
  onConfirmSelection = () => {},
  onCancel = () => {},
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const getVenueType = (venueName) => {
    const name = (venueName || "").toLowerCase();
    if (
      name.includes("theatre") ||
      name.includes("cinema") ||
      name.includes("pvr") ||
      name.includes("palazzo") ||
      name.includes("multiplex")
    ) {
      return "theatre";
    }
    if (
      name.includes("stadium") ||
      name.includes("arena") ||
      name.includes("indoor") ||
      name.includes("hall") ||
      name.includes("expo")
    ) {
      return "arena";
    }
    if (
      name.includes("grounds") ||
      name.includes("beach") ||
      name.includes("club") ||
      name.includes("lawn") ||
      name.includes("island") ||
      name.includes("park") ||
      name.includes("kodambakkam")
    ) {
      return "open_space";
    }
    return "theatre"; // Default fallback
  };

  const venueType = getVenueType(event.venue);
  const containerMaxWidth = venueType === "arena" ? "1200px" : "850px";
  const headerMaxWidth = venueType === "arena" ? "1200px" : "800px";
  const outerPadding = venueType === "arena" ? "20px 20px 110px 20px" : "40px 20px 140px 20px";
  const headerMarginBottom = venueType === "arena" ? "16px" : "40px";
  const containerPadding = venueType === "arena" ? "20px 30px" : "30px";
  const legendsMarginTop = venueType === "arena" ? "16px" : "40px";

  const handleSeatToggle = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= 6) {
        alert("You can select a maximum of 6 seats at a time.");
        return prev;
      }
      return [...prev, seat];
    });
  };

  const currentLegends = LEGENDS[venueType] || LEGENDS.theatre;

  return (
    <div
      className="no-scrollbar"
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: outerPadding,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: headerMaxWidth,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: headerMarginBottom,
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <span
            style={{
              background: "linear-gradient(90deg, #f97316, #ff5862)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Seat Booking
          </span>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              marginTop: "8px",
              marginBottom: "4px",
              background: "linear-gradient(to right, #ffffff, #a1a1aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {event.title}
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "15px" }}>
            📍 {event.venue} <span className="ml-2 text-xs opacity-60 text-orange-400 capitalize">({venueType} view)</span>
          </p>
        </div>

        <button
          onClick={onCancel}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "12px",
            color: "#e4e4e7",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
        >
          Go Back
        </button>
      </div>

      {/* Seat Map Container */}
      <div
        className="no-scrollbar"
        style={{
          width: "100%",
          maxWidth: containerMaxWidth,
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "24px",
          padding: containerPadding,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        <div className="no-scrollbar" style={{ width: "100%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
          {venueType === "theatre" && (
            <MovieSeatMap selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
          )}
          {venueType === "arena" && (
            <ArenaSeatMap selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
          )}
          {venueType === "open_space" && (
            <OpenSpaceSeatMap selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
          )}
        </div>

        {/* Legends */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: legendsMarginTop,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {currentLegends.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className={`w-4 h-4 rounded inline-block flex-shrink-0 ${item.css}`}
                style={{ borderRadius: "4px" }}
              />
              <span style={{ fontSize: "13px", color: "#a1a1aa" }}>
                {item.label} {item.price ? `(${item.price})` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Summary Card */}
      {selectedSeats.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "600px",
            background: "rgba(10, 10, 10, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            borderRadius: "24px",
            padding: "20px 30px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 100,
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontSize: "11px",
                color: "#f97316",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Selected Seats ({selectedSeats.length})
            </span>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#e4e4e7" }}>
              {selectedSeats.map((s) => s.label || s.id).join(", ")}
            </span>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
              Total: ₹{selectedSeats.reduce((acc, curr) => acc + (curr.price || 0), 0)}
            </span>
          </div>
          <button
            onClick={() => {
              onConfirmSelection(selectedSeats);
            }}
            className="vp-proceed-btn"
            style={{
              padding: "14px 28px",
              borderRadius: "14px",
              border: "none",
              color: "white",
              fontWeight: 800,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(249, 115, 22, 0.4)",
            }}
          >
            Confirm Seats
          </button>
        </div>
      )}
    </div>
  );
}