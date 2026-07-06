"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000,
};

const ERROR_MESSAGES = {
  1: "Location access was denied. You can still set your city manually.",
  2: "Your location could not be determined. Please try again or enter your city manually.",
  3: "Location request timed out. Check your connection and try again.",
};

async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "VibePass-App/1.0",
        },
      },
    );
    if (!res.ok) throw new Error("Geocoding failed");
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Nominatim response is not JSON");
    }
    const data = await res.json();
    const addr = data.address || {};
    let city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state_district ||
      addr.state ||
      null;
    if (city && typeof city === "string") {
      city = city.split(",")[0].trim();
    }
    const region = addr.state || null;
    const country = addr.country || null;
    return { city, region, country };
  } catch {
    return { city: null, region: null, country: null };
  }
}

export function useGeolocation() {
  const [status, setStatus] = useState("idle");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isRestored, setIsRestored] = useState(false);
  const requestedRef = useRef(false);

  // Restore saved location from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vibepass_geo_location");
      if (saved) {
        const { status: savedStatus, location: savedLocation } =
          JSON.parse(saved);
        if (savedStatus && savedLocation) {
          setStatus(savedStatus);
          setLocation(savedLocation);
          setIsRestored(true);
          requestedRef.current =
            savedStatus === "granted" || savedStatus === "requesting";
        }
      }
    } catch {}
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setStatus("unavailable");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (requestedRef.current) return;

    setStatus("requesting");
    setError(null);
    setIsRestored(false);
    requestedRef.current = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = position.timestamp;

        // Reverse geocode in parallel with state update
        const geoData = await reverseGeocode(latitude, longitude);

        const locationData = {
          latitude,
          longitude,
          accuracy,
          timestamp,
          ...geoData,
        };

        setLocation(locationData);
        setStatus("granted");
        setError(null);

        // Send to backend (fire-and-forget — never blocks UI)
        try {
          const sessionId =
            typeof window !== "undefined"
              ? sessionStorage.getItem("vibepass_session_id") ||
                `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
              : "anonymous";
          if (typeof window !== "undefined") {
            sessionStorage.setItem("vibepass_session_id", sessionId);
          }
          await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...locationData, sessionId }),
          });
        } catch {}
      },
      (err) => {
        const code = err.code; // 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        const statusMap = {
          1: "denied",
          2: "unavailable",
          3: "timeout",
        };
        setStatus(statusMap[code] || "error");
        setError(
          ERROR_MESSAGES[code] ||
            "An unknown error occurred while fetching your location.",
        );
        setLocation(null);
        requestedRef.current = false; // Allow retry on failure
      },
      GEO_OPTIONS,
    );
  }, []);

  const clearLocation = useCallback(() => {
    setStatus("idle");
    setLocation(null);
    setError(null);
    setIsRestored(false);
    requestedRef.current = false;
  }, []);

  return {
    location,
    status,
    error,
    isRestored,
    requestLocation,
    clearLocation,
  };
}
