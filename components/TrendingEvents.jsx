"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Ticket, Heart } from "lucide-react";
import { useFavourites } from "@/context/FavouritesContext";
import EventCard from "./EventCard";

// ── Category emoji helpers ────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  music: "🎵",
  comedy: "😂",
  drama: "🎭",
  dance: "💃",
  games: "🎮",
  sports: "🏆",
  food: "🍔",
  movie: "🎬",
  default: "✨",
};

function getCategoryEmoji(cat) {
  return CATEGORY_EMOJI[(cat || "").toLowerCase()] || CATEGORY_EMOJI.default;
}

// ── Format price from integer paise (e.g. 149900 → ₹1499.00) ────────────────
function formatPrice(price) {
  if (price == null) return "";
  if (typeof price === "string" && price.startsWith("₹")) return price;
  const num = Number(price);
  if (isNaN(num)) return String(price);
  return `₹${(num / 100).toFixed(2)}`;
}

// ── Format date ───────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ── Skeleton card for the slider ──────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        minWidth: "330px",
        borderRadius: "24px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{ height: "220px", background: "rgba(255,255,255,0.09)" }}
        className="animate-pulse"
      />
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="animate-pulse" style={{ height: "14px", width: "70%", borderRadius: "6px", background: "rgba(255,255,255,0.1)" }} />
        <div className="animate-pulse" style={{ height: "10px", width: "50%", borderRadius: "6px", background: "rgba(255,255,255,0.07)" }} />
        <div className="animate-pulse" style={{ height: "10px", width: "60%", borderRadius: "6px", background: "rgba(255,255,255,0.07)" }} />
        <div className="animate-pulse" style={{ height: "40px", borderRadius: "10px", background: "rgba(249,115,22,0.25)", marginTop: "6px" }} />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ searchQuery }) {
  return (
    <div
      style={{
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
        gap: "12px",
        color: "white",
      }}
    >
      <span style={{ fontSize: "52px" }}>🔍</span>
      <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>No trending events found</h3>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", maxWidth: "300px" }}>
        {searchQuery
          ? `No results for "${searchQuery}". Try a different search.`
          : "Stay tuned — trending events will appear here soon!"}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TrendingEvents({
  onBookEvent = () => {},
  searchQuery = "",
  selectedCategories = [],
}) {
  const sliderRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isFavourite, toggleFavourite } = useFavourites();

  const scrollLeft = () => sliderRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 350, behavior: "smooth" });

  const categoriesJoined = (selectedCategories || []).join(",");

  // ── Fetch events from /api/events ─────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const activeCats = categoriesJoined ? categoriesJoined.split(",") : [];
      const params = new URLSearchParams({ type: "trending" });
      if (activeCats.length === 1) {
        params.set("category", activeCats[0]);
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("TrendingEvents response is not JSON");
      }
      const data = await res.json();
      if (data.success) {
        let rows = data.events || [];

        if (activeCats.length > 1) {
          rows = rows.filter((e) =>
            activeCats.includes((e.category || "").toLowerCase())
          );
        }

        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          rows = rows.filter(
            (e) =>
              (e.title || "").toLowerCase().includes(q) ||
              (e.category || "").toLowerCase().includes(q) ||
              (e.location || "").toLowerCase().includes(q) ||
              (e.organizer || "").toLowerCase().includes(q)
          );
        }

        setEvents(rows);
      }
    } catch (err) {
      console.error("[TrendingEvents] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  return (
    <section
      className="bg-neutral-950"
      style={{ padding: "60px 40px", position: "relative" }}
    >
      {/* ── Title ── */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
          background: "linear-gradient(90deg, #f97316, #ff5862)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Trending Events
      </h1>

      {/* ── Slider ── */}
      <div
        ref={sliderRef}
        style={{
          display: "flex",
          gap: "25px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : events.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          events.map((event, index) => (
            <EventCard
              key={event.id ?? index}
              event={event}
              onBookEvent={onBookEvent}
              isFavourite={isFavourite}
              toggleFavourite={toggleFavourite}
              showTrendingBadge={index < 2}
              style={{ minWidth: "330px" }}
            />
          ))
        )}
      </div>

      {/* ── Legacy detail modal (preserved) ── */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              style={{ width: "100%", height: "350px", objectFit: "cover" }}
            />
            <div style={{ padding: "25px" }}>
              <h1>{selectedEvent.title}</h1>
              <p><strong>📅 Event Date:</strong> {formatDate(selectedEvent.date)}</p>
              <p><strong>📍 Venue:</strong> {selectedEvent.location}</p>
              <p><strong>⭐ Rating:</strong> {selectedEvent.rating}/5</p>
              <p><strong>🎟 Ticket Price:</strong> {formatPrice(selectedEvent.price)}</p>
              <p><strong>🕒 Time:</strong> {selectedEvent.time}</p>
              <p><strong>🎤 About Event:</strong><br />{selectedEvent.description}</p>
              <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
                <button
                  onClick={() => {
                    onBookEvent(selectedEvent);
                    setSelectedEvent(null);
                  }}
                  style={{
                    flex: 1, padding: "14px", border: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(90deg, #f97316, #ff5862)",
                    color: "white", fontWeight: "bold", cursor: "pointer",
                  }}
                >
                  Select Seats
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    flex: 1, padding: "14px", border: "none",
                    borderRadius: "10px", background: "#E5E7EB", cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}