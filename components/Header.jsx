"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Bell,
  BellOff,
  Heart,
  MapPin,
  ChevronDown,
  Check,
  CheckCheck,
  X,
  Tv,
  LogOut,
  Trash2,
  Ticket,
  CreditCard,
  Car,
  Clock,
  Tag,
} from "lucide-react";
import { useGeolocationContext } from "@/context/GeolocationContext";
import { useFavourites } from "@/context/FavouritesContext";

const OTT_PLATFORMS = [
  "Netflix",
  "Prime Video",
  "Disney+Hotstar",
  "SonyLIV",
  "Zee5",
  "Others",
];

const Header = () => {
  const router = useRouter();
  const { triggerRequest, location, status, selectedState, setSelectedState } = useGeolocationContext();
  const { count: favCount } = useFavourites();
  // Input and selectors
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOtt, setSelectedOtt] = useState("All");
  const [crossOttSearch, setCrossOttSearch] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsType, setSuggestionsType] = useState("db");
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Interactive states
  const [isOttOpen, setIsOttOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const placeholders = [
    "Search Movies...",
    "Search Events...",
    "Search Shows...",
    "Search Concerts...",
  ];

  // Refs
  const ottRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  // Debounced live suggestions fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      setShowSuggestions(true);
      try {
        const res = await fetch(`/api/ott/search?q=${encodeURIComponent(searchQuery.trim())}&state=${encodeURIComponent(selectedState || "")}&crossOtt=${crossOttSearch}`);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            setSuggestions(data.results || []);
            setSuggestionsType(data.type || "db");
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Suggestions fetch error:", err);
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedState, crossOttSearch]);

  // ── Notifications ──────────────────────────────────────────────────────────
  const DEFAULT_NOTIFICATIONS = [
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed! 🎉",
      message: "Your booking for AR Rahman Live on Jun 22 at Nehru Indoor Arena has been confirmed.",
      date: "2026-06-28 · 10:14 AM",
      read: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Successful ✅",
      message: "₹3,499 was successfully charged for your Vijay Antony Concert ticket. Receipt sent to your email.",
      date: "2026-06-27 · 7:02 PM",
      read: false,
    },
    {
      id: 3,
      type: "vehicle",
      title: "Vehicle Assigned 🚗",
      message: "Your cab to Chepauk Stadium has been assigned. Driver: Ravi Kumar | MH 12 AB 3456.",
      date: "2026-06-26 · 5:30 PM",
      read: false,
    },
    {
      id: 4,
      type: "reminder",
      title: "Trip Reminder ⏰",
      message: "Your event 'Coolie' at PVR Palazzo Theatre starts in 2 hours. Don't forget your e-ticket!",
      date: "2026-06-25 · 4:00 PM",
      read: true,
    },
    {
      id: 5,
      type: "offer",
      title: "Special Offer Just for You 🎁",
      message: "Get 20% off on your next booking with code VIBE20. Valid till July 10, 2026.",
      date: "2026-06-24 · 11:00 AM",
      read: true,
    },
  ];

  const NOTIF_KEY = "vibepass_notifications";

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      setNotifications(saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS);
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, []);

  const saveNotifications = (updated) => {
    setNotifications(updated);
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(updated)); } catch {}
  };

  const markAsRead = (id) =>
    saveNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));

  const deleteNotification = (id) =>
    saveNotifications(notifications.filter((n) => n.id !== id));

  const markAllAsRead = () =>
    saveNotifications(notifications.map((n) => ({ ...n, read: true })));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NOTIF_ICON = {
    booking:  <Ticket  size={15} className="text-orange-400" />,
    payment:  <CreditCard size={15} className="text-emerald-400" />,
    vehicle:  <Car     size={15} className="text-sky-400" />,
    reminder: <Clock   size={15} className="text-amber-400" />,
    offer:    <Tag     size={15} className="text-purple-400" />,
  };

  const NOTIF_RING = {
    booking:  "border-orange-500/30 bg-orange-500/5",
    payment:  "border-emerald-500/30 bg-emerald-500/5",
    vehicle:  "border-sky-500/30 bg-sky-500/5",
    reminder: "border-amber-500/30 bg-amber-500/5",
    offer:    "border-purple-500/30 bg-purple-500/5",
  };

  // Cycling placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ottRef.current && !ottRef.current.contains(e.target))
        setIsOttOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setIsNotifOpen(false);
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target))
        setIsStateDropdownOpen(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target))
        setShowSuggestions(false);
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("vibepass_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    
    // Listen for storage/custom events to update user state dynamically
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vibepass_user");
    setUser(null);
    router.push("/");
  };

  const getCurrentLocationText = () => {
    if (status === "requesting") return "Detecting…";
    if (status === "granted") {
      if (location?.city) return location.city;
      if (location?.latitude && location?.longitude) {
        return `${location.latitude.toFixed(1)}°, ${location.longitude.toFixed(1)}°`;
      }
      return "Location Active";
    }
    if (status === "denied") return "Location Denied";
    if (status === "timeout") return "Timeout";
    if (status === "unavailable") return "Unavailable";
    return "Detect Location";
  };

  const handleLocationClick = () => {
    if (status === "denied" || status === "timeout" || status === "unavailable" || status === "idle") {
      triggerRequest();
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 text-white transition-all duration-300">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* 1. Website Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setSearchQuery("");
                setSelectedOtt("All");
                setMobileSearchOpen(false);
                router.push("/");
              }}
              className="group flex items-center gap-1 select-none"
            >
              <Image
                src="/logo.svg"
                alt="VibePass Logo"
                width={80}
                height={80}
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity mr-3">
                VibePass
              </span>
            </a>

            {/* 11. Unified Location & State Selector (Desktop) */}
            <div className="hidden md:block relative" ref={stateDropdownRef}>
              <button
                onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm font-semibold text-neutral-300 hover:border-orange-500/40 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <MapPin className="text-orange-500 shrink-0" size={15} />
                <span>
                  {selectedState || 
                   (status === "granted" && location?.region) ||
                   (status === "requesting" ? "Detecting…" : "Select Location")}
                </span>
                <ChevronDown size={14} className="text-neutral-500" />
              </button>

              {isStateDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50">
                  {/* Automatic Location Fetcher Option */}
                  <button
                    onClick={() => {
                      if (status !== "requesting") {
                        handleLocationClick();
                      }
                    }}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer mb-1 ${
                      status === "granted" 
                        ? "bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20" 
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className={status === "granted" ? "text-orange-400" : "text-neutral-400"} />
                      {status === "requesting" ? "Detecting location..." : 
                       status === "granted" ? `Auto Detected: ${location?.region || "Active"}` : "Use GPS / Auto Detect"}
                    </span>
                    {status === "granted" && <Check size={12} className="text-orange-400" />}
                  </button>

                  <div className="h-px bg-neutral-800 my-1.5" />

                  <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Select State
                  </div>
                  

                  {["Tamil Nadu", "Andhra Pradesh", "Kerala", "Karnataka", "Rajasthan"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedState(st);
                        setIsStateDropdownOpen(false);
                      }}
                      className={`w-full text-left flex items-center justify-between px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer ${
                        selectedState === st ? "text-orange-400 font-semibold" : "text-neutral-300"
                      }`}
                    >
                      <span>{st}</span>
                      {selectedState === st && <Check size={12} className="text-orange-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2 & 3. Main Search Engine Container (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl relative" ref={searchContainerRef}>
            <div className="w-full flex items-center bg-neutral-900 border border-neutral-800 focus-within:border-orange-500/50 rounded-xl px-3 py-1.5 transition-all shadow-inner">
              <Search className="text-neutral-500 shrink-0 mr-2" size={18} />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="flex-1 text-sm bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 h-8"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white mr-1 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
              
              {/* Toggle Cross-OTT search on/off */}
              <button
                type="button"
                onClick={() => setCrossOttSearch(!crossOttSearch)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 shrink-0 ${
                  crossOttSearch 
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
                    : "bg-neutral-850 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
                title="Toggle Cross-OTT Search fallback"
              >
                <Tv size={13} className={crossOttSearch ? "text-orange-500" : "text-neutral-400"} />
                <span>{crossOttSearch ? "OTT Search On" : "OTT Search Off"}</span>
              </button>
            </div>

            {/* Desktop Live Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950/95 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                <div className="max-h-[350px] overflow-y-auto divide-y divide-neutral-800/60 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                  {isSuggestionsLoading ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-neutral-400 text-xs font-medium">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      Searching matching titles...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="py-6 px-4 text-center text-xs text-neutral-500">
                      No matching events or OTT titles found.
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2.5 bg-neutral-900/50 flex items-center justify-between text-[10px] font-bold tracking-wider text-neutral-500 uppercase border-b border-neutral-800/50">
                        <span>{suggestionsType === "db" ? `Events in ${selectedState || "your area"}` : "Cross-OTT Stream Guide"}</span>
                        <span className="text-orange-400 font-semibold">{suggestionsType === "db" ? "Local Event" : "OTT Search"}</span>
                      </div>

                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery("");
                            if (item.type === "ott") {
                              router.push(`/ott/search?q=${encodeURIComponent(item.title)}`);
                            } else {
                              try {
                                localStorage.setItem("selectedEvent", JSON.stringify(item));
                              } catch (e) {
                                console.error("Failed to save selected event to localStorage:", e);
                              }
                              router.push(`/event-details/${encodeURIComponent(item.title)}`);
                            }
                          }}
                          className="w-full flex items-center gap-3.5 px-4 py-3 text-left hover:bg-neutral-900/60 transition-colors border-b border-neutral-800/30 last:border-b-0 cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-9 h-12 object-cover rounded-lg bg-neutral-800 border border-neutral-800 shrink-0 shadow-md"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">{item.title}</p>
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-medium">
                              {item.category} • {item.location}
                            </p>
                          </div>
                          {item.type === "ott" ? (
                            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 uppercase tracking-wider shrink-0">
                              Stream
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500 to-rose-500 text-[9px] font-black text-white uppercase tracking-wider shrink-0 shadow-lg shadow-orange-500/20">
                              Book
                            </span>
                          )}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Sign In Button, Favourites & Notifications Icons (No dropdown menus on click) */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white cursor-pointer"
            >
              <Search size={20} />
            </button>

            {/* 12. Wishlist/Favorites (Heart Icon → navigates to /favourites) */}
            <div className="relative">
              <button
                onClick={() => router.push("/favourites")}
                className="relative p-2.5 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-rose-500 transition-all active:scale-95 cursor-pointer"
                title="My Favourites"
                aria-label="Favourites"
              >
                <Heart size={20} className="fill-rose-500 text-rose-500" />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-neutral-950 shadow-lg">
                    {favCount > 9 ? "9+" : favCount}
                  </span>
                )}
              </button>
            </div>

            {/* 9. Notifications Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className={`relative p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isNotifOpen
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                    : "hover:bg-neutral-900 text-neutral-300 hover:text-orange-400"
                }`}
                title="Notifications"
                aria-label="Toggle Notifications"
              >
                <Bell size={20} className={isNotifOpen ? "text-orange-400" : "text-orange-400"} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-neutral-950 shadow-lg">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* ── Notifications Dropdown ── */}
              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-3 w-[380px] max-w-[calc(100vw-32px)] rounded-2xl bg-neutral-950/98 border border-neutral-800 shadow-2xl shadow-black/50 z-50 backdrop-blur-xl overflow-hidden">
                  {/* Gradient accent bar */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500" />

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-orange-400" />
                      <span className="text-sm font-bold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[10px] font-bold text-orange-400">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                          title="Mark all as read"
                        >
                          <CheckCheck size={13} />
                          All read
                        </button>
                      )}
                      <button
                        onClick={() => setIsNotifOpen(false)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
                        aria-label="Close"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-neutral-800/50 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                          <BellOff size={24} className="text-neutral-600" />
                        </div>
                        <p className="text-sm font-semibold text-neutral-400">All caught up!</p>
                        <p className="text-xs text-neutral-600 mt-1">No notifications right now. Check back later.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`group relative flex items-start gap-3 px-4 py-3.5 transition-all duration-200 ${
                            notif.read ? "bg-transparent hover:bg-neutral-900/40" : "bg-orange-500/5 hover:bg-orange-500/10"
                          }`}
                        >
                          {/* Unread dot */}
                          {!notif.read && (
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                          )}

                          {/* Icon */}
                          <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center ${
                            NOTIF_RING[notif.type] || "border-neutral-700 bg-neutral-800"
                          }`}>
                            {NOTIF_ICON[notif.type] || <Bell size={15} className="text-neutral-400" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold leading-snug ${ notif.read ? "text-neutral-300" : "text-white" }`}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-neutral-600 mt-1.5 font-medium">{notif.date}</p>
                          </div>

                          {/* Action buttons — appear on hover */}
                          <div className="shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                                title="Mark as read"
                              >
                                <Check size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-600">
                        {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={() => saveNotifications([])}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} /> Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 10. User Profile & Dropdown */}
            {user ? (
              <div 
                ref={profileRef}
                className="relative flex items-center"
              >
                {/* Profile Trigger */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all cursor-pointer select-none"
                >
                  <img
                    src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "User")}&background=ea580c&color=fff`}
                    alt={user.name || "User Avatar"}
                    className="w-7 h-7 rounded-full border border-orange-500/30 object-cover shadow-sm shadow-orange-500/10"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-neutral-300">
                    <span className="text-white">{user.name || user.email?.split('@')[0] || user.phone}</span>
                  </span>
                  <ChevronDown size={12} className={`text-neutral-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-neutral-950/95 border border-neutral-800 shadow-2xl p-3.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
                    {/* User Profile Header inside dropdown */}
                    <div className="flex items-center gap-3 pb-3.5 mb-3 border-b border-neutral-800/80">
                      <img
                        src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "User")}&background=ea580c&color=fff`}
                        alt={user.name || "User Avatar"}
                        className="w-10 h-10 rounded-full border border-orange-500/30 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">
                          {user.name || "VibePass User"}
                        </span>
                        <span className="text-[10px] text-neutral-500 truncate">
                          {user.email || user.phone || "No contact info"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 mb-2.5">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push("/tickets");
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-all duration-200 cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <Ticket size={13} className="text-orange-400 group-hover:text-orange-300 transition-colors" />
                          <span>My Tickets</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 transition-colors font-medium">
                          View Passes
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer group"
                    >
                      <span>Sign Out</span>
                      <LogOut size={13} className="text-rose-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-linear-to-r from-orange-500 to-rose-500 hover:opacity-90 active:scale-95 text-white shadow-lg shadow-orange-500/10 transition-all duration-200 shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay Drawer */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-neutral-900 px-4 py-3 animate-in slide-in-from-top duration-200">
            {/* Location Selector (Mobile Row) */}
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <span className="text-xs font-semibold text-neutral-400">
                Current Location:
              </span>
              <button
                onClick={handleLocationClick}
                disabled={status === "requesting" || status === "granted"}
                className={`flex items-center gap-1 text-xs text-orange-400 font-semibold ${
                  status !== "requesting" && status !== "granted"
                    ? "cursor-pointer active:scale-95"
                    : "cursor-default"
                }`}
              >
                <MapPin size={12} className="text-orange-500" />
                <span>{getCurrentLocationText()}</span>
              </button>
            </div>

            <div className="relative mt-2" ref={mobileSearchContainerRef}>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 focus-within:border-orange-500/50">
                <Search className="text-neutral-500 shrink-0" size={16} />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="flex-1 text-xs bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-0.5 rounded-full hover:bg-neutral-800 text-neutral-400 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Mobile Live Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[300px] overflow-y-auto divide-y divide-neutral-800/60 backdrop-blur-xl">
                  {isSuggestionsLoading ? (
                    <div className="flex items-center justify-center py-4 gap-2 text-neutral-400 text-xs font-medium">
                      <span className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      Searching...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="py-4 px-3 text-center text-xs text-neutral-500">
                      No matching events or OTT titles found.
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-1.5 bg-neutral-900/50 flex items-center justify-between text-[9px] font-bold tracking-wider text-neutral-500 uppercase border-b border-neutral-800/50">
                        <span>{suggestionsType === "db" ? "Local Events" : "Cross-OTT Stream"}</span>
                      </div>
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery("");
                            setMobileSearchOpen(false);
                            if (item.type === "ott") {
                              router.push(`/ott/search?q=${encodeURIComponent(item.title)}`);
                            } else {
                              try {
                                localStorage.setItem("selectedEvent", JSON.stringify(item));
                              } catch (e) {
                                console.error("Failed to save selected event to localStorage:", e);
                              }
                              router.push(`/event-details/${encodeURIComponent(item.title)}`);
                            }
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-neutral-900 transition-colors border-b border-neutral-800/30 last:border-b-0 cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-8 h-10 object-cover rounded bg-neutral-800 border border-neutral-800 shrink-0 shadow-sm"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.title}</p>
                            <p className="text-[9px] text-neutral-400 truncate mt-0.5 font-medium">
                              {item.category} • {item.location}
                            </p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Filters */}
            <div className="flex items-center justify-end gap-3 mt-3">
              {/* Cross OTT Search Switch */}
              <button
                type="button"
                onClick={() => setCrossOttSearch(!crossOttSearch)}
                className="flex items-center gap-1.5 bg-neutral-850 px-2 py-0.5 rounded text-[10px] text-neutral-400 hover:text-white cursor-pointer"
              >
                <span
                  className={
                    crossOttSearch ? "text-orange-400 font-semibold" : ""
                  }
                >
                  Cross-OTT Auto-Search
                </span>
                <span
                  className={`w-6 h-3.5 rounded-full p-0.5 transition-colors relative shrink-0 ${crossOttSearch ? "bg-orange-500" : "bg-neutral-700"}`}
                >
                  <span
                    className={`absolute bg-white w-2.5 h-2.5 rounded-full top-0.5 transition-all ${crossOttSearch ? "left-3" : "left-0.5"}`}
                  />
                </span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
