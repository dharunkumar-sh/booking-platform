"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Ticket, ArrowRight, Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DiscoverCategoryPage({
  title = "Discover Events",
  subtitle = "Explore the highest rated live shows and vibes.",
  category = "music",
  badgeText = "Live Discover",
  icon: Icon = Sparkles,
  heroGradient = "from-orange-500/20 via-neutral-900 to-rose-500/20",
}) {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && data.events && data.events.length > 0) {
          // If category filter matches or if category is generic ('events'), show matched or all
          const filtered = category === "all"
            ? data.events
            : data.events.filter((e) => (e.category || "").toLowerCase().includes(category.toLowerCase()) || category === "all");
          
          setEvents(filtered.length > 0 ? filtered : data.events);
        } else {
          // Fallback rich sample data if DB is empty
          setEvents([
            { id: 1, title: `${title} Premiere Live`, venue: "Grand Stadium Arena", price: 1499, date: "2026-07-15", category, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80" },
            { id: 2, title: `Vibe Night ${title}`, venue: "Central Amphitheatre", price: 999, date: "2026-07-20", category, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80" },
            { id: 3, title: `Starlight ${title} Showcase`, venue: "Metro Exhibition Hall", price: 2499, date: "2026-08-01", category, image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80" }
          ]);
        }
      } catch (err) {
        console.error("Failed loading discover events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [category, title]);

  const displayed = events.filter((e) => {
    const matchesSearch = (e.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.venue || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = (e.price || 1000) <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      {/* Dynamic Banner */}
      <div className={`relative border-b border-neutral-800 bg-gradient-to-r ${heroGradient} py-20 px-4 sm:px-6 lg:px-8`}>
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400">
            <Icon size={14} /> {badgeText}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-300">{subtitle}</p>

          {/* Search & Filter Controls */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()} or venues...`}
                className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/80 py-3.5 pl-12 pr-4 text-sm text-white shadow-xl placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-xs text-neutral-300">
              <SlidersHorizontal size={16} className="text-orange-400" />
              <span>Max Budget: <strong className="text-white">₹{maxPrice}</strong></span>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{displayed.length} Experiences Available</h2>
          <span className="text-xs text-neutral-400">Showing curated recommendations for your location</span>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-3xl bg-neutral-900/60 border border-neutral-800" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-12 text-center">
            <Sparkles size={32} className="mx-auto text-neutral-500" />
            <h3 className="mt-4 text-lg font-bold text-white">No experiences matching your filter</h3>
            <p className="mt-1 text-xs text-neutral-400">Try adjusting your budget slider or searching a broader term.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={async () => {
                  try {
                    localStorage.setItem("selectedEvent", JSON.stringify(item));
                  } catch (e) {
                    console.error(e);
                  }
                  router.push(`/event-details/${encodeURIComponent(item.title)}`);
                }}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 transition hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="relative h-48 w-full overflow-hidden bg-neutral-800">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-neutral-950/80 backdrop-blur px-3 py-1 text-xs font-bold text-orange-400 border border-neutral-700">
                    ₹{item.price || 999}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition line-clamp-1">{item.title}</h3>
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> {item.date || "Next Weekend"}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> {item.venue || "Major City Venue"}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        localStorage.setItem("selectedEvent", JSON.stringify(item));
                      } catch (err) {
                        console.error(err);
                      }
                      const query = new URLSearchParams({
                        venue: item.venue || item.location || "",
                        category: item.category || "",
                      }).toString();
                      router.push(`/seat-selection/${encodeURIComponent(item.title)}?${query}`);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 text-xs font-bold text-white transition group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-rose-500"
                  >
                    <Ticket size={14} /> Book Pass <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
