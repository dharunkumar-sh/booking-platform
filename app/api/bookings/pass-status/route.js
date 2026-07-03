import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

// GET /api/bookings/pass-status?eventId=<eventId>
// Computes availability and status for passes based on real-time database bookings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventIdStr = searchParams.get("eventId");

    if (!eventIdStr) {
      return NextResponse.json({ error: "eventId is required." }, { status: 400 });
    }

    const eventId = parseInt(eventIdStr, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: "Invalid eventId." }, { status: 400 });
    }

    const sql = neon(DATABASE_URL);

    // Retrieve the sum of booked seats for the specified event that are not cancelled
    // (and pending bookings must not be older than 10 minutes)
    const dbBookings = await sql`
      SELECT COALESCE(SUM(seats_booked), 0) AS "totalBooked"
      FROM bookings
      WHERE event_id = ${eventId} 
        AND status != 'cancelled'
        AND (status != 'pending' OR booking_date >= NOW() - INTERVAL '10 minutes')
    `;

    const bookedSeatsCount = parseInt(dbBookings[0].totalBooked, 10);

    const getPassStatus = (available, maxCap) => {
      if (available <= 0) return 'Sold Out';
      if (available <= Math.max(5, Math.floor(maxCap * 0.2))) return 'Filling Fast';
      return 'Available';
    };

    const passes = {
      general: {
        availableCount: Math.max(0, 200 - bookedSeatsCount),
        status: getPassStatus(Math.max(0, 200 - bookedSeatsCount), 200)
      },
      silver: {
        availableCount: Math.max(0, 150 - bookedSeatsCount),
        status: getPassStatus(Math.max(0, 150 - bookedSeatsCount), 150)
      },
      gold: {
        availableCount: Math.max(0, 45 - bookedSeatsCount),
        status: getPassStatus(Math.max(0, 45 - bookedSeatsCount), 45)
      },
      vip: {
        availableCount: Math.max(0, 15 - bookedSeatsCount),
        status: getPassStatus(Math.max(0, 15 - bookedSeatsCount), 15)
      }
    };

    return NextResponse.json({ success: true, passes }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/bookings/pass-status] Error:", error);
    return NextResponse.json({ error: "Failed to verify pass status." }, { status: 500 });
  }
}
