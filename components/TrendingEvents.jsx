"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Ticket, Heart } from "lucide-react";
import { useFavourites } from "@/context/FavouritesContext";

<<<<<<< HEAD
export default function TrendingEvents({ searchQuery = "", onBookEvent = () => {} }) {
=======
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
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
  const sliderRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isFavourite, toggleFavourite } = useFavourites();

  const scrollLeft = () => sliderRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 350, behavior: "smooth" });

  // ── Fetch events from /api/events ─────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: "trending" });
      if (selectedCategories.length === 1) {
        params.set("category", selectedCategories[0]);
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let rows = data.events || [];

        if (selectedCategories.length > 1) {
          rows = rows.filter((e) =>
            selectedCategories.includes((e.category || "").toLowerCase())
          );
        }

        if (searchQuery.trim()) {
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

  const filteredEvents = events.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.organizer && e.organizer.toLowerCase().includes(q))
    );
  });

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

      {/* ── Arrow buttons ── */}
      {!loading && events.length > 0 && (
        <>
          <button
            onClick={scrollLeft}
            style={{
              position: "absolute",
              left: "10px",
              top: "55%",
              transform: "translateY(-50%)",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              background: "#1E293B",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={scrollRight}
            style={{
              position: "absolute",
              right: "10px",
              top: "55%",
              transform: "translateY(-50%)",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              background: "#1E293B",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}

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
<<<<<<< HEAD
        {filteredEvents.map((event, index) => (
          <div
            key={event.id}
            onClick={async () => {
              try {
                await fetch("/api/redis", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ key: "selectedEvent", value: event }),
                });
              } catch (e) {
                console.error(e);
              }
              router.push(`/event-details/${encodeURIComponent(event.title)}`);
            }}
            style={{
              minWidth: "330px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              position: "relative",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-10px) scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0) scale(1)";
            }}
          >
            {index < 2 && (
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  background: "linear-gradient(90deg, #f97316, #ff5862)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                🔥 Trending
              </div>
            )}

            {/* Heart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(event.id);
=======
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : events.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          events.map((event, index) => (
            <div
              key={event.id ?? index}
              onClick={async () => {
                try {
                  localStorage.setItem("selectedEvent", JSON.stringify(event));
                } catch (e) {
                  console.error(e);
                }
                router.push(`/event-details/${encodeURIComponent(event.title)}`);
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
              }}
              style={{
                minWidth: "330px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                position: "relative",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              {/* Trending badge for first 2 */}
              {index < 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: "linear-gradient(90deg, #f97316, #ff5862)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 2,
                  }}
                >
                  🔥 Trending
                </div>
              )}

              {/* Heart button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(event);
                }}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  background: isFavourite(event.id) ? "rgba(244,63,94,0.95)" : "rgba(255,255,255,0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  transition: "background 0.2s",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                }}
                title={isFavourite(event.id) ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart
                  size={17}
                  style={{
                    color: isFavourite(event.id) ? "white" : "#f43f5e",
                    fill: isFavourite(event.id) ? "white" : "none",
                    transition: "all 0.2s",
                  }}
                />
              </button>

              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
                }
                alt={event.title}
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />

              <div style={{ padding: "20px", color: "white" }}>
                {/* Category pill */}
                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: "rgba(249,115,22,0.2)",
                      border: "1px solid rgba(249,115,22,0.4)",
                      color: "#f97316",
                      fontWeight: 600,
                    }}
                  >
                    {getCategoryEmoji(event.category)} {event.category}
                  </span>
                </div>

                <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
                  {event.title}
                </h2>

                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
                  📅 {formatDate(event.date)}
                </p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
                  📍 {event.location}
                </p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
                  ⭐ {event.rating}/5
                </p>
                <p style={{ fontSize: "14px", color: "#f97316", fontWeight: 700, marginTop: "6px" }}>
                  {formatPrice(event.price)}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookEvent(event);
                  }}
                  style={{
                    width: "100%",
                    marginTop: "15px",
                    padding: "12px",
                    border: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(90deg, #f97316, #ff5862)",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Ticket size={16} /> Book Now
                </button>
              </div>
            </div>
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