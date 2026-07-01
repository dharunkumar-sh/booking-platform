"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FAV_KEY = "vibepass_favourites";

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAV_KEY);
      if (saved) setFavourites(JSON.parse(saved));
    } catch {
      setFavourites([]);
    }
  }, []);

  const persist = (list) => {
    setFavourites(list);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch {}
  };

  const isFavourite = useCallback(
    (id) => favourites.some((f) => f.id === id),
    [favourites]
  );

  const toggleFavourite = useCallback(
    (item) => {
      setFavourites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        const next = exists ? prev.filter((f) => f.id !== item.id) : [...prev, item];
        try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    },
    []
  );

  const removeFavourite = useCallback((id) => {
    setFavourites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearFavourites = useCallback(() => {
    persist([]);
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
