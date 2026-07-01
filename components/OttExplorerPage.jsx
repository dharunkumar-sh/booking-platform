"use client";

import React, { useState } from "react";
import { Tv, Search, Play, Plus, Check, Star, Sparkles, Filter, Bookmark } from "lucide-react";

const platforms = [
  { id: "all", label: "All Platforms" },
  { id: "netflix", label: "Netflix", color: "text-red-500" },
  { id: "prime", label: "Prime Video", color: "text-blue-400" },
  { id: "disney", label: "Disney+ Hotstar", color: "text-indigo-400" },
  { id: "apple", label: "Apple TV+", color: "text-neutral-300" },
  { id: "jiocinema", label: "JioCinema", color: "text-pink-500" },
];

const sampleTitles = [
  { id: 101, title: "Cyberpunk: Vibe City", platform: "netflix", rating: "4.9", genre: "Sci-Fi Thriller", match: "98% Match", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80", tag: "Trending #1" },
  { id: 102, title: "The Sovereign Crown", platform: "prime", rating: "4.8", genre: "Historical Drama", match: "95% Match", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80", tag: "New Release" },
  { id: 103, title: "Cosmic Odyssey", platform: "disney", rating: "4.7", genre: "Space Adventure", match: "94% Match", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", tag: "Critics Choice" },
  { id: 104, title: "Midnight Standup Special", platform: "netflix", rating: "4.6", genre: "Standup Comedy", match: "91% Match", image: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=800&auto=format&fit=crop&q=80", tag: "Binge Worthy" },
  { id: 105, title: "Architects of the Future", platform: "apple", rating: "4.9", genre: "Docuseries", match: "97% Match", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80", tag: "Must Watch" },
  { id: 106, title: "Rhythm of the Underground", platform: "jiocinema", rating: "4.5", genre: "Musical Drama", match: "89% Match", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80", tag: "Blockbuster" },
];

export default function OttExplorerPage({
  pageTitle = "Browse OTT Platforms",
  pageSubtitle = "Discover where to stream the latest movies, web series, and AI-curated watchlists across all services.",
  initialFilter = "all",
  showMoodFilters = false,
}) {
  const [activePlatform, setActivePlatform] = useState(initialFilter);
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMood, setSelectedMood] = useState("all");

  const moods = ["all", "High Adrenaline", "Cozy Weekend", "Mind Bending", "Feel Good Comedy"];

  const toggleWatchlist = (id) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = sampleTitles.filter((item) => {
    const pMatch = activePlatform === "all" || item.platform === activePlatform;
    const sMatch = item.title.toLowerCase().includes(search.toLowerCase()) || item.genre.toLowerCase().includes(search.toLowerCase());
    return pMatch && sMatch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      {/* Hero Header */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400">
            <Tv size={14} /> Unified Streaming Guide
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{pageTitle}</h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-400">{pageSubtitle}</p>

          {/* Search Input */}
          <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across Netflix, Prime Video, Disney+, Apple TV..."
              className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/90 py-3.5 pl-12 pr-4 text-sm text-white shadow-xl placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Platform Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activePlatform === p.id
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg"
                    : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Optional Mood Pills */}
          {showMoodFilters && (
            <div className="mt-4 flex items-center gap-2 pt-2 border-t border-neutral-800/60">
              <span className="text-xs font-bold text-orange-400">Select Vibe Mood:</span>
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`rounded-lg px-3 py-1 text-xs transition ${
                    selectedMood === m
                      ? "bg-white text-neutral-950 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Titles */}
      <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Featured Streaming Releases</h2>
          <span className="text-xs text-neutral-400">{filtered.length} titles available to watch</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isBookmarked = watchlist.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 transition hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-2xl"
              >
                <div className="relative h-56 w-full overflow-hidden bg-neutral-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-neutral-950/80 backdrop-blur px-3 py-1 text-xs font-bold text-orange-400 border border-neutral-700">
                    {item.tag}
                  </div>
                  <button
                    onClick={() => toggleWatchlist(item.id)}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950/80 text-white transition hover:bg-orange-500"
                    title="Toggle Watchlist"
                  >
                    {isBookmarked ? <Check size={16} className="text-emerald-400" /> : <Plus size={16} />}
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase font-bold tracking-wider text-orange-400">{item.platform}</span>
                    <span className="flex items-center gap-1 font-bold text-amber-400"><Star size={13} fill="currentColor" /> {item.rating}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{item.genre}</span>
                    <span className="font-semibold text-emerald-400">{item.match}</span>
                  </div>

                  <a
                    href="https://www.netflix.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 text-xs font-bold text-white transition hover:bg-gradient-to-r hover:from-orange-500 hover:to-rose-500"
                  >
                    <Play size={14} fill="currentColor" /> Stream Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
