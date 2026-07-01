"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Mic,
  Bell,
  Heart,
  MapPin,
  ChevronDown,
  Check,
  X,
  Tv,
  LogOut,
} from "lucide-react";
import { useGeolocationContext } from "@/context/GeolocationContext";

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
  const { triggerRequest, location, status } = useGeolocationContext();
  // Input and selectors
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOtt, setSelectedOtt] = useState("All");
  const [crossOttSearch, setCrossOttSearch] = useState(true);

  // Interactive states
  const [isOttOpen, setIsOttOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const placeholders = [
    "Search Movies...",
    "Search Events...",
    "Search Shows...",
    "Search Concerts...",
  ];

  // Refs
  const ottRef = useRef(null);
  const profileRef = useRef(null);

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

            {/* 11. Location Selector (Desktop) */}
            <div className="hidden md:block">
              <button
                onClick={handleLocationClick}
                disabled={status === "requesting" || status === "granted"}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm font-medium text-neutral-300 transition-all duration-200 ${
                  status !== "requesting" && status !== "granted"
                    ? "hover:border-orange-500/40 hover:text-white cursor-pointer"
                    : "cursor-default"
                }`}
                title={status === "granted" && location ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}` : "Click to detect location"}
              >
                <MapPin className="text-orange-500 shrink-0" size={15} />
                <span>{getCurrentLocationText()}</span>
              </button>
            </div>
          </div>

          {/* 2 & 3. Main Search Engine Container (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl relative">
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

              {/* Voice Search button (UI only) */}
              <button
                className="p-1.5 rounded-lg mr-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
                title="Voice Search"
              >
                <Mic size={16} />
              </button>

              <div className="h-6 w-px bg-neutral-800 mr-2" />

              {/* 4. OTT Filter dropdown triggers */}
              <div className="relative shrink-0" ref={ottRef}>
                <button
                  onClick={() => setIsOttOpen(!isOttOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-neutral-800 text-xs font-semibold text-orange-400 transition-colors cursor-pointer"
                >
                  <Tv size={13} className="text-orange-500" />
                  <span>
                    {selectedOtt === "All" ? "All OTTs" : selectedOtt}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {isOttOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      Filter by Platform
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOtt("All");
                        setIsOttOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span
                        className={
                          selectedOtt === "All"
                            ? "text-orange-400 font-medium"
                            : "text-neutral-300"
                        }
                      >
                        All Platforms
                      </span>
                      {selectedOtt === "All" && (
                        <Check size={12} className="text-orange-500" />
                      )}
                    </button>
                    {OTT_PLATFORMS.map((ott) => (
                      <button
                        key={ott}
                        onClick={() => {
                          setSelectedOtt(ott);
                          setIsOttOpen(false);
                        }}
                        className="w-full text-left flex items-center justify-between px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <span
                          className={
                            selectedOtt === ott
                              ? "text-orange-400 font-medium"
                              : "text-neutral-300"
                          }
                        >
                          {ott}
                        </span>
                        {selectedOtt === ott && (
                          <Check size={12} className="text-orange-500" />
                        )}
                      </button>
                    ))}

                    <div className="h-px bg-neutral-800 my-2" />

                    {/* 5. Search Other OTT Platforms Toggle Inside Filter Dropdown */}
                    <div className="px-2.5 py-1.5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-neutral-300">
                          Auto-Search Cross-OTT
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          Find on other OTTs if missing
                        </span>
                      </div>
                      <button
                        onClick={() => setCrossOttSearch(!crossOttSearch)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 cursor-pointer ${crossOttSearch ? "bg-orange-500" : "bg-neutral-800"}`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${crossOttSearch ? "translate-x-4" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

            {/* 12. Wishlist/Favorites (Heart Icon - Shows no dropdown when clicked) */}
            <div className="relative">
              <button
                className="relative p-2.5 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-rose-500 transition-all active:scale-95 cursor-pointer"
                title="Favorites"
              >
                <Heart size={20} className="fill-rose-500 text-rose-500" />
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-neutral-950 scale-100 transition-transform">
                  2
                </span>
              </button>
            </div>

            {/* 9. Notifications (Bell Icon - Shows no dropdown when clicked) */}
            <div className="relative">
              <button
                className="relative p-2.5 rounded-xl hover:bg-neutral-900 text-neutral-300 hover:text-orange-400 transition-all active:scale-95 cursor-pointer"
                title="Notifications"
              >
                <Bell size={20} className="text-orange-400" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border border-neutral-950" />
              </button>
            </div>

            {/* 10. User Profile & Dropdown */}
            {user ? (
              <div 
                ref={profileRef}
                className="relative flex items-center"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
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

              <button className="p-1 rounded text-neutral-400 cursor-default">
                <Mic size={14} />
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="flex items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400">OTT:</span>
                <select
                  value={selectedOtt}
                  onChange={(e) => setSelectedOtt(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 rounded px-2 py-0.5 cursor-pointer"
                >
                  <option value="All">All OTTs</option>
                  {OTT_PLATFORMS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cross OTT Search Switch */}
              <button
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
