# 🏠 Landing Page & Discovery Dashboard Feature

This module describes the core landing page components, including the dynamic Hero banner, mood-based category suggestions, trending & featured events section, geolocation filters, and the interactive Map search.

---

## 💻 Frontend Flow

*   **Render Hero Banner**: Displays a dynamic, high-resolution background image carousel matching the user's selected mood.
*   **Search & Auto-suggestions**: Integrates a live query search input that highlights matching terms within events and venues using auto-suggestions.
*   **Mood Filter Selection**: Users select mood buttons (e.g., *Relaxed*, *Adventurous*, *Romantic*) to filter page categories (e.g., mapping *Romantic* to *Movies*, *Adventure* to *Events*).
*   **Curated Event Sections**: Displays event listings divided into "Featured" and "Trending" carousels, listening to search query inputs, mood overrides, and state-level filters.
*   **Interactive Maps**: Renders custom maps showing pinned venue locations of current events.
*   **State / Location Filter Context**: Integrates a custom banner context that allows users to filter events to their specific geographical state (e.g., Delhi, Maharashtra, Karnataka).

---

## ⚙️ Backend Flow

*   **Retrieve Active Locations & Events (`GET /api/events`)**:
    *   Fetches the complete active events dataset from the Postgres database.
    *   Injects categories, ratings, prices, coords, and review details.
*   **State filter query support**: Supports filtering by coordinates or states to yield localized lists back to the landing page grids.

---

## 📝 Implementation Code Sample

Here is the core code structure in `app/page.js` coordinating the landing page's search query, mood categories, state filters, and mapping flows:

```javascript
"use client";

import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useState } from "react";
import { useGeolocationContext } from "@/context/GeolocationContext";

const MOOD_TO_CATEGORY = {
  relaxed: ["show"],
  adventure: ["event"],
  romantic: ["movie"],
  productive: ["show", "event"],
  luxury: ["concert"],
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { selectedState } = useGeolocationContext();

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleMoodChange = (moodKey) => {
    if (!moodKey) {
      setSelectedCategories([]);
      return;
    }
    const cats = MOOD_TO_CATEGORY[moodKey] || [];
    setSelectedCategories(cats);
  };

  const handleBookEvent = (event) => {
    const store = useBookingStore.getState();
    const user = store.user;
    const query = new URLSearchParams({
      venue: event.venue || event.location || "",
      category: event.category || "",
    }).toString();
    const destination = `/seat-selection/${encodeURIComponent(event.title)}?${query}`;

    store.setSelectedEvent(event);

    if (!user) {
      store.setLoginRedirect(destination);
      router.push("/login");
      return;
    }
    router.push(destination);
  };

  return (
    <div>
      <Hero
        onSearchChange={handleSearchChange}
        onMoodChange={handleMoodChange}
      />
      <FeaturedEvents
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedState={selectedState}
        onBookEvent={handleBookEvent}
      />
      <TrendingEvents
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedState={selectedState}
        onBookEvent={handleBookEvent}
      />
      <EventMapWrapper
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        onBookEvent={handleBookEvent}
      />
    </div>
  );
}
```
