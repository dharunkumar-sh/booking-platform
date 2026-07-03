"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Ticket, Heart } from "lucide-react";
import { useFavourites } from "@/context/FavouritesContext";

import EventCard from "./EventCard";

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

function formatPrice(price) {
  if (price == null) return "";
  if (typeof price === "string" && price.startsWith("₹")) return price;
  const num = Number(price);
  if (isNaN(num)) return String(price);
  return `₹${(num / 100).toFixed(2)}`;
}

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

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="h-72 w-full animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="p-4 space-y-2">
        <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
    </div>
  );
}

function EmptyState({ searchQuery }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
      style={{ gap: "12px" }}
    >
      <span style={{ fontSize: "56px" }}>🎟️</span>
      <h3 className="text-white font-bold" style={{ fontSize: "20px" }}>
        No featured events found
      </h3>
      <p className="text-gray-400" style={{ fontSize: "14px", maxWidth: "320px" }}>
        {searchQuery
          ? `No results for "${searchQuery}". Try a different keyword or clear your search.`
          : "Check back soon — new events are added regularly!"}
      </p>
    </div>
  );
}

export default function FeaturedEvents({
  onBookEvent = () => {},
  searchQuery = "",
  selectedCategories = [],
  selectedState = null,
}) {
  const router = useRouter();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedState]);

  const categoriesJoined = (selectedCategories || []).join(",");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const activeCats = categoriesJoined ? categoriesJoined.split(",") : [];
      const params = new URLSearchParams({ type: "featured" });
      if (activeCats.length === 1) {
        params.set("category", activeCats[0]);
      }
      if (selectedState) {
        params.set("state", selectedState);
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("FeaturedEvents response is not JSON");
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
      console.error("[FeaturedEvents] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories, selectedState]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  useEffect(() => {
    const handleDbUpdate = () => {
      console.log("[FeaturedEvents] Auto-refreshing due to database change");
      fetchEvents();
    };
    window.addEventListener("db-update", handleDbUpdate);
    return () => {
      window.removeEventListener("db-update", handleDbUpdate);
    };
  }, [fetchEvents]);

  return (
    <div
      className="px-6 py-10 bg-neutral-950 text-white"
      style={{
        minHeight: events.length === 0 && !loading ? "50vh" : undefined,
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "8px",
          background: "linear-gradient(90deg, #f97316, #ff5862)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Featured Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : events.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          events
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((event, i) => (
              <EventCard
                key={event.id ?? i}
                event={event}
                onBookEvent={onBookEvent}
                isFavourite={isFavourite}
                toggleFavourite={toggleFavourite}
              />
            ))
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && events.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border border-neutral-800 transition-all ${
              currentPage === 1
                ? "text-neutral-600 bg-neutral-900/50 cursor-not-allowed"
                : "text-neutral-200 bg-neutral-900 hover:border-orange-500/50 hover:text-white cursor-pointer"
            }`}
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(events.length / itemsPerPage) }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    isActive
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-orange-500/30 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(events.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(events.length / itemsPerPage)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border border-neutral-800 transition-all ${
              currentPage === Math.ceil(events.length / itemsPerPage)
                ? "text-neutral-600 bg-neutral-900/50 cursor-not-allowed"
                : "text-neutral-200 bg-neutral-900 hover:border-orange-500/50 hover:text-white cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}