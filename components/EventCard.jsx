"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  Share2,
  Ticket,
  Filter,
  Search,
  Compass,
  ChevronRight,
  Info,
  Settings,
  Globe,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  X,
  Key,
  Maximize2,
  Heart
} from "lucide-react";

const CATEGORIES = ["All", "Music", "Tech", "Food", "Comedy", "Sports", "Arts"];

const getCategoryForEvent = (event) => {
  if (event.category) return event.category;
  const title = event.title.toLowerCase();
  if (title.includes("music") || title.includes("concert") || title.includes("tour") || title.includes("festival") || title.includes("live") || title.includes("dj")) return "Music";
  if (title.includes("tech") || title.includes("conference") || title.includes("disrupt") || title.includes("developer") || title.includes("summit")) return "Tech";
  if (title.includes("culinary") || title.includes("wine") || title.includes("food") || title.includes("taste") || title.includes("beer")) return "Food";
  if (title.includes("comedy") || title.includes("laughter") || title.includes("standup") || title.includes("funny") || title.includes("show")) return "Comedy";
  if (title.includes("championship") || title.includes("finals") || title.includes("game") || title.includes("match") || title.includes("sports") || title.includes("cup")) return "Sports";
  if (title.includes("gala") || title.includes("museum") || title.includes("art") || title.includes("exhibition") || title.includes("gallery")) return "Arts";
  return "Music";
};

const EventSingleCard = ({ event, onSelect, isFavorite, onToggleFavorite }) => {
  const category = getCategoryForEvent(event);
  
  const dateBadge = useMemo(() => {
    if (!event.date || !event.date.start_date) return { month: "EVENT", day: "✨" };
    const parts = event.date.start_date.trim().split(/\s+/);
    if (parts.length >= 2) {
      return { month: parts[0].toUpperCase(), day: parts[1] };
    }
    return { month: "DATE", day: event.date.start_date };
  }, [event.date]);

  const categoryColor = useMemo(() => {
    switch (category) {
      case "Music": return "from-pink-500/20 to-rose-500/20 text-rose-400 border-rose-500/30";
      case "Tech": return "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30";
      case "Food": return "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30";
      case "Comedy": return "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30";
      case "Sports": return "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30";
      case "Arts": return "from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/30";
      default: return "from-neutral-500/20 to-neutral-500/20 text-neutral-300 border-neutral-500/30";
    }
  }, [category]);

  const fallbackImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="group relative bg-neutral-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)] flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />

      <div className="relative aspect-[16/10] overflow-hidden w-full bg-neutral-950">
        <img
          src={event.thumbnail || fallbackImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent opacity-90" />

        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md bg-gradient-to-r ${categoryColor} shadow-lg tracking-wider uppercase`}>
          {category}
        </span>

        <div className="absolute top-4 right-4 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 w-14 shadow-lg text-center">
          <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase leading-none mb-1">
            {dateBadge.month}
          </span>
          <span className="text-xl font-extrabold text-white tracking-tight leading-none">
            {dateBadge.day}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(event);
          }}
          className={`absolute bottom-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 active:scale-95 ${
            isFavorite
              ? "bg-rose-500/95 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : "bg-black/40 border-white/10 text-white/85 hover:bg-black/60 hover:text-white"
          }`}
          title={isFavorite ? "Remove from Saved" : "Save Event"}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors duration-300">
            {event.title}
          </h3>

          <div className="flex items-center gap-2.5 text-xs text-neutral-400 mb-3.5">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800/80 text-orange-400 shrink-0">
              <Clock size={12} />
            </div>
            <span className="line-clamp-1">{event.date?.when || "Time to be announced"}</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-neutral-400 mb-5">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800/80 text-orange-400 shrink-0 mt-0.5">
              <MapPin size={12} />
            </div>
            <div>
              <p className="font-semibold text-neutral-300 line-clamp-1">
                {event.venue?.name || (Array.isArray(event.address) ? event.address[0] : event.address) || "TBD Venue"}
              </p>
              {Array.isArray(event.address) && event.address[1] && (
                <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{event.address[1]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-800/60 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Tickets from</span>
            <span className="text-base font-extrabold text-orange-400 mt-0.5">
              {event.price || "Check Site"}
            </span>
          </div>

          <button
            onClick={() => onSelect(event)}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-[0_4px_12px_rgba(249,115,22,0.2)] hover:shadow-[0_6px_16px_rgba(249,115,22,0.35)] active:scale-95"
          >
            Explore Event
            <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

const EventDetailsModal = ({ event, onClose, isFavorite, onToggleFavorite }) => {
  const [toastMessage, setToastMessage] = useState("");
  const category = getCategoryForEvent(event);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!event) return null;

  const calendarUrl = useMemo(() => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || `Event venue: ${event.venue?.name || ""}. Booking Link: ${event.link}`);
    const location = encodeURIComponent(
      Array.isArray(event.address) ? event.address.join(", ") : event.address || event.venue?.name || ""
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }, [event]);

  const mapsSearchUrl = event.venue?.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.venue?.name || ""
  )}+${encodeURIComponent(Array.isArray(event.address) ? event.address.join(", ") : event.address || "")}`;

  const handleShare = () => {
    const shareText = `Check out this event: "${event.title}" at ${event.venue?.name || "TBD"} on ${event.date?.when}! Tickets: ${event.link}`;
    navigator.clipboard.writeText(shareText).then(
      () => setToastMessage("Event details copied to clipboard!"),
      () => setToastMessage("Failed to copy link.")
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg transition-opacity duration-300 overflow-y-auto">
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-neutral-900 border border-emerald-500/30 rounded-xl shadow-2xl text-emerald-400 text-sm animate-bounce">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      <div className="relative w-full max-w-3xl bg-neutral-950/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] max-h-[90vh] flex flex-col">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={event.thumbnail || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <X size={18} />
          </button>

          <button
            onClick={() => onToggleFavorite(event)}
            className={`absolute top-5 left-5 p-2 rounded-full border transition-all duration-200 ${
              isFavorite
                ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20"
                : "bg-black/60 border-white/10 text-white/80 hover:text-white"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 bg-orange-500/25 border border-orange-500/40 text-orange-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              {category}
            </span>
            {event.price && (
              <span className="px-3 py-1 bg-neutral-900/80 border border-neutral-700/50 text-white text-xs font-bold rounded-full">
                Tickets from {event.price}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            {event.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex gap-3.5 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                <CalendarIcon size={18} />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Date & Time</p>
                <p className="text-sm text-neutral-200 font-semibold mt-1">
                  {event.date?.when || "TBD"}
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 md:col-span-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Location</p>
                <p className="text-sm text-neutral-200 font-semibold mt-1 truncate">
                  {event.venue?.name || "TBD Venue"}
                </p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  {Array.isArray(event.address) ? event.address.join(", ") : event.address || "Address details to follow"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">About the Event</h4>
            <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
              {event.description || "No description provided by the host. Please explore the official ticket sources below for full details regarding key schedules, artists line-up, policies, and gate rules."}
            </p>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Ticket size={16} className="text-orange-400" />
              Compare Ticket Sources
            </h4>
            
            {event.ticket_info && event.ticket_info.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {event.ticket_info.map((ticket, index) => (
                  <a
                    key={index}
                    href={ticket.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-orange-500/40 hover:bg-neutral-900/80 transition-all duration-300 group/ticket"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
                        {ticket.source.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover/ticket:text-orange-400 transition-colors">
                          {ticket.source}
                        </p>
                        <p className="text-xs text-neutral-500">Official Partner</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 text-right">
                      {ticket.price && (
                        <span className="text-sm font-extrabold text-neutral-200">{ticket.price}</span>
                      )}
                      <ExternalLink size={14} className="text-neutral-500 group-hover/ticket:text-white transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4.5 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-orange-500/40 transition-all duration-300 group/single"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover/single:text-orange-400 transition-colors">
                      Official Source
                    </p>
                    <p className="text-xs text-neutral-500">Explore listings and prices</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                  Book Direct
                  <ExternalLink size={14} />
                </div>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-t border-neutral-800 bg-neutral-950 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-bold transition-all duration-200 active:scale-95"
            >
              <Share2 size={14} />
              Share
            </button>

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-bold transition-all duration-200 active:scale-95"
            >
              <CalendarIcon size={14} />
              Add to Calendar
            </a>
          </div>

          <div className="flex gap-2">
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-bold transition-all duration-200 active:scale-95"
            >
              <MapPin size={14} className="text-orange-400" />
              Directions
            </a>

            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-extrabold shadow-lg shadow-orange-500/10 transition-all duration-200 active:scale-95"
            >
              Get Tickets
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EventCard({ event, onSelect, searchEvents }) {
  if (event) {
    return (
      <EventSingleCard
        event={event}
        onSelect={onSelect}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    );
  }

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("New York");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem("event_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }

    const envKey = process.env.NEXT_PUBLIC_SERPAPI_KEY || "";
    const savedKey = localStorage.getItem("serpapi_key") || envKey;
    if (savedKey) {
      setApiKey(savedKey);
    }

    handleSearch(locationQuery, savedKey);
  }, []);

  const toggleFavorite = (evt) => {
    let updated;
    const isAlreadyFav = favorites.some((f) => f.title === evt.title);
    if (isAlreadyFav) {
      updated = favorites.filter((f) => f.title !== evt.title);
    } else {
      updated = [...favorites, evt];
    }
    setFavorites(updated);
    localStorage.setItem("event_favorites", JSON.stringify(updated));
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("serpapi_key", key);
    setShowSettings(false);
    handleSearch(locationQuery, key);
  };

  const handleSearch = async (loc = locationQuery, key = apiKey) => {
    setLoading(true);
    setError("");

    try {
      if (searchEvents) {
        const result = await searchEvents(searchQuery, loc);
        if (result.success) {
          setEvents(result.events);
        } else {
          throw new Error(result.error);
        }
      } else {
        if (!key) {
          setEvents([]);
          setLoading(false);
          return;
        }

        const searchStr = searchQuery.trim() ? searchQuery : "events";
        const q = `${searchStr} in ${loc}`;
        const url = `https://serpapi.com/search.json?engine=google_events&q=${encodeURIComponent(q)}&api_key=${key}`;

        try {
          const response = await axios.get(url, { timeout: 8000 });
          if (response.data && response.data.events_results) {
            setEvents(response.data.events_results);
          } else {
            throw new Error("No events found in API response.");
          }
        } catch (directErr) {
          console.warn("Direct client call failed due to CORS or network. Trying CORS proxy...", directErr.message);
          
          const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
          const response = await axios.get(proxyUrl, { timeout: 10000 });
          if (response.data && response.data.events_results) {
            setEvents(response.data.events_results);
          } else {
            throw new Error("No events returned via CORS proxy.");
          }
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch events from live API: " + err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    let data = showOnlyFavorites ? favorites : events;

    if (selectedCategory !== "All") {
      data = data.filter((evt) => getCategoryForEvent(evt) === selectedCategory);
    }

    return data;
  }, [events, selectedCategory, favorites, showOnlyFavorites]);

  return (
    <div className="w-full bg-neutral-950 text-white min-h-[500px]">
      
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-3">
              <Sparkles size={12} className="animate-spin-slow" />
              Live Entertainment Explorer
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
              Trending Google Events
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Browse concerts, gatherings, and festivals nearby, scraped via SerpApi Google Search engine.
            </p>
          </div>

          <div className="flex gap-2.5 items-center">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 ${
                showOnlyFavorites
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white"
              }`}
            >
              <Heart size={14} fill={showOnlyFavorites ? "currentColor" : "none"} />
              Saved ({favorites.length})
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition-all duration-300 active:scale-95"
            >
              <Settings size={14} className={apiKey ? "text-orange-400 animate-spin-slow" : ""} />
              {apiKey ? "API Connected" : "Connect SerpApi"}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6.5 shadow-2xl relative">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Key size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">SerpApi Configuration</h3>
              </div>
              
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Provide your SerpApi Secret Key to enable live event searches from Google Events. The key will be stored securely only in your browser's local storage.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = e.target.api_key_input.value.trim();
                  saveApiKey(val);
                }}
              >
                <div className="mb-5">
                  <label htmlFor="api_key_input" className="block text-xs font-bold text-neutral-400 mb-2 uppercase">
                    SerpApi Secret Key
                  </label>
                  <input
                    id="api_key_input"
                    name="api_key_input"
                    type="password"
                    defaultValue={apiKey}
                    placeholder="Enter api_key..."
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  {apiKey && (
                    <button
                      type="button"
                      onClick={() => saveApiKey("")}
                      className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-red-500/20 text-neutral-400 hover:text-red-400 text-xs font-bold transition-all duration-200"
                    >
                      Disconnect
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-neutral-900/40 p-4.5 rounded-2xl border border-neutral-900 shadow-xl">
          <div className="relative flex items-center md:col-span-2">
            <Search size={18} className="absolute left-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event names, concerts, comedy, exhibitions..."
              className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800/80 rounded-xl text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-orange-500/30 transition-all duration-300"
            />
          </div>

          <div className="relative flex items-center">
            <MapPin size={18} className="absolute left-4 text-neutral-500" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location (e.g. Austin, TX)"
              className="w-full pl-11 pr-24 py-3 bg-neutral-950 border border-neutral-800/80 rounded-xl text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-orange-500/30 transition-all duration-300"
            />
            
            <button
              onClick={() => handleSearch(locationQuery)}
              disabled={loading}
              className="absolute right-2.5 px-4.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-extrabold transition-all duration-200 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto py-2.5 mt-5 max-w-full no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
                selectedCategory === cat
                  ? "bg-white text-black font-extrabold shadow-lg scale-[1.03]"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-8 bg-neutral-900 border border-amber-500/20 text-amber-400 rounded-2xl text-xs leading-relaxed animate-pulse">
          <AlertCircle size={16} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!apiKey && !showOnlyFavorites ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/30 border border-neutral-800/40 rounded-3xl max-w-2xl mx-auto shadow-2xl">
          <div className="p-4 rounded-full bg-orange-500/10 text-orange-400 mb-6 animate-pulse">
            <Key size={36} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">SerpApi Connection Required</h3>
          <p className="text-neutral-400 text-sm max-w-md mb-8 leading-relaxed">
            To search and display live event details directly from Google Events, enter your SerpApi Secret Key. Your key is stored locally in your browser.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.dashboard_api_key.value.trim();
              if (val) saveApiKey(val);
            }}
            className="w-full max-w-md flex flex-col sm:flex-row gap-3"
          >
            <input
              type="password"
              name="dashboard_api_key"
              placeholder="Enter serpapi_key..."
              className="flex-1 px-4.5 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-orange-500/50"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold rounded-xl transition-all duration-200"
            >
              Connect Key
            </button>
          </form>
          <a
            href="https://serpapi.com/google-events-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 mt-6"
          >
            Get a free key at serpapi.com
            <ExternalLink size={12} />
          </a>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-neutral-900/40 border border-neutral-900 rounded-2xl aspect-[9/10] animate-pulse flex flex-col p-6 gap-4">
              <div className="w-full aspect-[16/10] bg-neutral-800 rounded-xl" />
              <div className="h-6 bg-neutral-800 rounded-md w-3/4" />
              <div className="h-4 bg-neutral-800 rounded-md w-1/2 mt-2" />
              <div className="h-4 bg-neutral-800 rounded-md w-2/3" />
              <div className="h-10 bg-neutral-800 rounded-xl w-full mt-auto" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-neutral-900/25 border border-neutral-900 rounded-3xl">
          <Compass size={44} className="text-neutral-600 mb-4 animate-bounce" />
          <h4 className="text-lg font-bold text-neutral-300">No Events Found</h4>
          <p className="text-neutral-500 text-sm max-w-sm mt-1.5 leading-relaxed">
            We couldn't find any events matching "{selectedCategory}" in {locationQuery}. Try selecting another category or check your search keyword query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filteredEvents.map((evt, idx) => (
            <EventSingleCard
              key={`${evt.title}-${idx}`}
              event={evt}
              onSelect={setSelectedEvent}
              isFavorite={favorites.some((f) => f.title === evt.title)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isFavorite={favorites.some((f) => f.title === selectedEvent.title)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
