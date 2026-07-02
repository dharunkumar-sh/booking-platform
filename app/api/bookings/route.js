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

    if (!eventIdStr) {
      return NextResponse.json(
        { error: "eventId is required." },
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
    const dbBookings = await sql`
      SELECT seats FROM bookings
      WHERE event_id = ${eventId} AND status != 'cancelled'
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
    const { email, name, phone, eventId, seats, totalPrice, bookingStartedAt } = body;

    if (!email || !eventId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { error: "Email, eventId, and seats are required." },
        { status: 400 }
      );
    }

    // Secure backend timer verification
    if (!bookingStartedAt) {
      return NextResponse.json(
        { error: "Booking session timestamp is missing." },
        { status: 400 }
      );
    }

    const startTime = parseInt(bookingStartedAt, 10);
    if (isNaN(startTime) || (Date.now() - startTime) > 10 * 60 * 1000) {
      return NextResponse.json(
        { error: "Your 10-minute booking session has expired. Please select seats again." },
        { status: 410 } // 410 Gone / Expired
      );
    }

    const sql = neon(DATABASE_URL);

    // 1. Find user in users table to enforce authentication
    const emailLower = email.toLowerCase().trim();
    let existingUser = await sql`
      SELECT id FROM users WHERE email = ${emailLower} LIMIT 1
    `;

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "Authentication required to book tickets. Please log in first." },
        { status: 401 }
      );
    }
    const userId = existingUser[0].id;

    // 2. Perform duplicate booking check
    const dbBookings = await sql`
      SELECT seats FROM bookings
      WHERE event_id = ${parseInt(eventId, 10)} AND status != 'cancelled'
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

    // 3. Insert booking record into bookings table
    const result = await sql`
      INSERT INTO bookings (user_id, event_id, seats_booked, total_price, status, seats)
      VALUES (
        ${userId},
        ${parseInt(eventId, 10)},
        ${seats.length},
        ${parseInt(totalPrice, 10) || 0},
        'confirmed',
        ${JSON.stringify(seats)}
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
