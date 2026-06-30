"use client";

import React from "react";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useGeolocationContext } from "@/context/GeolocationContext";

/**
 * LocationDisplay — compact location pill for use in the Header.
 *
 * States:
 *  idle        → "📍 Detect my location" button
 *  requesting  → spinner
 *  granted     → city name pill (green accent)
 *  denied      → muted "Set Location" fallback
 *  timeout/error/unavailable → amber retry pill
 */
export default function LocationDisplay() {
  const { location, status } = useGeolocationContext();

  const displayCity =
    location?.city ||
    (location
      ? `${location.latitude.toFixed(1)}°, ${location.longitude.toFixed(1)}°`
      : null);

  // ── Requesting ─────────────────────────────────────────────
  if (status === "requesting") {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 text-neutral-400 text-xs font-medium select-none">
        <Loader2 size={13} className="animate-spin text-orange-400" />
        <span>Detecting…</span>
      </div>
    );
  }

  // ── Granted ─────────────────────────────────────────────────
  if (status === "granted" && displayCity) {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold select-none"
        title={`Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)} · ±${Math.round(location.accuracy ?? 0)}m`}
        role="status"
        aria-label={`Location: ${displayCity}`}
      >
        <MapPin size={13} className="shrink-0" />
        <span className="max-w-[120px] truncate">{displayCity}</span>
      </div>
    );
  }

  // ── Denied / Timeout / Error / Idle ─────────────────────────
  // No "Set Location" fallback or manual prompts allowed - keep it automatic and clean
  return null;
}
