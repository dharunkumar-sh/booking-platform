"use client";

import React, { createContext, useContext, useEffect, useCallback } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const user = useBookingStore((state) => state.user);
  const favourites = useBookingStore((state) => state.favourites);
  const setFavourites = useBookingStore((state) => state.setFavourites);
  const favouritePendingEventId = useBookingStore((state) => state.favouritePendingEventId);
  const setFavouritePendingEventId = useBookingStore((state) => state.setFavouritePendingEventId);
  const setLoginRedirect = useBookingStore((state) => state.setLoginRedirect);

  // 1. Fetch favourites from backend
  const loadFavourites = useCallback(async () => {
    if (user?.id) {
      try {
        const res = await fetch(`/api/events/favourite?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setFavourites(data.events || []);
          return;
        }
      } catch (err) {
        console.error("Failed to load favourites from backend:", err);
      }
    }
  }, [user, setFavourites]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // 2. Process pending favourite action post-login
  useEffect(() => {
    if (favouritePendingEventId && user?.id) {
      const pendingId = favouritePendingEventId;
      setFavouritePendingEventId(null);
      fetch("/api/events/favourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: Number(pendingId), userId: user.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadFavourites();
        }
      })
      .catch(err => console.error("Auto-apply pending favourite failed:", err));
    }
  }, [user, favouritePendingEventId, setFavouritePendingEventId, loadFavourites]);

  const isFavourite = useCallback(
    (id) => favourites.some((f) => f.id === id),
    [favourites]
  );

  const toggleFavourite = useCallback(
    async (item) => {
      if (!user) {
        // Redirect to login
        setFavouritePendingEventId(item.id);
        setLoginRedirect(window.location.pathname);
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("/api/events/favourite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: item.id, userId: user.id })
        });
        const data = await res.json();
        if (data.success) {
          loadFavourites();
        }
      } catch (err) {
        console.error("Failed to toggle favourite on backend:", err);
      }
    },
    [user, loadFavourites, setFavouritePendingEventId, setLoginRedirect]
  );

  const removeFavourite = useCallback(async (id) => {
    if (user) {
      try {
        await fetch("/api/events/favourite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: id, userId: user.id })
        });
        loadFavourites();
        return;
      } catch (err) {
        console.error("Failed to remove favourite on backend:", err);
      }
    }
    // Fallback local remove
    setFavourites(favourites.filter((f) => f.id !== id));
  }, [user, favourites, setFavourites, loadFavourites]);

  const clearFavourites = useCallback(() => {
    setFavourites([]);
  }, [setFavourites]);

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        isFavourite,
        toggleFavourite,
        removeFavourite,
        clearFavourites,
        count: favourites.length,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}
