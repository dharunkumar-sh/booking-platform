# 💺 Seat Selection & Reservation Timer Feature

This module handles interactive seat selection, ticket category allocation, and a secure seat-holding mechanism using a countdown timer.

---

## 💻 Frontend Flow

*   **Initialize Selection**: Based on the route param (event name/ID) and URL query params, details are extracted. Non-logged-in users are redirected to login.
*   **Determine Venue Seat Map**: Checks the event category and location. If the venue is a club or open concert, it defaults to standing/general admission ticket selection. If it's an arena/stadium, it shows the interactive seat map layout.
*   **Select Seats**: Users click on virtual seats (categorized into VIP, Premium, Classic/Standard zones).
*   **Initiate Hold Timer**: Once seats are confirmed, the frontend triggers `store.setBookingStartedAt(Date.now().toString())` to begin the 10-minute hold countdown.
*   **Call Hold API**: A POST request is dispatched to `/api/bookings` with `status: 'pending'` to temporarily lock these seats in the database.
*   **Time-out Resolution**: If the 10-minute timer (`components/BookingTimer.jsx`) runs out, the frontend triggers a DELETE request to `/api/bookings` to release the seats in the database, clears the booking state, and prompts the user to start over.

---

## ⚙️ Backend Flow

*   **Hold / Store Pending Seats (`POST /api/bookings`)**:
    *   Finds or creates a database user dynamically to prevent unauthorized checkout blocks.
    *   Pulls current active bookings for the specified event (filtering out cancelled bookings and pending bookings older than 10 minutes).
    *   Checks for overlaps (double-booking protection). If any selected seat is already occupied or held, it returns a `409 Conflict` error.
    *   Inserts a new row in the `bookings` table with `status: 'pending'`, storing seat identifiers as a JSON array (`seats`).
*   **Release Seats (`DELETE /api/bookings`)**:
    *   Receives `bookingId` and deletes the matching pending seat hold from the database.
    *   Ensures that only bookings with a `status: 'pending'` can be deleted via this flow.
