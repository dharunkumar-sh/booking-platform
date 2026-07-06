# 📅 User Bookings Dashboard Feature

This module provides users with a comprehensive view of their active and historical bookings, including receipts, seat allocations, and shareable booking passes.

---

## 💻 Frontend Flow

*   **Load Dashboard**: Mounts `/bookings` which checks user authentication and retrieves confirmed bookings.
*   **Merge State**: Combines offline/local bookings from the client's store (`useBookingStore.confirmedBookings`) with remote data retrieved from the database to ensure synchronization.
*   **Filter & Search**: Users can type keywords (event name, location) to filter booking records dynamically.
*   **Ticket View & Interaction**: Selecting a booking displays a detailed digital pass, complete with a dynamically generated barcode/QR code, seat tags, venue coordinates, and pricing breakdown.
*   **Actions**:
    *   **Print**: Standard print views are formatted for paper tickets.
    *   **Download / Save**: Simulates saving the offline ticket package.

---

## ⚙️ Backend Flow

*   **Retrieve User Bookings (`GET /api/bookings?email=...`)**:
    *   Performs a SQL join across the `bookings`, `users`, `events`, and `userform` tables matching the provided email.
    *   Filters out rows with `status: 'cancelled'` and pending holds that are older than 10 minutes.
    *   Standardizes row returns into objects containing booking IDs, audi numbers, pricing details, and lists of seat objects.
    *   Sorts bookings by purchase date in descending order to prioritize recent bookings.
