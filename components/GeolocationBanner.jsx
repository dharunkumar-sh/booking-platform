"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  X,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useGeolocationContext } from "@/context/GeolocationContext";

/**
 * GeolocationBanner — a floating, themed permission request modal.
 *
 * States rendered:
 *  - "banner"      — initial permission request dialog
 *  - "requesting"  — spinner while fetching position
 *  - "granted"     — success confirmation (auto-dismisses after 3s)
 *  - "denied"      — rose error panel with manual fallback info
 *  - "timeout"     — amber panel with retry option
 *  - "unavailable" — amber panel, position unavailable
 *  - "error"       — generic error panel
 */
export default function GeolocationBanner() {
  const {
    showBanner,
    status,
    error,
    location,
    isRestored,
    dismissBanner,
    triggerRequest,
    manualRetry,
  } = useGeolocationContext();

  const [localDismissed, setLocalDismissed] = useState(false);

  // Reset localDismissed when a new request starts
  useEffect(() => {
    if (status === "requesting") {
      setLocalDismissed(false);
    }
  }, [status]);

  // Auto-dismiss the success toast after 3 seconds
  useEffect(() => {
    if (status === "granted") {
      const timer = setTimeout(() => {
        setLocalDismissed(true);
        dismissBanner();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, dismissBanner]);

  const handleClose = () => {
    setLocalDismissed(true);
    dismissBanner();
  };

  // Keyboard: Escape closes the banner
  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === "Escape" &&
        (showBanner ||
          ["requesting", "granted", "denied", "timeout", "unavailable", "error"].includes(status))
      ) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showBanner, status, dismissBanner]);

  // Only render when the banner should be shown OR during an active geolocation state
  const isVisible =
    !localDismissed &&
    (showBanner ||
      status === "requesting" ||
      (status === "granted" && !isRestored) ||
      status === "denied" ||
      status === "timeout" ||
      status === "unavailable" ||
      status === "error");

  if (!isVisible) return null;

  // Helpers
  const displayCity = location?.city || (location ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°` : null);

  return (
    <>
      {/* Backdrop — only on initial banner, not on post-request states */}
      {showBanner && status === "idle" && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Banner container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Location permission request"
        aria-live="polite"
        className="fixed z-50 transition-all duration-500"
        style={{
          bottom: "24px",
          right: "24px",
          left: "auto",
          maxWidth: "420px",
          width: "calc(100vw - 48px)",
        }}
      >
        {/* ─── INITIAL BANNER ─────────────────────────────────── */}
        {showBanner && status === "idle" && (
          <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl shadow-orange-500/10 backdrop-blur-xl overflow-hidden">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
              aria-label="Dismiss location request"
            >
              <X size={16} />
            </button>

            <div className="p-5 pt-6">
              {/* Icon + title */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation size={20} className="text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm leading-snug">
                    Enable location for better events
                  </h2>
                  <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                    VibePass uses your location to show nearby concerts, movies,
                    and live events happening around you.
                  </p>
                </div>
              </div>

              {/* Privacy note */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <ShieldCheck size={14} className="text-green-400 shrink-0" />
                <p className="text-xs text-neutral-400">
                  Your location is{" "}
                  <span className="text-neutral-200 font-semibold">never shared</span>{" "}
                  and only used to personalise your experience.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={triggerRequest}
                  id="geo-allow-btn"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin size={15} />
                  Allow Location
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── REQUESTING STATE ───────────────────────────────── */}
        {status === "requesting" && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-orange-500/30 bg-neutral-900/95 shadow-xl shadow-orange-500/10 backdrop-blur-xl">
            <Loader2 size={20} className="text-orange-400 animate-spin shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Detecting your location…</p>
              <p className="text-neutral-400 text-xs">This may take a few seconds</p>
            </div>
          </div>
        )}

        {/* ─── SUCCESS STATE ──────────────────────────────────── */}
        {status === "granted" && location && !isRestored && (
          <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl border border-green-500/30 bg-neutral-900/95 shadow-xl shadow-green-500/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-green-500 to-emerald-400" />
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">
                📍 {displayCity ?? "Location detected"}
              </p>
              <p className="text-neutral-400 text-xs">
                Showing events near you · ±{Math.round(location.accuracy ?? 0)}m accuracy
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ─── DENIED STATE ───────────────────────────────────── */}
        {status === "denied" && (
          <div className="relative rounded-2xl border border-rose-500/30 bg-neutral-900/95 shadow-xl shadow-rose-500/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 to-pink-500" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-rose-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Location access denied</p>
                  <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">{error}</p>
                  <p className="text-neutral-500 text-xs mt-2">
                    Use the city dropdown in the header to set your location manually.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-neutral-500 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TIMEOUT / UNAVAILABLE STATE ────────────────────── */}
        {(status === "timeout" || status === "unavailable") && (
          <div className="relative rounded-2xl border border-amber-500/30 bg-neutral-900/95 shadow-xl shadow-amber-500/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-500" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">
                    {status === "timeout" ? "Location request timed out" : "Location unavailable"}
                  </p>
                  <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">{error}</p>
                  <button
                    onClick={() => { manualRetry(); handleClose(); }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    Try again
                  </button>
                </div>
                <button
                  onClick={handleClose}
                  className="text-neutral-500 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── GENERIC ERROR STATE ─────────────────────────────── */}
        {status === "error" && (
          <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl border border-rose-500/30 bg-neutral-900/95 shadow-xl backdrop-blur-xl overflow-hidden">
            <AlertTriangle size={18} className="text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Location error</p>
              <p className="text-neutral-400 text-xs">{error}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
