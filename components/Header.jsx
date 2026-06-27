"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Goa",
];
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
  // Input and selectors
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedOtt, setSelectedOtt] = useState("All");
  const [crossOttSearch, setCrossOttSearch] = useState(true);

  // Interactive states

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isOttOpen, setIsOttOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Search Movies...",
    "Search Events...",
    "Search Shows...",
    "Search Concerts...",
  ];

  // Refs
  const cityRef = useRef(null);
  const ottRef = useRef(null);

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
      if (cityRef.current && !cityRef.current.contains(e.target))
        setIsCityOpen(false);
      if (ottRef.current && !ottRef.current.contains(e.target))
        setIsOttOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    const originalCity = selectedCity;
    setSelectedCity("Detecting...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Match user coordinates to the closest supported Indian city
        let detected = "Chennai";
        if (lat < 14) {
          detected = lon > 79 ? "Chennai" : "Bengaluru";
        } else if (lat < 18) {
          detected = "Pune";
        } else if (lat > 25) {
          detected = "Delhi";
        } else if (lon > 80) {
          detected = "Hyderabad";
        }

        setSelectedCity(detected);
        setIsCityOpen(false);
      },
      (error) => {
        console.warn("Location detection failed, fallback to default:", error);
        setSelectedCity(originalCity);
        alert("Unable to fetch location. Fallback to default.");
      },
    );
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
              className="group flex items-center gap-2 select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500 to-rose-500 flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                VP
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                VibePass
              </span>
            </a>

            {/* 11. Location Selector (Desktop) */}
            <div className="relative hidden md:block" ref={cityRef}>
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-orange-500/40 text-sm font-medium text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <MapPin className="text-orange-500" size={15} />
                <span>{selectedCity}</span>
                <ChevronDown
                  size={14}
                  className={`text-neutral-500 transition-transform duration-200 ${isCityOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <button
                    onClick={handleDetectLocation}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-orange-400 hover:bg-neutral-800 rounded-lg border-b border-neutral-800/60 transition-colors mb-1.5 cursor-pointer"
                  >
                    <MapPin size={12} className="animate-pulse" />
                    <span>Detect My Location</span>
                  </button>
                  <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Select City
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span
                        className={
                          selectedCity === city
                            ? "text-orange-400 font-medium"
                            : "text-neutral-300"
                        }
                      >
                        {city}
                      </span>
                      {selectedCity === city && (
                        <Check size={14} className="text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
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

                    <div className="h-[1px] bg-neutral-800 my-2" />

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

            {/* 10. User Sign In Button */}
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 active:scale-95 text-white shadow-lg shadow-orange-500/10 transition-all duration-200 shrink-0 cursor-pointer"
            >
              Sign In
            </button>
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
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-xs text-orange-400 font-semibold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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
