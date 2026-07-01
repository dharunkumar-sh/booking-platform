"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Tv, Search, Play, Plus, Check, Star, Sparkles, Filter, Bookmark, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const platforms = [
  { id: "all", label: "All Platforms" },
  { id: "netflix", label: "Netflix", color: "text-red-500" },
  { id: "prime", label: "Prime Video", color: "text-blue-400" },
  { id: "disney", label: "Disney+ Hotstar", color: "text-indigo-400" },
  { id: "apple", label: "Apple TV+", color: "text-neutral-300" },
  { id: "jiocinema", label: "JioCinema", color: "text-pink-500" },
];

const apiKey = "fc8544873a24aece75531acb201efa3b";

const mapProviderToPlatformId = (providerName) => {
  const name = providerName.toLowerCase();
  if (name.includes("netflix")) return "netflix";
  if (name.includes("prime video") || name.includes("amazon")) return "prime";
  if (name.includes("disney") || name.includes("hotstar")) return "disney";
  if (name.includes("apple")) return "apple";
  if (name.includes("jio")) return "jiocinema";
  return "other";
};

const mapProviderToLabel = (providerName) => {
  const name = providerName.toLowerCase();
  if (name.includes("netflix")) return "Netflix";
  if (name.includes("prime video") || name.includes("amazon")) return "Prime Video";
  if (name.includes("disney") || name.includes("hotstar")) return "Disney+ Hotstar";
  if (name.includes("apple")) return "Apple TV+";
  if (name.includes("jio")) return "JioCinema";
  return providerName;
};

const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

const MOOD_GENRES = {
  "High Adrenaline": [28, 12, 53, 10759],
  "Cozy Weekend": [35, 10749, 10751, 10762],
  "Mind Bending": [9648, 878, 14, 10765],
  "Feel Good Comedy": [35, 16],
};

function OttExplorerPageInner({
  pageTitle = "Browse OTT Platforms",
  pageSubtitle = "Discover where to stream the latest movies, web series, and AI-curated watchlists across all services.",
  initialFilter = "all",
  showMoodFilters = false,
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? (searchParams.get("q") || "") : "";

  const [activePlatform, setActivePlatform] = useState(initialFilter);
  const [search, setSearch] = useState(initialQuery);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMood, setSelectedMood] = useState("all");
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = ["all", "High Adrenaline", "Cozy Weekend", "Mind Bending", "Feel Good Comedy"];

  const toggleWatchlist = (id) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      try {
        let url;
        if (search.trim()) {
          url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(search.trim())}&language=en-US&page=1`;
        } else if (selectedMood !== "all") {
          const genreIds = MOOD_GENRES[selectedMood] || [];
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds.join(",")}&sort_by=popularity.desc&language=en-US`;
        } else {
          url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch TMDB data");
        const data = await res.json();

        if (!active) return;

        const rawItems = (data.results || [])
          .map((item) => ({
            ...item,
            media_type: item.media_type || "movie"
          }))
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .slice(0, 12);

        const itemsWithProviders = await Promise.all(
          rawItems.map(async (item) => {
            let platformsList = [];
            let providerLabels = [];
            let streamUrl = "";

            try {
              const provRes = await fetch(
                `https://api.themoviedb.org/3/${item.media_type}/${item.id}/watch/providers?api_key=${apiKey}`
              );
              if (provRes.ok) {
                const provData = await provRes.json();
                const region = provData.results?.IN || provData.results?.US;
                if (region) {
                  streamUrl = region.link || "";
                  const allProviders = [
                    ...(region.flatrate || []),
                    ...(region.rent || []),
                    ...(region.buy || [])
                  ];

                  const seen = new Set();
                  for (const p of allProviders) {
                    if (p.provider_name && !seen.has(p.provider_name)) {
                      seen.add(p.provider_name);
                      const pId = mapProviderToPlatformId(p.provider_name);
                      if (pId !== "other") {
                        platformsList.push(pId);
                      }
                      providerLabels.push(mapProviderToLabel(p.provider_name));
                    }
                  }
                }
              }
            } catch (err) {
              console.error("Error loading watch providers:", err);
            }

            const genreList = (item.genre_ids || [])
              .map((id) => GENRES[id])
              .filter(Boolean)
              .slice(0, 2);
            const genreText = genreList.length > 0 ? genreList.join(" / ") : (item.media_type === "movie" ? "Movie" : "TV Show");

            const platformText = providerLabels.length > 0 ? providerLabels.slice(0, 2).join(", ") : "OTT Stream";

            return {
              id: item.id,
              title: item.title || item.name,
              platform: platformText,
              platformsList: platformsList,
              rating: item.vote_average ? item.vote_average.toFixed(1) : "7.5",
              genre: genreText,
              match: `${Math.round(80 + (item.vote_average || 7) * 2)}% Match`,
              image: item.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                : item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
              tag: item.media_type === "movie" ? "Movie" : "TV Show",
              streamUrl: streamUrl || "https://www.netflix.com",
              genreIds: item.genre_ids || [],
            };
          })
        );

        if (active) {
          setTitles(itemsWithProviders);
        }
      } catch (err) {
        console.error("Error loading TMDB search:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [search, selectedMood]);

  const filtered = titles.filter((item) => {
    const pMatch = activePlatform === "all" || item.platformsList.includes(activePlatform);
    let mMatch = true;
    if (selectedMood !== "all") {
      const allowedGenres = MOOD_GENRES[selectedMood] || [];
      mMatch = item.genreIds.some((gId) => allowedGenres.includes(gId));
    }
    return pMatch && mMatch;
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <span className="text-sm text-neutral-400 mt-4">Searching OTT platforms...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-3xl mb-3">🍿</span>
            <span className="text-sm font-semibold text-neutral-300">No titles found on OTT platforms</span>
            <span className="text-xs text-neutral-500 mt-1">Try matching another keyword, platform, or vibe mood.</span>
          </div>
        ) : (
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
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80";
                      }}
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
                      href={item.streamUrl || "https://www.netflix.com"}
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
        )}
      </div>
    </div>
  );
}

export default function OttExplorerPage(props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OttExplorerPageInner {...props} />
    </Suspense>
  );
}
