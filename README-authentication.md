# 🔐 Authentication Feature

This module provides a secure authentication flow using both **One-Time Passwords (OTP)** via email and **Google OAuth**.

---

## 💻 Frontend Flow

*   **Initialize OAuth Client**: Upon loading the login page, the Google Identity Services client script (`https://accounts.google.com/gsi/client`) is injected and initialized with client credentials.
*   **Request OTP**: The user inputs their email address and clicks **Send OTP**. The frontend dispatches a POST request to `/api/auth/send-otp` with the user's email.
*   **OTP Form Transition**: Once the OTP is successfully sent, the UI displays a 6-digit OTP code grid with auto-focus shifting and a 30-second countdown timer for resending.
*   **Verify OTP**: The user enters the 6-digit code. The frontend sends a POST request to `/api/auth/verify-otp` with the email and verification code.
*   **Google OAuth Access**: The user clicks **Sign in with Google**, opening the Google OAuth dialog. On consent, Google returns an access token which the frontend posts to `/api/auth/google`.
*   **State & Navigation**: Upon successful verification or Google sign-in, the user's details are stored in the global Zustand store (`useBookingStore`) and the user is redirected to the initial page they attempted to access (or `/` by default).

---

## ⚙️ Backend Flow

*   **Send OTP (`/api/auth/send-otp`)**:
    *   Generates a cryptographically secure 6-digit numeric OTP.
    *   Stores the OTP in a shared server-side map (`global.otpStore`) keyed by email, setting an expiration limit of 5 minutes.
    *   Sends a styled responsive HTML email to the user via **Nodemailer** using Gmail SMTP server.
*   **Verify OTP (`/api/auth/verify-otp`)**:
    *   Matches the incoming 6-digit code and email against the active `global.otpStore` records.
    *   Queries the `users` table to see if the user exists. If not, automatically inserts a new record with details (`name`, `email`, `authMethod: 'otp'`).
    *   Deletes the OTP from `global.otpStore` on successful matching to prevent reuse.
    *   Returns the user session metadata (`id`, `name`, `email`, `avatarUrl`) to the client.
*   **Google Auth (`/api/auth/google`)**:
    *   Accepts the OAuth access token and requests the user's profile (`name`, `email`, `picture`) from Google UserInfo API (`https://www.googleapis.com/oauth2/v3/userinfo`).
    *   Validates the identity and upserts the user in the database `users` table.
    *   Returns the verified user object back to the client.
