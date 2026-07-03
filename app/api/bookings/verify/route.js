import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

// GET /api/bookings/verify?eventId=<id>&seats=<comma-separated-seats>
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventIdStr = searchParams.get("eventId");
    const seatsStr = searchParams.get("seats");

    if (!eventIdStr || !seatsStr) {
      return NextResponse.json(
        { error: "eventId and seats are required." },
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

    const requestedSeats = seatsStr.split(",").map((s) => s.trim()).filter(Boolean);
    if (requestedSeats.length === 0) {
      return NextResponse.json(
        { error: "No valid seats provided." },
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

    // Flatten currently booked seats
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
            if (typeof seat === "object") {
              bookedSeatsSet.add(seat.id || seat.label);
            } else {
              bookedSeatsSet.add(seat);
            }
          }
        }
      }
    }

    // Build the status map for each requested seat
    const statusMap = {};
    for (const seat of requestedSeats) {
      statusMap[seat] = bookedSeatsSet.has(seat);
    }

    return NextResponse.json({ success: true, verifiedSeats: statusMap }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/bookings/verify] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify seat status." },
      { status: 500 }
    );
  }
}
