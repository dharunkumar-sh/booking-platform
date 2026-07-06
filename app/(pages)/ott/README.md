# 📺 OTT (Over-the-Top) Content Explorer Feature

This module provides a search and curation dashboard displaying movies, web series, and streaming titles available across platforms like Netflix, Prime Video, Hotstar, and more, integrated with TMDb API.

---

## 💻 Frontend Flow

*   **Platform Filtering**: The user selects tabs (Netflix, Prime Video, Disney+ Hotstar, JioCinema, Sony LIV, ZEE5) to instantly view filtered movies/shows.
*   **Mood Filter Selection**: Supports toggling movie recommendations categorized by moods ("High Adrenaline", "Cozy Weekend", "Mind Bending", "Feel Good Comedy").
*   **Search Input**: Typing queries fires search events. If "Cross OTT" search is toggled, it hits the TMDb multi-search endpoint via the proxy route `/api/ott/search`.
*   **Watchlist Synchronizer**:
    *   Tapping **+ Watchlist** triggers a database request to add the item, shifting the button state to a verified checkmark.
    *   Logged-in users have their watchlists loaded automatically via `/api/watchlist?email=...` when mounting the OTT Explorer.
*   **Platform Redirects**: Each movie detail card resolves available providers and attaches links (e.g. `netflix.com`, `primevideo.com`) allowing direct streaming redirection.

---

## ⚙️ Backend Flow

*   **Cross OTT Proxy Search (`GET /api/ott/search`)**:
    *   Accepts a search query parameter `q`.
    *   Checks local cache keys in a global memory map (`global.ottSearchCache`) to accelerate recurring requests and conserve external API rate limits.
    *   Queries the TMDb Multi-Search API (`https://api.themoviedb.org/3/search/multi?api_key=...`) fetching results.
    *   For each match, fetches provider lists from TMDb Watch Providers (`https://api.themoviedb.org/3/movie/{id}/watch/providers` or `tv/{id}/watch/providers`).
    *   Caches the structured result array and returns it to the client.
