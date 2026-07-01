import { db } from "@/db/index";
import { events } from "@/db/schema";
import { or, like, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * GET /api/events/search
 *
 * Dedicated hero search / autocomplete endpoint.
 *
 * Query params:
 *   q      — search term (required)
 *   limit  — max results to return (default 6)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10), 20);

    if (!q) {
      return NextResponse.json({ success: true, results: [] });
    }

    const pattern = `%${q}%`;

    const rows = await db
      .select({
        id: events.id,
        title: events.title,
        category: events.category,
        location: events.location,
        date: events.date,
        time: events.time,
        image: events.image,
        price: events.price,
        rating: events.rating,
        organizer: events.organizer,
        description: events.description,
        features: events.features,
        crew: events.crew,
        reviews: events.reviews,
        type: events.type,
      })
      .from(events)
      .where(
        or(
          like(sql`LOWER(${events.title})`, `%${q.toLowerCase()}%`),
          like(sql`LOWER(${events.category})`, `%${q.toLowerCase()}%`),
          like(sql`LOWER(${events.location})`, `%${q.toLowerCase()}%`),
          like(sql`LOWER(${events.organizer})`, `%${q.toLowerCase()}%`),
          like(sql`LOWER(${events.description})`, `%${q.toLowerCase()}%`)
        )
      )
      .limit(limit);

    return NextResponse.json({ success: true, results: rows });
  } catch (error) {
    console.error("[/api/events/search] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
