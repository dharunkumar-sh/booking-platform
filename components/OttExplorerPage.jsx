"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Tv, Search, Play, Plus, Check, Star, Sparkles, Filter, Bookmark, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useStore } from "@/hooks/useStore";

const platforms = [
  { id: "all", label: "All Platforms" },
  { id: "netflix", label: "Netflix", color: "text-red-500" },
  { id: "prime", label: "Prime Video", color: "text-blue-400" },
  { id: "disney", label: "Disney+ Hotstar", color: "text-indigo-400" },
  { id: "apple", label: "Apple TV+", color: "text-neutral-300" },
  { id: "jiocinema", label: "JioCinema", color: "text-pink-500" },
  { id: "sonyliv", label: "Sony LIV", color: "text-blue-500" },
  { id: "zee5", label: "ZEE5", color: "text-amber-500" },
];

const apiKey = "fc8544873a24aece75531acb201efa3b";

const mapProviderToPlatformId = (providerName) => {
  if (!providerName) return "other";
  const name = providerName.toLowerCase();
  if (name.includes("netflix")) return "netflix";
  if (name.includes("prime video") || name.includes("amazon")) return "prime";
  if (name.includes("disney") || name.includes("hotstar")) return "disney";
  if (name.includes("apple")) return "apple";
  if (name.includes("jio")) return "jiocinema";
  if (name.includes("sony")) return "sonyliv";
  if (name.includes("zee")) return "zee5";
  return "other";
};

const mapProviderToLabel = (providerName) => {
  if (!providerName) return "";
  const name = providerName.toLowerCase();
  if (name.includes("netflix")) return "Netflix";
  if (name.includes("prime video") || name.includes("amazon")) return "Amazon Prime Video";
  if (name.includes("disney") || name.includes("hotstar")) return "Disney+ Hotstar";
  if (name.includes("apple")) return "Apple TV+";
  if (name.includes("jio")) return "JioCinema";
  if (name.includes("sony")) return "Sony LIV";
  if (name.includes("zee")) return "ZEE5";
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
  isWatchlistPage = false,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams ? (searchParams.get("q") || "") : "";

  const [activePlatform, setActivePlatform] = useState(initialFilter);
  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  const storeUser = useStore(useBookingStore, (state) => state.user);
  const user = storeUser || null;

  const [dbWatchlist, setDbWatchlist] = useState([]);
  const [dbWatchlistLoading, setDbWatchlistLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState("all");
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = ["all", "High Adrenaline", "Cozy Weekend", "Mind Bending", "Feel Good Comedy"];

  // Load watchlist items from backend DB
  useEffect(() => {
    async function loadDbWatchlist() {
      const activeUser = useBookingStore.getState().user;
      if (!activeUser?.email) {
        console.log("[OttExplorerPage] No active user email found, skipping watchlist load.");
        return;
      }
      console.log("[OttExplorerPage] Loading watchlist for user:", activeUser.email);
      setDbWatchlistLoading(true);
      try {
        const res = await fetch(`/api/watchlist?email=${encodeURIComponent(activeUser.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            console.log("[OttExplorerPage] Loaded watchlist items:", data.watchlist);
            setDbWatchlist(data.watchlist || []);
          } else {
            console.error("[OttExplorerPage] Failed to load watchlist:", data.error);
          }
        } else {
          console.error("[OttExplorerPage] Watchlist GET response status:", res.status);
        }
      } catch (err) {
        console.error("[OttExplorerPage] Error loading watchlist:", err);
      } finally {
        setDbWatchlistLoading(false);
      }
    }

    const activeUser = useBookingStore.getState().user;
    if (activeUser?.email) {
      loadDbWatchlist();
    } else {
      setDbWatchlist([]);
    }
  }, [user, isWatchlistPage]);

  // Sync bookmark toggle with DB endpoint
  const toggleWatchlist = async (item) => {
    const activeUser = useBookingStore.getState().user;
    console.log("[OttExplorerPage] toggleWatchlist called for:", item.title, "User:", activeUser);

    if (!activeUser) {
      console.log("[OttExplorerPage] User not logged in, redirecting to login.");
      const setLoginRedirect = useBookingStore.getState().setLoginRedirect;
      if (setLoginRedirect) {
        setLoginRedirect(window.location.pathname);
      }
      router.push("/login");
      return;
    }

    const isExisting = dbWatchlist.some((w) => String(w.id) === String(item.id));
    console.log("[OttExplorerPage] Item exists in watchlist state:", isExisting);

    try {
      if (isExisting) {
        console.log("[OttExplorerPage] Deleting item from watchlist:", item.id);
        const res = await fetch(`/api/watchlist?email=${encodeURIComponent(activeUser.email)}&tmdbId=${encodeURIComponent(item.id)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          console.log("[OttExplorerPage] Deletion successful");
          setDbWatchlist((prev) => prev.filter((w) => String(w.id) !== String(item.id)));
        } else {
          console.error("[OttExplorerPage] Deletion failed with status:", res.status);
        }
      } else {
        console.log("[OttExplorerPage] Adding item to watchlist:", item.id);
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: activeUser.email,
            tmdbId: String(item.id),
            title: item.title,
            category: item.tag || item.category || "Movie",
            image: item.image,
            rating: item.rating,
            releaseDate: item.releaseDate || "",
            platforms: item.platforms || [],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            console.log("[OttExplorerPage] Addition successful:", data.item);
            setDbWatchlist((prev) => [...prev, {
              id: String(item.id),
              title: item.title,
              category: item.tag || item.category || "Movie",
              image: item.image,
              rating: item.rating,
              releaseDate: item.releaseDate || "",
              platforms: item.platforms || [],
            }]);
          } else {
            console.error("[OttExplorerPage] Addition failed on backend:", data.error);
          }
        } else {
          console.error("[OttExplorerPage] Addition failed with response status:", res.status);
        }
      }
    } catch (err) {
      console.error("[OttExplorerPage] Error toggling watchlist:", err);
    }
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
            let parsedPlatforms = [];

            const getProviderLink = (providerName) => {
              const name = providerName.toLowerCase();
              if (name.includes("netflix")) return "https://www.netflix.com";
              if (name.includes("prime video") || name.includes("amazon")) return "https://www.primevideo.com";
              if (name.includes("disney") || name.includes("hotstar")) return "https://www.hotstar.com";
              if (name.includes("sony")) return "https://www.sonyliv.com";
              if (name.includes("zee")) return "https://www.zee5.com";
              if (name.includes("apple")) return "https://tv.apple.com";
              if (name.includes("jio")) return "https://www.jiocinema.com";
              return "";
            };

            const getProviderLabel = (providerName) => {
              const name = providerName.toLowerCase();
              if (name.includes("netflix")) return "Netflix";
              if (name.includes("prime video") || name.includes("amazon")) return "Amazon Prime Video";
              if (name.includes("disney") || name.includes("hotstar")) return "Disney+ Hotstar";
              if (name.includes("apple")) return "Apple TV+";
              if (name.includes("jio")) return "JioCinema";
              if (name.includes("sony")) return "Sony LIV";
              if (name.includes("zee")) return "ZEE5";
              return providerName;
            };

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
                      const label = mapProviderToLabel(p.provider_name);
                      providerLabels.push(label);

                      const cleanName = getProviderLabel(p.provider_name);
                      const cleanLink = getProviderLink(p.provider_name) || region.link || "https://google.com";
                      const logoUrl = p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null;
                      
                      parsedPlatforms.push({
                        name: cleanName,
                        logo: logoUrl,
                        link: cleanLink
                      });
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
              platforms: parsedPlatforms,
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
              releaseDate: item.release_date || item.first_air_date || "",
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

    if (!isWatchlistPage) {
      loadData();
    }
    return () => {
      active = false;
    };
  }, [search, selectedMood, isWatchlistPage]);

  // Sync loaded DB Watchlist into view state
  useEffect(() => {
    if (isWatchlistPage) {
      const mappedWatchlist = dbWatchlist.map((w) => {
        const parsedPlatforms = (w.platforms || []).map(p => {
          if (typeof p === "string") {
            const pId = mapProviderToPlatformId(p);
            return {
              name: mapProviderToLabel(p),
              logo: null,
              link: pId === "netflix" ? "https://www.netflix.com" :
                    pId === "prime" ? "https://www.primevideo.com" :
                    pId === "disney" ? "https://www.hotstar.com" :
                    pId === "apple" ? "https://tv.apple.com" :
                    pId === "jiocinema" ? "https://www.jiocinema.com" :
                    pId === "sonyliv" ? "https://www.sonyliv.com" :
                    pId === "zee5" ? "https://www.zee5.com" : "https://google.com"
            };
          }
          return p;
        });

        const platformText = parsedPlatforms.length > 0
          ? parsedPlatforms.map(p => p.name).join(", ")
          : "Currently not available on any OTT platform";

        const platformsList = parsedPlatforms.map(p => mapProviderToPlatformId(p.name));
        const streamUrl = parsedPlatforms.length > 0 ? parsedPlatforms[0].link : "https://www.netflix.com";

        return {
          id: w.id,
          title: w.title,
          platform: platformText,
          platformsList: platformsList,
          platforms: parsedPlatforms,
          rating: w.rating || "N/A",
          genre: w.category || "Movie",
          match: "Saved",
          image: w.image,
          tag: w.category || "Movie",
          streamUrl: streamUrl,
          genreIds: [],
          releaseDate: w.releaseDate || "",
        };
      });
      setTitles(mappedWatchlist);
    }
  }, [isWatchlistPage, dbWatchlist]);

  const filtered = titles.filter((item) => {
    const pMatch = activePlatform === "all" || item.platformsList.includes(activePlatform);
    let mMatch = true;
    if (selectedMood !== "all") {
      const allowedGenres = MOOD_GENRES[selectedMood] || [];
      mMatch = item.genreIds.some((gId) => allowedGenres.includes(gId));
    }
    return pMatch && mMatch;
  });

  const isSavingLoading = loading || dbWatchlistLoading;

  if (isWatchlistPage && !user) {
    return (
      <div className="min-h-screen bg-neutral-950 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
          <Bookmark className="w-8 h-8 text-neutral-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Your watchlist is synced securely</h1>
        <p className="text-sm text-neutral-400 mt-2 max-w-sm">Please log in to your account to view your curated list, delete items, or sync bookmarks.</p>
        <button
          onClick={() => {
            const setLoginRedirect = useBookingStore.getState().setLoginRedirect;
            if (setLoginRedirect) {
              setLoginRedirect(window.location.pathname);
            }
            router.push("/login");
          }}
          className="mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer hover:shadow-orange-500/20 active:scale-95 transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

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
                className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
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
                  className={`rounded-lg px-3 py-1 text-xs transition cursor-pointer ${
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

        {isSavingLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <span className="text-sm text-neutral-400 mt-4">Syncing watchlist data...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-3xl mb-3">🍿</span>
            <span className="text-sm font-semibold text-neutral-300">No titles found</span>
            <span className="text-xs text-neutral-500 mt-1">Try matching another keyword or platform filter.</span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const isBookmarked = dbWatchlist.some((w) => String(w.id) === String(item.id));
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
                      {item.tag || item.category || "Movie"}
                    </div>
                    <button
                      onClick={() => toggleWatchlist(item)}
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950/80 text-white transition hover:bg-orange-500 cursor-pointer"
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

                    {/* OTT Platform logos and Watch Now buttons */}
                    <div className="border-t border-neutral-800/80 pt-3.5 space-y-2">
                      {item.platforms && item.platforms.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {item.platforms.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800/50 rounded-xl p-2 transition hover:border-neutral-700/80">
                              <div className="flex items-center gap-2">
                                {p.logo ? (
                                  <img src={p.logo} alt={p.name} className="w-6 h-6 rounded-md object-contain shrink-0 bg-neutral-950 p-0.5 border border-neutral-800" />
                                ) : (
                                  <div className="w-6 h-6 rounded-md bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                                    <Tv size={12} className="text-neutral-500" />
                                  </div>
                                )}
                                <span className="text-xs font-semibold text-neutral-200">{p.name}</span>
                              </div>
                              <a
                                href={p.link || "https://google.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none"
                              >
                                <Play size={10} fill="currentColor" /> Watch Now
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2.5 text-center bg-neutral-900/30 border border-neutral-850 rounded-xl">
                          <span className="text-xs font-medium text-neutral-500">Currently not available on any OTT platform.</span>
                        </div>
                      )}
                    </div>
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
