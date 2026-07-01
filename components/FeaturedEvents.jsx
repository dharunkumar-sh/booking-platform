"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Ticket, Heart } from "lucide-react";
import { useFavourites } from "@/context/FavouritesContext";

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
}) {
  const router = useRouter();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoriesJoined = (selectedCategories || []).join(",");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const activeCats = categoriesJoined ? categoriesJoined.split(",") : [];
      const params = new URLSearchParams({ type: "featured" });
      if (activeCats.length === 1) {
        params.set("category", activeCats[0]);
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
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
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
          events.map((event, i) => (
            <div
              key={event.id ?? i}
              onClick={async () => {
                try {
                  localStorage.setItem("selectedEvent", JSON.stringify(event));
                } catch (e) {
                  console.error(e);
                }
                router.push(
                  `/event-details/${encodeURIComponent(event.title)}`,
                );
              }}
              className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-orange-500/20 bg-neutral-900/30 border border-white/5 transition duration-300"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-5 flex flex-col justify-between grow">
                <div>
                  <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 group-hover:text-orange-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-1 flex items-center gap-1">
                    📍 {event.location}
                  </p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    📅 {formatDate(event.date)} • ⏰ {event.time}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2.5">
                    Starts at{" "}
                    <span className="text-base font-extrabold text-orange-500 block sm:inline mt-0.5 sm:mt-0">
                      {formatPrice(event.price)}
                    </span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookEvent(event);
                  }}
                  className="mt-4 w-full bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all duration-300 shadow-md hover:shadow-orange-500/20 cursor-pointer relative z-10 text-sm"
                >
                  <Ticket size={16} /> Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}