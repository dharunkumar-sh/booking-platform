"use client";

import React, { useState, useEffect } from "react";
import { Cookie, Check, Trash2, ShieldCheck, HardDrive, RefreshCw } from "lucide-react";

export default function CookiePolicyPage() {
  const [storageStatus, setStorageStatus] = useState({
    city: "Not set",
    bookingsCount: 0,
    hasLocation: false,
  });
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const city = localStorage.getItem("userCity") || "Not set";
      const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
      const loc = localStorage.getItem("userLocation");
      setStorageStatus({
        city,
        bookingsCount: bookings.length,
        hasLocation: !!loc,
      });
    }
  }, [cleared]);

  const handleClearNonEssential = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userCity");
      localStorage.removeItem("userLocation");
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
          <Cookie size={14} />
          Client Storage & Cookies
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Cookie & Local Storage <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-400">
          Unlike legacy platforms that rely on intrusive tracking cookies, VibePass leverages lightning-fast browser local storage to preserve your city vibe without compromising privacy.
        </p>
      </div>

      {/* Interactive Local Storage Inspector Widget */}
      <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/90 via-neutral-900/50 to-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <HardDrive size={20} className="text-orange-400" />
              Your Live Browser Storage State
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Real-time inspection of client-side preferences stored on this device.</p>
          </div>
          <button
            onClick={handleClearNonEssential}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 transition hover:bg-rose-500/20 hover:text-rose-400 active:scale-95"
          >
            <Trash2 size={14} />
            Reset City & Location Cache
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Active City Preference</span>
            <p className="mt-2 text-lg font-extrabold text-orange-400">{storageStatus.city}</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Saved Ticket Bookings</span>
            <p className="mt-2 text-lg font-extrabold text-white">{storageStatus.bookingsCount} Tickets</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">GPS Coordinates Cached</span>
            <p className="mt-2 text-lg font-extrabold text-emerald-400">
              {storageStatus.hasLocation ? "Yes (Optimized)" : "Not Cached"}
            </p>
          </div>
        </div>

        {cleared && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-400">
            <Check size={16} /> Non-essential location & city cache cleared successfully.
          </div>
        )}
      </div>

      {/* Storage Categories Table */}
      <div className="mx-auto mt-12 max-w-4xl space-y-6">
        <h2 className="text-2xl font-bold text-white">How We Use Storage Mechanisms</h2>
        
        <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/30">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-800 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Essential Functional Storage</h3>
                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">Always Active</span>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                Stores your active seat selection timer, checkout progress, and confirmed ticket IDs so you never lose your booking mid-transaction.
              </p>
            </div>

            <div className="border-b border-neutral-800 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Geolocation & City Cache</h3>
                <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-300">Optional / Client Controlled</span>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                To prevent unnecessary background API requests and battery drain, your selected city (`userCity`) and initial map coordinates are stored locally once on startup.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Authentication Tokens</h3>
                <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-300">Strict Security</span>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                If you sign into a VibePass profile, session keys are stored securely using HTTP-only cookies to protect against cross-site scripting (XSS) attacks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
