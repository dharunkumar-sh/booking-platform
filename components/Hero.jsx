"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
<<<<<<< HEAD
import { Search, MapPin, Sparkles, Loader2 } from "lucide-react";
=======
import { Search, MapPin, X } from "lucide-react";
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
import { useGeolocationContext } from "@/context/GeolocationContext";
import { useRouter } from "next/navigation";

// ── Static image banks ─────────────────────────────────────────────────────
const HIGH_RES_IMAGES = {
  default: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  ],
  relaxed: [
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  ],
  adventure: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1200&q=80",
  ],
  romantic: [
    "https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1588733103629-b77afe0425ce?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
  ],
  productive: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552581230-c0159146269a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  ],
  luxury: [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  ],
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80";

// ── Mood list ──────────────────────────────────────────────────────────────
const MOODS = [
  { name: "Relaxed 😌", key: "relaxed" },
  { name: "Adventurous 🏔️", key: "adventure" },
  { name: "Romantic ❤️", key: "romantic" },
  { name: "Productive 💻", key: "productive" },
  { name: "Luxury 👑", key: "luxury" },
];

// ── Mood destinations (static inspiration) ────────────────────────────────
const MOOD_PLACES = {
  relaxed: [
    { name: "Maldives", description: "Crystal clear waters & overwater villas", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=150&q=80" },
    { name: "Kyoto, Japan", description: "Peaceful bamboo forests & temples", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=150&q=80" },
    { name: "Santorini, Greece", description: "Breathtaking caldera views & sunsets", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=150&q=80" },
  ],
  adventure: [
    { name: "Queenstown, NZ", description: "Bungee jumping & skiing capital", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=150&q=80" },
    { name: "Swiss Alps", description: "Majestic peaks & thrilling trails", image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=150&q=80" },
    { name: "Patagonia, Chile", description: "Glaciers & dramatic mountain treks", image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=150&q=80" },
  ],
  romantic: [
    { name: "Paris, France", description: "The city of love and lights", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80" },
    { name: "Venice, Italy", description: "Gondola rides through historic canals", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=150&q=80" },
    { name: "Maui, Hawaii", description: "Sunset beaches & tropical breeze", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" },
  ],
  productive: [
    { name: "Silicon Valley", description: "Innovation, tech hubs & coding cafes", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80" },
    { name: "Singapore", description: "Futuristic workspace & green oasis", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=150&q=80" },
    { name: "Tokyo, Japan", description: "Ultra-fast internet & 24/7 cafes", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80" },
  ],
  luxury: [
    { name: "Dubai, UAE", description: "Opulent hotels & luxury shopping", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=150&q=80" },
    { name: "Monaco", description: "Yachts, casinos & glamorous life", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80" },
    { name: "Beverly Hills", description: "High-end fashion & elite villas", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80" },
  ],
};

// ── Upcoming events ticker ────────────────────────────────────────────────
const UPCOMING_EVENTS = [
  { id: 1, emoji: "🎵", name: "Sunburn Festival", date: new Date("2026-06-28T18:00:00"), color: "#f97316" },
  { id: 2, emoji: "🌙", name: "Neon Nights", date: new Date("2026-07-04T21:00:00"), color: "#a855f7" },
  { id: 3, emoji: "✈️", name: "Bali Travel Expo", date: new Date("2026-07-12T10:00:00"), color: "#06b6d4" },
];

const getTimeLeft = (targetDate) => {
  const diff = targetDate - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
};

const pad = (n) => String(n).padStart(2, "0");

// ── Category emoji map ────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  music: "🎵", comedy: "😂", drama: "🎭", dance: "💃",
  games: "🎮", sports: "🏆", food: "🍔", movie: "🎬", default: "✨",
};
const getCategoryEmoji = (cat) =>
  CATEGORY_EMOJI[(cat || "").toLowerCase()] || CATEGORY_EMOJI.default;

// ── Highlight matching text ────────────────────────────────────────────────
function HighlightText({ text = "", query = "" }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "rgba(249,115,22,0.35)",
          color: "#f97316",
          borderRadius: "3px",
          padding: "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const Hero = ({
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSearchChange,
  onMoodChange,
}) => {
  const router = useRouter();
  const { location } = useGeolocationContext();

  // Controlled/Uncontrolled search query integration
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const isControlledSearch = externalSearchQuery !== undefined && externalSetSearchQuery !== undefined;
  const searchQuery = isControlledSearch ? externalSearchQuery : internalSearchQuery;

  // Background slideshow
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(HIGH_RES_IMAGES.default);
  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});
  const intervalRef = useRef(null);

  // Mood
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedMoodKey, setSelectedMoodKey] = useState("");

  // Countdown timers
  const [timers, setTimers] = useState(() =>
    UPCOMING_EVENTS.map(() => ({ d: 0, h: 0, m: 0, s: 0 }))
  );

<<<<<<< HEAD
  // AI Search state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [aiSource, setAiSource] = useState("");
  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Geolocation context
  const { location } = useGeolocationContext();
=======
  // ── Search & autocomplete ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // keyboard nav
  const [searchLoading, setSearchLoading] = useState(false);
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1

  const searchWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // ── Geolocation ──────────────────────────────────────────────────────────
  const locationCity = location?.city || null;
  const heroSubtitle = locationCity
    ? `Explore concerts, shows, nightlife, and exclusive events near ${locationCity}.`
    : "Explore concerts, shows, nightlife, destinations, travel packages, and exclusive experiences happening around you.";

  // ── Preload background images ────────────────────────────────────────────
  useEffect(() => {
    setLoadedImages({});
    setErrorImages({});
    images.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedImages((prev) => ({ ...prev, [idx]: true }));
      img.onerror = () => setErrorImages((prev) => ({ ...prev, [idx]: true }));
    });
  }, [images]);

  // ── Slideshow interval ───────────────────────────────────────────────────
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [images]);

  // ── Countdown tick ───────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => {
      setTimers(UPCOMING_EVENTS.map((e) => getTimeLeft(e.date)));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

<<<<<<< HEAD
  // Fetch AI suggestions with debounce
  const fetchAiSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setAiSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsAiLoading(true);
    setShowSuggestions(true);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), location: locationCity }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data.suggestions || []);
        setAiSource(data.source || "local");
        setHighlightedIndex(-1);
      }
    } catch (err) {
      console.error("AI search error:", err);
    } finally {
      setIsAiLoading(false);
    }
  }, [locationCity]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Debounce: wait 400ms after user stops typing
    clearTimeout(debounceTimerRef.current);
    if (val.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        fetchAiSuggestions(val);
      }, 400);
    } else {
      setAiSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Strip the leading emoji + space from suggestion for the input
    const cleaned = suggestion.replace(/^[\p{Emoji}\s]+/u, "").trim();
    setSearchQuery(cleaned);
    setShowSuggestions(false);
    setAiSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || aiSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, aiSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(aiSuggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

=======
  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Fetch autocomplete suggestions ──────────────────────────────────────
  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/events/search?q=${encodeURIComponent(q)}&limit=6`
      );
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Hero autocomplete response is not JSON");
      }
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.results || []);
        setShowDropdown(true);
        setActiveIndex(-1);
      }
    } catch (err) {
      console.error("[Hero] autocomplete fetch error:", err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounced input change
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (isControlledSearch) {
      externalSetSearchQuery(val);
    } else {
      setInternalSearchQuery(val);
    }
    if (onSearchChange) {
      onSearchChange(val); // propagate to parent if applicable
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
      fetchAiSuggestions(val);
    }, 300);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const hasDbSuggestions = showDropdown && suggestions.length > 0;
    const hasAiSuggestions = showSuggestions && aiSuggestions.length > 0;

    if (e.key === "ArrowDown") {
      if (hasDbSuggestions) {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (hasAiSuggestions) {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, aiSuggestions.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      if (hasDbSuggestions) {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (hasAiSuggestions) {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
      }
    } else if (e.key === "Enter") {
      if (hasDbSuggestions && activeIndex >= 0) {
        e.preventDefault();
        handleSuggestionSelect(suggestions[activeIndex]);
      } else if (hasAiSuggestions && highlightedIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(aiSuggestions[highlightedIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setShowSuggestions(false);
      setActiveIndex(-1);
      setHighlightedIndex(-1);
    }
  };

  // Navigate to event detail from suggestion selection
  const handleSuggestionSelect = async (event) => {
    if (isControlledSearch) {
      externalSetSearchQuery(event.title);
    } else {
      setInternalSearchQuery(event.title);
    }
    if (onSearchChange) {
      onSearchChange(event.title);
    }
    setShowDropdown(false);
    setShowSuggestions(false);
    setActiveIndex(-1);
    try {
      localStorage.setItem("selectedEvent", JSON.stringify(event));
    } catch (err) {
      console.error("[Hero] localStorage write error:", err);
    }
    router.push(`/event-details/${encodeURIComponent(event.title)}`);
  };

  // Click handler for AI suggestions
  const handleSuggestionClick = (suggestion) => {
    const cleaned = suggestion.replace(/^[\p{Emoji}\s]+/u, "").trim();
    if (isControlledSearch) {
      externalSetSearchQuery(cleaned);
    } else {
      setInternalSearchQuery(cleaned);
    }
    if (onSearchChange) {
      onSearchChange(cleaned);
    }
    setShowDropdown(false);
    setShowSuggestions(false);
    setAiSuggestions([]);
    setHighlightedIndex(-1);

    // Fetch database suggestions for the clicked query phrase
    fetchSuggestions(cleaned);
  };

  // Submit plain text search — propagate to parent
  const handleSearchSubmit = () => {
    setShowDropdown(false);
    setShowSuggestions(false);
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    if (isControlledSearch) {
      externalSetSearchQuery("");
    } else {
      setInternalSearchQuery("");
    }
    setSuggestions([]);
    setAiSuggestions([]);
    setShowDropdown(false);
    setShowSuggestions(false);
    if (onSearchChange) {
      onSearchChange("");
    }
    inputRef.current?.focus();
  };

  // ── Mood selection ───────────────────────────────────────────────────────
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
  const handleMoodSelect = (mood) => {
    if (selectedMoodKey === mood.key) {
      setSelectedMood("");
      setSelectedMoodKey("");
      setCurrentIndex(0);
      setImages(HIGH_RES_IMAGES.default);
      if (onMoodChange) onMoodChange(null);
    } else {
      setSelectedMood(mood.name);
      setSelectedMoodKey(mood.key);
      setCurrentIndex(0);
      setImages(HIGH_RES_IMAGES[mood.key] || HIGH_RES_IMAGES.default);
      if (onMoodChange) onMoodChange(mood.key);
    }
  };

  const getImageSrc = (index) =>
    errorImages[index] ? FALLBACK_IMAGE : images[index];

  // Format price
  const formatPrice = (price) => {
    if (price == null) return "";
    if (typeof price === "string" && price.startsWith("₹")) return price;
    const num = Number(price);
    if (isNaN(num)) return String(price);
    return `₹${(num / 100).toFixed(0)}`;
  };

  return (
    <section
      className="relative w-full overflow-hidden transition-all duration-500 ease-in-out"
      style={{ height: selectedMoodKey ? "700px" : "620px" }}
    >
      {/* ── Background slideshow ── */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((_, index) => (
          <img
            key={`${images[index]}-${index}`}
            src={getImageSrc(index)}
            alt={`Slide ${index + 1}`}
            loading="eager"
            onError={() => setErrorImages((prev) => ({ ...prev, [index]: true }))}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              zIndex: index === currentIndex ? 1 : 0,
              visibility: loadedImages[index] || errorImages[index] ? "visible" : "hidden",
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 100%)",
            zIndex: 2,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8"
        style={{ zIndex: 3 }}
      >
        {/* Title */}
        <h1
          className="text-white font-bold mb-1"
          style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.5px" }}
        >
          Where Every Journey
        </h1>

        <h2
          className="font-extrabold mb-2"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            background: "linear-gradient(90deg, #f97316, #ff5862)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Tells Your Story
        </h2>

        <p className="text-gray-300 mb-3 max-w-2xl" style={{ fontSize: "13px" }}>
          {heroSubtitle}
        </p>

        {/* ── Upcoming event countdown pills ── */}
        <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
          {UPCOMING_EVENTS.map((event, i) => {
            const t = timers[i];
            return (
              <div
                key={event.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0,0,0,0.45)",
                  border: `1px solid ${event.color}55`,
                  borderRadius: "8px",
                  padding: "5px 10px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: event.color,
                    flexShrink: 0,
                    animation: "pulse-dot 1.2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.3px",
                  }}
                >
                  {event.emoji} {event.name}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>|</span>
                {[
                  { label: "d", val: t.d },
                  { label: "h", val: t.h },
                  { label: "m", val: t.m },
                  { label: "s", val: t.s },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: event.color,
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "monospace",
                      }}
                    >
                      {pad(val)}
                    </span>
                    <span
                      style={{
                        fontSize: "8px",
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── Search bar with autocomplete ── */}
        <div
          ref={searchWrapperRef}
          className="max-w-xl mb-5"
          style={{ position: "relative" }}
        >
          {/* Gradient border wrapper */}
          <div
            style={{
              borderRadius: "14px",
              padding: "2px",
              background: "linear-gradient(135deg, #f97316, #a855f7, #06b6d4)",
              boxShadow: isFocused
                ? "0 0 0 3px rgba(249,115,22,0.4), 0 8px 32px rgba(249,115,22,0.3)"
                : "0 8px 32px rgba(249,115,22,0.25), 0 2px 8px rgba(168,85,247,0.15)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(10, 8, 20, 0.88)",
                borderRadius: "12px",
                padding: "10px 14px",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Search icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: (searchLoading || isAiLoading)
                    ? "rgba(249,115,22,0.5)"
                    : "linear-gradient(135deg, #f97316, #ff5862)",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                {(searchLoading || isAiLoading) ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                ) : (
                  <Search size={15} color="#fff" />
                )}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  if (suggestions.length > 0) setShowDropdown(true);
                  if (searchQuery.trim().length >= 2 && aiSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
                placeholder={
                  locationCity
                    ? `Search events near ${locationCity}…`
                    : "Search events, artists, venues or ask AI…"
                }
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f1f5f9",
                  fontSize: "13px",
                  letterSpacing: "0.2px",
                }}
                aria-label="Search events"
                aria-autocomplete="list"
                aria-expanded={showDropdown || showSuggestions}
                autoComplete="off"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    color: "rgba(255,255,255,0.6)",
                  }}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}

              {/* Search submit button */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                style={{
                  flexShrink: 0,
                  padding: "7px 18px",
                  borderRadius: "9px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.4px",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, #f97316 0%, #a855f7 60%, #06b6d4 100%)",
                  boxShadow: "0 2px 12px rgba(249,115,22,0.4)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(249,115,22,0.4)";
                }}
              >
                Search ✦
              </button>
            </div>
          </div>

<<<<<<< HEAD
           
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder={
                locationCity
                  ? `Search events near ${locationCity}…`
                  : "Search events, artists, venues or ask AI…"
              }
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f1f5f9",
                fontSize: "13px",
                letterSpacing: "0.2px",
              }}
              onFocus={(e) => {
                e.target.parentElement.parentElement.style.boxShadow =
                  "0 0 0 3px rgba(249,115,22,0.4), 0 8px 32px rgba(249,115,22,0.3)";
                if (searchQuery.trim().length >= 2 && aiSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={(e) => {
                e.target.parentElement.parentElement.style.boxShadow =
                  "0 8px 32px rgba(249,115,22,0.25), 0 2px 8px rgba(168,85,247,0.15)";
              }}
            />

           
            <button
              type="button"
              style={{
                flexShrink: 0,
                padding: "7px 18px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.4px",
                color: "#fff",
                background:
                  "linear-gradient(135deg, #f97316 0%, #a855f7 60%, #06b6d4 100%)",
                boxShadow: "0 2px 12px rgba(249,115,22,0.4)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(249,115,22,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(249,115,22,0.4)";
              }}
            >
              Search ✦
            </button>
          </div>

          {/* AI Search Suggestions Dropdown */}
          {showSuggestions && (
=======
          {/* ── Autocomplete dropdown ── */}
          {showDropdown && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                zIndex: 50,
                borderRadius: "14px",
                overflow: "hidden",
                background: "rgba(10, 8, 24, 0.96)",
                border: "1px solid rgba(249,115,22,0.3)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.1)",
                animation: "dropdownFadeIn 0.18s ease-out",
              }}
            >
              {/* Direct Matches Section */}
              {showDropdown && suggestions.length > 0 && (
                <div>
                  <div
                    style={{
                      padding: "8px 14px 6px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.35)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    ✦ Direct Matches
                  </div>

                  {suggestions.map((event, idx) => (
                    <div
                      key={event.id ?? idx}
                      role="option"
                      aria-selected={idx === activeIndex}
                      onClick={() => handleSuggestionSelect(event)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        background:
                          idx === activeIndex
                            ? "rgba(249,115,22,0.12)"
                            : "transparent",
                        transition: "background 0.12s ease",
                      }}
                    >
                      {/* Event thumbnail */}
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            background: "rgba(249,115,22,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            flexShrink: 0,
                          }}
                        >
                          {getCategoryEmoji(event.category)}
                        </div>
                      )}

                      {/* Text content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#f1f5f9",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <HighlightText text={event.title} query={searchQuery} />
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.45)",
                            marginTop: "2px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>{getCategoryEmoji(event.category)} {event.category}</span>
                          {event.location && (
                            <>
                              <span style={{ opacity: 0.4 }}>·</span>
                              <MapPin size={9} style={{ flexShrink: 0 }} />
                              <span
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "160px",
                                }}
                              >
                                {event.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price badge */}
                      {event.price != null && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#f97316",
                            flexShrink: 0,
                            background: "rgba(249,115,22,0.12)",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            border: "1px solid rgba(249,115,22,0.25)",
                          }}
                        >
                          {formatPrice(event.price)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

          {/* No results state */}
          {showDropdown && !searchLoading && suggestions.length === 0 && searchQuery.trim() && (
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
<<<<<<< HEAD
                background: "rgba(10, 8, 25, 0.97)",
                border: "1px solid rgba(249,115,22,0.3)",
                borderRadius: "14px",
                backdropFilter: "blur(20px)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.15)",
                zIndex: 50,
                overflow: "hidden",
                animation: "dropdownFadeIn 0.18s ease-out forwards",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 14px 6px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {isAiLoading ? (
                  <>
                    <Loader2
                      size={12}
                      color="#a855f7"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px" }}>
                      AI is thinking…
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} color="#a855f7" />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px" }}>
                      {aiSource === "gemini" ? "AI Suggestions" : "Smart Suggestions"}
                    </span>
                  </>
                )}
              </div>

              {/* Suggestions List */}
              {isAiLoading ? (
                <div style={{ padding: "14px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "14px",
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.06)",
                        marginBottom: i < 5 ? "10px" : "0",
                        width: `${70 + i * 5}%`,
                        animation: "shimmer 1.5s ease-in-out infinite",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: "6px 0" }}>
                  {aiSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(suggestion);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onMouseLeave={() => setHighlightedIndex(-1)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 14px",
                        cursor: "pointer",
                        transition: "background 0.12s ease",
                        background: highlightedIndex === idx
                          ? "rgba(249,115,22,0.12)"
                          : "transparent",
                        borderLeft: highlightedIndex === idx
                          ? "2px solid #f97316"
                          : "2px solid transparent",
                      }}
                    >
                      <Search
                        size={12}
                        color={highlightedIndex === idx ? "#f97316" : "rgba(255,255,255,0.25)"}
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          color: highlightedIndex === idx ? "#f1f5f9" : "rgba(255,255,255,0.75)",
                          flex: 1,
                          letterSpacing: "0.2px",
                        }}
                      >
                        {suggestion}
                      </span>
                      {highlightedIndex === idx && (
                        <span style={{ fontSize: "10px", color: "rgba(249,115,22,0.7)", flexShrink: 0 }}>
                          ↵
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Footer branding */}
              <div
                style={{
                  padding: "6px 14px 8px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  justifyContent: "flex-end",
                }}
              >
                <Sparkles size={9} color="rgba(168,85,247,0.6)" />
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.4px" }}>
                  Powered by AI
                </span>
              </div>
=======
                zIndex: 50,
                borderRadius: "14px",
                background: "rgba(10, 8, 24, 0.96)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                padding: "20px",
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: "13px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              🔍 No events found for "{searchQuery}"
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
            </div>
          )}
        </div>

        {/* ── Mood filter pills ── */}
        <div className="mb-5">
          <h3 className="text-white font-semibold mb-3">✨ How do you want to feel?</h3>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.key}
                type="button"
                onClick={() => handleMoodSelect(mood)}
                className="px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
                style={
                  selectedMood === mood.name
                    ? {
                        background: "#f97316",
                        color: "#fff",
                        border: "1px solid #f97316",
                        boxShadow: "0 0 16px rgba(249,115,22,0.5)",
                        transform: "scale(1.05)",
                      }
                    : {
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.25)",
                      }
                }
              >
                {mood.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mood destination suggestions ── */}
        {selectedMoodKey && MOOD_PLACES[selectedMoodKey] && (
          <div
            className="mb-5"
            style={{ animation: "slideUp 0.4s ease-out forwards" }}
          >
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>📍</span> Suggested Destinations for {selectedMood}
            </h4>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {MOOD_PLACES[selectedMoodKey].map((place) => (
                <div
                  key={place.name}
                  onClick={() => {
                    setSearchQuery(place.name);
                    onSearchChange(place.name);
                    clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(
                      () => fetchSuggestions(place.name),
                      280
                    );
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    minWidth: "240px",
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white text-xs font-bold truncate" style={{ margin: 0 }}>
                      {place.name}
                    </h5>
                    <p className="text-gray-300 text-[10px] truncate" style={{ margin: 0 }}>
                      {place.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Slide indicator dots ── */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: index === currentIndex ? "20px" : "8px",
                height: "8px",
                background: index === currentIndex ? "#f97316" : "rgba(255,255,255,0.5)",
                border: "none",
                padding: 0,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownFadeIn {
<<<<<<< HEAD
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
=======
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
>>>>>>> 37eeb60fc61dceefc394ddf1d6f34c84b9b9d7f1
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Hero;
