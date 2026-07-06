# 🎫 Event Browsing, Geolocation & Map Feature

This module covers search, category-based filtering (Concerts, Comedy, Movies, Sports, Travel), geolocation banner triggers, and interactive Google Maps showcasing venue tags.

---

## 💻 Frontend Flow

*   **Location Filtering**: A geolocation context banner (`components/GeolocationBanner.jsx`) uses the browser navigator API to obtain coords, maps it to a state, and lets the user manually filter events by location state.
*   **Search & Budget Controls**: Users can type keywords (event titles, venues) or slide a pricing/budget range slider (up to ₹5,000) to filter the matches in real-time.
*   **Interactive Maps**: Uses `components/EventMap.jsx` to render venue locations dynamically. Marker pins reflect filtered events, showing price tags and category badges. Clicking a pin slides open a mini-preview card with booking links.
*   **Category Pages**: Renders bespoke category experiences (such as `/comedy`, `/concerts`, `/sports`, etc.) via a unified `<DiscoverCategoryPage>` component displaying themed headers and grids.
*   **Book Now Action**: Directs users into the seat selection sub-flow. If they aren't authenticated, the destination path is saved as a redirect URL in Zustand.

---

## ⚙️ Backend Flow

*   **Load Events (`GET /api/events`)**:
    *   Retrieves all event entries from the `events` table.
    *   Calculates relative distances using event latitude/longitude.
    *   Formats the rows and serves a payload structured by categories.
*   **Resolve Location (`GET /api/location`)**:
    *   Accepts coordinates (latitude and longitude) and performs reverse geocoding via external services or mock coordinates mapping.
    *   Returns the human-readable State/City string to enable localized content matching.
