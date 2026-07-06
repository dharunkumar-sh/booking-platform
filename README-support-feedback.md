# 🤝 Support & User Feedback Feature

This module provides users with contact forms, support ticket submission, and helper links to resolve cancellations, refunds, payments, and safety queries.

---

## 💻 Frontend Flow

*   **Access Support Center**: Users navigate to `/support` where help categories (cancellations, refunds, payments, safety) are listed.
*   **Fill Support / Contact Form**: Users fill in the contact form inputs: `name`, `email`, and optionally `phone`.
*   **Submit Form**: Clicking submit triggers a POST request to `/api/user-form` sending user parameters.
*   **Form Response**: Displays a visual confirmation dialog upon successful submission and persists the user session details to expedite checkout steps.

---

## ⚙️ Backend Flow

*   **Store Support Details (`POST /api/user-form`)**:
    *   Validates the incoming `name` and `email` input fields.
    *   Checks if the target database table `userform` is initialized (running a safe helper migrations script if needed).
    *   Inserts the record (`name`, `email`, and `phone`) into the `userform` table to track customer inquiries.
    *   Returns the created row ID and details back to the client.
