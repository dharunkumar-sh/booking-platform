# 🌟 Watchlist & Favourites Feature

This module provides users with personalized lists to save upcoming events as "Favourites" and streaming titles as "Watchlist" items.

---

## 💻 Frontend Flow

*   **View Saved Items**:
    *   **Watchlist Grid**: Accessing `/watchlist` triggers a fetch query loading all saved movie/show items mapped directly from TMDb data.
    *   **Favourites Grid**: Accessing `/favourites` shows live concert, event, and comedy listings marked as favorites.
*   **Toggle Bookmark Action**:
    *   Clicking the bookmark/heart icon on any movie detail or event card evaluates current auth state. If not logged in, redirects to `/login`.
    *   If authorized, invokes helper methods triggering a request to add/remove the item dynamically.
*   **State updates**: Instantly updates local component states (altering icons and badge counts) and updates global sync variables.

---

## ⚙️ Backend Flow

*   **Fetch User Items (`GET /api/watchlist`)**:
    *   Extracts the email from query parameters and fetches the primary key from the `users` table.
    *   Queries the `watchlist` table filtered by `userId`, returning a structured array of saved media properties.
*   **Add Item (`POST /api/watchlist`)**:
    *   Checks for duplicate records based on `userId` and the API/TMDb identifier (`tmdbId`).
    *   Inserts record details (`userId`, `tmdbId`, `title`, `category`, `image`, `rating`, `platforms`) into the `watchlist` database table.
*   **Remove Item (`DELETE /api/watchlist`)**:
    *   Queries and deletes matching items from the `watchlist` database table using the composite criteria of `userId` and `tmdbId`.
*   **Like / Favorite Events (`POST /api/events` - or specific sub-endpoints)**:
    *   Inserts likes or favorites into the `event_likes` and `event_favourites` tables, triggering increment/decrement updates on target event stats.
