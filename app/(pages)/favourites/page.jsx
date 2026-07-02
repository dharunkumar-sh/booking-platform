"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart, Ticket, Trash2, ArrowLeft, Star, MapPin, Calendar, Tag } from "lucide-react";
import { useFavourites } from "@/context/FavouritesContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
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

const CATEGORY_COLOR = {
  music:   "from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400",
  comedy:  "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400",
  drama:   "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400",
  sports:  "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400",
  movie:   "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
  food:    "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
  default: "from-neutral-700/30 to-neutral-800/30 border-neutral-600/30 text-neutral-400",
};

function getCategoryStyle(cat) {
  return CATEGORY_COLOR[(cat || "").toLowerCase()] || CATEGORY_COLOR.default;
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 flex items-center justify-center shadow-2xl shadow-rose-500/10">
          <Heart size={40} className="text-rose-400/50" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg">
          😔
        </div>
      </div>
      <h2 className="text-2xl font-extrabold text-white mb-2">No favourites added yet</h2>
      <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
        Browse events and hit the ❤ on any card to save them here for quick booking later.
      </p>
      <button
        onClick={onBack}
        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
      >
        <ArrowLeft size={16} /> Explore Events
      </button>
    </div>
  );
}

// ── Favourite card ────────────────────────────────────────────────────────────
function FavouriteCard({ item, onRemove, onBook }) {
  const catStyle = getCategoryStyle(item.category);
  const price = formatPrice(item.price);
  const date = formatDate(item.date);

  return (
    <div className="group relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-neutral-800">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800"
          }
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Remove heart button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-600 active:scale-95 transition-all cursor-pointer"
          title="Remove from favourites"
        >
          <Heart size={16} className="text-white fill-white" />
        </button>

        {/* Category pill */}
        {item.category && (
          <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-gradient-to-r text-[11px] font-bold backdrop-blur-sm ${catStyle}`}>
            <Tag size={10} />
            {item.category}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
          {item.title}
        </h3>

        <div className="space-y-1.5 text-xs text-neutral-400">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-orange-500 shrink-0" />
              {date}
              {item.time && <span className="text-neutral-600">• {item.time}</span>}
            </div>
          )}
          {(item.location || item.venue) && (
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-orange-500 shrink-0" />
              <span className="line-clamp-1">{item.location || item.venue}</span>
            </div>
          )}
          {item.rating && (
            <div className="flex items-center gap-1.5">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-semibold">{item.rating}</span>
              <span className="text-neutral-600">/ 5</span>
            </div>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {price ? (
              <span className="text-lg font-extrabold text-orange-400">{price}</span>
            ) : (
              <span className="text-sm text-neutral-500 italic">Price TBA</span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Available
          </span>
        </div>

        {/* Book Now */}
        <button
          onClick={() => onBook(item)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <Ticket size={15} /> Book Now
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FavouritesPage() {
  const router = useRouter();
  const { favourites, removeFavourite, clearFavourites } = useFavourites();

  const handleBook = (item) => {
    try {
      sessionStorage.setItem("selectedEvent", JSON.stringify(item));
    } catch {}
    router.push(`/event-details/${encodeURIComponent(item.title)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      {/* ── Hero banner ── */}
      <div className="relative border-b border-neutral-800 bg-gradient-to-r from-rose-500/10 via-neutral-950 to-pink-500/10 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-orange-400 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-400 mb-4">
                <Heart size={13} className="fill-rose-400" /> My Collection
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                My{" "}
                <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
                  Favourites
                </span>
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                {favourites.length === 0
                  ? "Your saved events will appear here."
                  : `${favourites.length} saved item${favourites.length !== 1 ? "s" : ""} — ready to book anytime.`}
              </p>
            </div>

            {favourites.length > 0 && (
              <button
                onClick={clearFavourites}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-neutral-800 hover:border-rose-500/30 transition-all cursor-pointer"
              >
                <Trash2 size={13} /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        {favourites.length === 0 ? (
          <EmptyState onBack={() => router.push("/")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((item) => (
              <FavouriteCard
                key={item.id}
                item={item}
                onRemove={removeFavourite}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
