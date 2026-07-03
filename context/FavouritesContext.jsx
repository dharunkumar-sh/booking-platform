"use client";

import React, { createContext, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { useBookingStore } from "@/hooks/useBookingStore";

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const user = useBookingStore((state) => state.user);
  const logout = useBookingStore((state) => state.logout);
  const favourites = useBookingStore((state) => state.favourites);
  const setFavourites = useBookingStore((state) => state.setFavourites);
  const favouritePendingEventId = useBookingStore((state) => state.favouritePendingEventId);
  const setFavouritePendingEventId = useBookingStore((state) => state.setFavouritePendingEventId);
  const setLoginRedirect = useBookingStore((state) => state.setLoginRedirect);

  // 1. Fetch favourites from backend
  const loadFavourites = useCallback(() => {
    if (user?.id) {
      axios.get(`/api/events/favourite?userId=${user.id}`)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            setFavourites(data.events || []);
          }
        })
        .catch((err) => {
          console.error("Failed to load favourites from backend:", err);
          if (err.response?.data?.invalidSession) {
            logout();
            window.location.href = "/login";
          }
        });
    }
  }, [user, setFavourites, logout]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // 2. Process pending favourite action post-login
  useEffect(() => {
    if (favouritePendingEventId && user?.id) {
      const pendingId = favouritePendingEventId;
      setFavouritePendingEventId(null);
      axios.post("/api/events/favourite", { eventId: Number(pendingId), userId: user.id })
        .then((response) => {
          const data = response.data;
          if (data.success) {
            loadFavourites();
          }
        })
        .catch(err => {
          console.error("Auto-apply pending favourite failed:", err);
          if (err.response?.data?.invalidSession) {
            logout();
            window.location.href = "/login";
          }
        });
    }
  }, [user, favouritePendingEventId, setFavouritePendingEventId, loadFavourites, logout]);

  // eslint-disable-next-line eqeqeq
  const isFavourite = useCallback(
    (id) => favourites.some((f) => f.id == id),
    [favourites]
  );

  const toggleFavourite = useCallback(
    (item) => {
      if (!user) {
        // Redirect to login
        setFavouritePendingEventId(item.id);
        setLoginRedirect(window.location.pathname);
        window.location.href = "/login";
        return;
      }

      // Optimistic update
      // eslint-disable-next-line eqeqeq
      const alreadyFav = favourites.some((f) => f.id == item.id);
      if (alreadyFav) {
        // eslint-disable-next-line eqeqeq
        setFavourites(favourites.filter((f) => f.id != item.id));
      } else {
        setFavourites([...favourites, item]);
      }

      axios.post("/api/events/favourite", { eventId: item.id, userId: user.id })
        .then((response) => {
          const data = response.data;
          if (data.success) {
            // Sync with server truth
            loadFavourites();
          } else {
            // Rollback
            loadFavourites();
          }
        })
        .catch((err) => {
          console.error("Failed to toggle favourite on backend:", err);
          // Rollback by reloading
          loadFavourites();
          if (err.response?.data?.invalidSession) {
            logout();
            window.location.href = "/login";
          }
        });
    },
    [user, favourites, setFavourites, loadFavourites, setFavouritePendingEventId, setLoginRedirect, logout]
  );

  const removeFavourite = useCallback((id) => {
    // Optimistic remove
    // eslint-disable-next-line eqeqeq
    setFavourites(favourites.filter((f) => f.id != id));
    if (user) {
      axios.post("/api/events/favourite", { eventId: id, userId: user.id })
        .then((response) => {
          // Re-sync to confirm
          loadFavourites();
        })
        .catch((err) => {
          console.error("Failed to remove favourite on backend:", err);
          loadFavourites();
          if (err.response?.data?.invalidSession) {
            logout();
            window.location.href = "/login";
          }
        });
    }
  }, [user, favourites, setFavourites, loadFavourites, logout]);

  const clearFavourites = useCallback(() => {
    // Optimistic clear
    const prevFavourites = favourites;
    setFavourites([]);
    if (user) {
      // Remove each from backend (toggle each that currently is favourited)
      Promise.all(
        prevFavourites.map((f) =>
          axios.post("/api/events/favourite", { eventId: f.id, userId: user.id })
        )
      )
      .catch((err) => {
        console.error("Failed to clear all favourites on backend:", err);
        if (err.response?.data?.invalidSession) {
          logout();
          window.location.href = "/login";
        }
      });
    }
  }, [user, favourites, setFavourites, logout]);


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
