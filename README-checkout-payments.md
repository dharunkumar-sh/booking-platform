# 💳 Checkout & Payment Processing Feature

This module manages the payment form, Stripe payment intent creation, validation checks, and the transitions into a successful booking confirmation.

---

## 💻 Frontend Flow

*   **Render Invoice Summary**: Displays selected seats, pricing calculations (base cost, 18% GST, convenience fees), and the overall final sum.
*   **Establish Stripe Context**: Wraps the checkout form with Stripe Elements initialized via the public publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
*   **Payment Form Input**:
    *   **Card**: Captures sensitive details securely using Stripe's `CardElement`.
    *   **UPI / Netbanking**: Displays simulators with responsive UI and QR codes/bank list selectors.
*   **Create Payment Intent**: Calls `/api/payment/create-intent` sending the final order amount and the corresponding `bookingId`.
*   **Confirm Stripe Payment**: Executes `stripe.confirmCardPayment` utilizing the returned `clientSecret`.
*   **Update Database to Confirmed**: On successful payment, the frontend triggers a POST request to `/api/bookings` with `status: 'confirmed'`, the transaction metadata, and the booking details.
*   **Route to Confirmation**: Redirects user to `/confirmation` with booking details stored in the Zustand store.

---

## ⚙️ Backend Flow

*   **Create Stripe Intent (`POST /api/payment/create-intent`)**:
    *   Initializes the Stripe SDK using the server-side environment variable `STRIPE_SECRET_KEY`.
    *   Converts the transaction amount into the currency's smallest unit (e.g., paise for INR: amount * 100).
    *   Invokes `stripe.paymentIntents.create` with metadata containing the custom booking ID.
    *   Returns the `clientSecret` and `paymentIntentId` to the client.
*   **Confirm Booking Status (`POST /api/bookings`)**:
    *   Locates the pre-existing pending booking ID in the `bookings` table.
    *   Performs an `UPDATE` query altering the status from `'pending'` to `'confirmed'`.
    *   Binds the finalized `payment_method` (e.g. `'card'`, `'upi'`) to the table row and returns success.
