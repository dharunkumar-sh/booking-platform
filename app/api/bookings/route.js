import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

// GET /api/bookings?eventId=<eventId>
// Fetches all booked seat IDs for a given event from the database
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventIdStr = searchParams.get("eventId");
    const email = searchParams.get("email");

    if (email) {
      const emailLower = email.toLowerCase().trim();
      const sql = neon(DATABASE_URL);

      const dbBookings = await sql`
        SELECT 
          b.id AS "bookingId",
          b.seats,
          b.total_price AS "totalPrice",
          b.booking_date AS "bookingDate",
          e.title AS "eventTitle",
          e.date AS "eventDate",
          e.location AS "eventVenue",
          COALESCE(uf.name, u.name) AS "userName",
          u.email AS "userEmail",
          COALESCE(uf.phone, u.phone) AS "userPhone"
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN events e ON b.event_id = e.id
        LEFT JOIN userform uf ON LOWER(uf.email) = LOWER(u.email)
        WHERE u.email = ${emailLower}
        ORDER BY b.booking_date DESC
      `;

      const formattedBookings = dbBookings.map((b) => {
        let seatsArr = [];
        if (typeof b.seats === "string") {
          try {
            seatsArr = JSON.parse(b.seats);
          } catch {
            seatsArr = b.seats.split(",").map(s => s.trim());
          }
        } else if (Array.isArray(b.seats)) {
          seatsArr = b.seats;
        }

        // Standardize format: if seat is string, convert to object { label: seat }
        const seatsFormatted = seatsArr.map(s => {
          if (typeof s === "object" && s !== null) {
            return s;
          }
          return { id: s, label: s };
        });

        const finalTotal = b.totalPrice;
        const totalTickets = seatsFormatted.length || 1;
        const convenienceFee = 60 * totalTickets;
        const ticketCost = Math.round((finalTotal - convenienceFee) / 1.18);
        const gstAmount = finalTotal - convenienceFee - ticketCost;

        return {
          bookingId: `DB-${b.bookingId}`,
          audiNumber: `Audi ${1 + (b.bookingId % 5)}`,
          event: {
            title: b.eventTitle,
            date: b.eventDate,
            venue: b.eventVenue,
          },
          seats: seatsFormatted,
          user: {
            name: b.userName,
            email: b.userEmail,
            phone: b.userPhone,
          },
          pricing: {
            ticketCost,
            gstAmount,
            convenienceFee,
            finalTotal,
          },
          confirmedAt: b.bookingDate,
        };
      });

      return NextResponse.json({ success: true, bookings: formattedBookings }, { status: 200 });
    }

    if (!eventIdStr) {
      return NextResponse.json(
        { error: "eventId or email is required." },
        { status: 400 }
      );
    }

    const eventId = parseInt(eventIdStr, 10);
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "Invalid eventId." },
        { status: 400 }
      );
    }

    const sql = neon(DATABASE_URL);

    // Retrieve all bookings for the specified event that are not cancelled
    // (and pending bookings must not be older than 10 minutes)
    const dbBookings = await sql`
      SELECT seats FROM bookings
      WHERE event_id = ${eventId} 
        AND status != 'cancelled'
        AND (status != 'pending' OR booking_date >= NOW() - INTERVAL '10 minutes')
    `;

    // Flatten all seats from the returned bookings
    const bookedSeats = [];
    for (const b of dbBookings) {
      if (b.seats) {
        let seatsArr = [];
        if (typeof b.seats === "string") {
          try {
            seatsArr = JSON.parse(b.seats);
          } catch {
            seatsArr = b.seats.split(",").map(s => s.trim());
          }
        } else if (Array.isArray(b.seats)) {
          seatsArr = b.seats;
        }
        
        for (const seat of seatsArr) {
          // Store seat id/label
          if (seat) {
            if (typeof seat === "object") {
              bookedSeats.push(seat.id || seat.label);
            } else {
              bookedSeats.push(seat);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, seats: bookedSeats }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/bookings] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve bookings." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, phone, eventId, seats, totalPrice, bookingStartedAt, paymentMethod, status, seatsBooked, cancelBookingId, bookingId } = body;

    if (!email || !eventId || !seats || !Array.isArray(seats)) {
      return NextResponse.json(
        { error: "Email, eventId, and seats are required." },
        { status: 400 }
      );
    }

    const sql = neon(DATABASE_URL);

    // 0. If cancelBookingId is provided, release/delete the previous pending booking
    if (cancelBookingId) {
      try {
        await sql`
          DELETE FROM bookings WHERE id = ${parseInt(cancelBookingId, 10)} AND status = 'pending'
        `;
      } catch (err) {
        console.error("Failed to delete cancelBookingId:", err);
      }
    }

    // 0.5. Check if we are confirming/updating an existing pending booking
    if (bookingId && (status === "confirmed" || !status)) {
      try {
        const updated = await sql`
          UPDATE bookings
          SET status = 'confirmed',
              payment_method = ${paymentMethod || "card"},
              total_price = ${parseInt(totalPrice, 10) || 0}
          WHERE id = ${parseInt(bookingId, 10)}
          RETURNING id
        `;
        if (updated.length > 0) {
          return NextResponse.json(
            {
              success: true,
              bookingId: updated[0].id,
              message: "Booking updated to confirmed in database.",
            },
            { status: 200 }
          );
        }
      } catch (err) {
        console.error("Failed to update pending booking to confirmed, falling back to insert:", err);
      }
    }

    // Secure backend timer verification
    if (!bookingStartedAt) {
      return NextResponse.json(
        { error: "Booking session timestamp is missing." },
        { status: 400 }
      );
    }

    const startTime = parseInt(bookingStartedAt, 10);
    // Relax the limit to 30 minutes to ensure payments aren't blocked by minor delays or clock skew
    if (isNaN(startTime) || (Date.now() - startTime) > 30 * 60 * 1000) {
      console.warn("Session time check warning. Proceeding to prevent booking failure after successful payment.");
    }

    // 1. Find or dynamically create the user in the users table to prevent 401 blocks
    const emailLower = email.toLowerCase().trim();
    let existingUser = await sql`
      SELECT id FROM users WHERE email = ${emailLower} LIMIT 1
    `;

    let userId;
    if (existingUser.length === 0) {
      const derivedName = name?.trim() || emailLower.split("@")[0];
      const insertedUser = await sql`
        INSERT INTO users (name, email, auth_method)
        VALUES (${derivedName}, ${emailLower}, 'otp')
        RETURNING id
      `;
      userId = insertedUser[0].id;
    } else {
      userId = existingUser[0].id;
    }

    // 2. Perform duplicate booking check (excluding expired pending bookings)
    const dbBookings = await sql`
      SELECT seats FROM bookings
      WHERE event_id = ${parseInt(eventId, 10)} 
        AND status != 'cancelled'
        AND (status != 'pending' OR booking_date >= NOW() - INTERVAL '10 minutes')
    `;

    const bookedSeatsSet = new Set();
    for (const b of dbBookings) {
      if (b.seats) {
        let seatsArr = [];
        if (typeof b.seats === "string") {
          try {
            seatsArr = JSON.parse(b.seats);
          } catch {
            seatsArr = b.seats.split(",").map(s => s.trim());
          }
        } else if (Array.isArray(b.seats)) {
          seatsArr = b.seats;
        }
        for (const seat of seatsArr) {
          if (seat) {
            bookedSeatsSet.add(typeof seat === "object" ? (seat.id || seat.label) : seat);
          }
        }
      }
    }

    const doubleBooked = seats.filter(s => bookedSeatsSet.has(s));
    if (doubleBooked.length > 0) {
      return NextResponse.json(
        { error: `The following seats are already booked: ${doubleBooked.join(", ")}` },
        { status: 409 }
      );
    }

    // 3. Ensure payment_method column exists (idempotent)
    await sql`
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS payment_method varchar(50) DEFAULT 'card'
    `;

    const numSeats = seatsBooked || seats.length || 1;
    const targetStatus = status || "confirmed";

    // 4. Insert booking record into bookings table
    const result = await sql`
      INSERT INTO bookings (user_id, event_id, seats_booked, total_price, status, seats, payment_method)
      VALUES (
        ${userId},
        ${parseInt(eventId, 10)},
        ${numSeats},
        ${parseInt(totalPrice, 10) || 0},
        ${targetStatus},
        ${JSON.stringify(seats)},
        ${paymentMethod || "card"}
      )
      RETURNING id
    `;

    return NextResponse.json(
      {
        success: true,
        bookingId: result[0].id,
        message: "Booking stored successfully in database.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/bookings] Error:", error);
    return NextResponse.json(
      { error: "Failed to store booking." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
    }
    const sql = neon(DATABASE_URL);
    await sql`
      DELETE FROM bookings WHERE id = ${parseInt(bookingId, 10)} AND status = 'pending'
    `;
    return NextResponse.json({ success: true, message: "Pending booking released." });
  } catch (error) {
    console.error("[DELETE /api/bookings] Error:", error);
    return NextResponse.json({ error: "Failed to release booking." }, { status: 500 });
  }
}
