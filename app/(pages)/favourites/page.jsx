"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useFavourites } from "@/context/FavouritesContext";
import { useBookingStore } from "@/hooks/useBookingStore";
import EventCard from "@/components/EventCard";

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 flex items-center justify-center shadow-2xl shadow-orange-500/10">
          <Heart size={40} className="text-orange-400/50" />
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FavouritesPage() {
  const router = useRouter();
  const { favourites, isFavourite, toggleFavourite, clearFavourites } = useFavourites();

  const handleBook = (event) => {
    const store = useBookingStore.getState();
    const user = store.user;
    const query = new URLSearchParams({
      venue: event.venue || event.location || "",
      category: event.category || "",
    }).toString();
    const destination = `/seat-selection/${encodeURIComponent(event.title)}?${query}`;

    store.setSelectedEvent(event);

    if (!user) {
      store.setLoginRedirect(destination);
      router.push("/login");
      return;
    }
    router.push(destination);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      {/* ── Hero banner ── */}
      <div className="relative border-b border-neutral-800 bg-gradient-to-r from-orange-500/10 via-neutral-950 to-rose-500/10 pt-3 pb-3 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl">
          {/* Top Actions Row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/5 hover:-translate-x-0.5 cursor-pointer"
            >
              <ArrowLeft size={16} className="text-orange-500" />
              <span className="font-semibold text-sm">Back</span>
            </button>

            {favourites.length > 0 && (
              <button
                onClick={clearFavourites}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all duration-300 shadow-lg hover:shadow-rose-500/5 hover:translate-x-0.5 cursor-pointer"
              >
                <Trash2 size={16} className="text-rose-500" />
                <span className="font-semibold text-sm">Clear all</span>
              </button>
            )}
          </div>

          {/* Main Title Area */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400">
              <Heart size={13} className="fill-orange-400" /> My Collection
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              My{" "}
              <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
                Favourites
              </span>
            </h1>
            <p className="text-sm text-neutral-400">
              {favourites.length === 0
                ? "Your saved events will appear here."
                : `${favourites.length} saved item${favourites.length !== 1 ? "s" : ""} — ready to book anytime.`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        {favourites.length === 0 ? (
          <EmptyState onBack={() => router.push("/")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favourites.map((item) => (
              <EventCard
                key={item.id}
                event={item}
                isFavourite={isFavourite}
                toggleFavourite={toggleFavourite}
                onBookEvent={handleBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

