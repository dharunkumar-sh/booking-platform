"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

const LOCATION_KEY = "vibepass_geo_location";

const GeolocationContext = createContext(null);

/**
 * GeolocationProvider — wraps the app and exposes geolocation state globally.
 *
 * Consumed via useGeolocationContext() anywhere in the tree.
 */
export function GeolocationProvider({ children }) {
  const { location, status, error, isRestored, requestLocation, clearLocation } =
    useGeolocation();

  const [showBanner, setShowBanner] = useState(false);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  // On first load/mount: check if location exists in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_KEY);
    if (!saved) {
      // If first load (no saved location), show the themed prompt banner
      setShowBanner(true);
    }
  }, []);

  // Persist location and status to localStorage whenever they change
  useEffect(() => {
    if (status === "granted" && location) {
      try {
        localStorage.setItem(
          LOCATION_KEY,
          JSON.stringify({ status, location, timestamp: Date.now() })
        );
      } catch {
        // Storage quota exceeded or private mode
      }
    }
  }, [status, location]);

  /**
   * manualRetry — allow user to retry after timeout/error.
   */
  const manualRetry = useCallback(() => {
    clearLocation();
    setTimeout(() => requestLocation(), 100);
  }, [clearLocation, requestLocation]);

  const value = {
    // Core state
    location,
    status,
    error,
    isRestored,
    showBanner,
    // Actions
    triggerRequest: requestLocation,
    manualRetry,
    clearLocation,
    dismissBanner,
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
}

/**
 * useGeolocationContext — consume the global geolocation state.
 * Must be used inside <GeolocationProvider>.
 */
export function useGeolocationContext() {
  const ctx = useContext(GeolocationContext);
  if (!ctx) {
    throw new Error(
      "useGeolocationContext must be used inside <GeolocationProvider>"
    );
  }
  return ctx;
}
