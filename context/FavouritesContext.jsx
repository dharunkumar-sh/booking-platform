"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FAV_KEY = "vibepass_favourites";

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [user, setUser] = useState(null);

  // 1. Monitor user authentication status
  useEffect(() => {
    const checkUser = () => {
      const stored = sessionStorage.getItem("vibepass_user");
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
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // 2. Fetch favourites from backend or sessionStorage
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
    // Fallback to sessionStorage
    try {
      const saved = sessionStorage.getItem(FAV_KEY);
      if (saved) setFavourites(JSON.parse(saved));
    } catch {
      setFavourites([]);
    }
  }, [user]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // 3. Process pending favourite action post-login
  useEffect(() => {
    const pendingId = sessionStorage.getItem("favourite_pending_event_id");
    if (pendingId && user?.id) {
      sessionStorage.removeItem("favourite_pending_event_id");
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
  }, [user, loadFavourites]);

  const isFavourite = useCallback(
    (id) => favourites.some((f) => f.id === id),
    [favourites]
  );

  const toggleFavourite = useCallback(
    async (item) => {
      const storedUser = sessionStorage.getItem("vibepass_user");
      if (!storedUser) {
        // Redirect to login
        sessionStorage.setItem("favourite_pending_event_id", item.id);
        sessionStorage.setItem("login_redirect", window.location.pathname);
        window.location.href = "/login";
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      try {
        const res = await fetch("/api/events/favourite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: item.id, userId: parsedUser.id })
        });
        const data = await res.json();
        if (data.success) {
          loadFavourites();
        }
      } catch (err) {
        console.error("Failed to toggle favourite on backend:", err);
      }
    },
    [loadFavourites]
  );

  const removeFavourite = useCallback(async (id) => {
    const storedUser = sessionStorage.getItem("vibepass_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      try {
        await fetch("/api/events/favourite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: id, userId: parsedUser.id })
        });
        loadFavourites();
        return;
      } catch (err) {
        console.error("Failed to remove favourite on backend:", err);
      }
    }
    // Fallback local remove
    setFavourites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try { sessionStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [loadFavourites]);

  const clearFavourites = useCallback(() => {
    setFavourites([]);
    try { sessionStorage.removeItem(FAV_KEY); } catch {}
  }, []);

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
