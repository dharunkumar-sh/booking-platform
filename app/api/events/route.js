import { db } from "@/db/index";
import { events, eventLikes } from "@/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * GET /api/events
 *
 * Query params:
 *   type     — "featured" | "trending"   (optional)
 *   category — e.g. "music" | "comedy"   (optional)
 *   state    — e.g. "Tamil Nadu"          (optional, case-insensitive substring match on location)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type     = searchParams.get("type")     || null;
    const category = searchParams.get("category") || null;
    const state    = searchParams.get("state")    || null;

    // Build query using leftJoin and groupBy to calculate likes count dynamically
    const query = db
      .select({
        id: events.id,
        title: events.title,
        type: events.type,
        category: events.category,
        description: events.description,
        image: events.image,
        location: events.location,
        latitude: events.latitude,
        longitude: events.longitude,
        price: events.price,
        date: events.date,
        time: events.time,
        rating: events.rating,
        organizer: events.organizer,
        features: events.features,
        crew: events.crew,
        reviews: events.reviews,
        likes: sql`count(${eventLikes.id})`.mapWith(Number),
        createdAt: events.createdAt,
      })
      .from(events)
      .leftJoin(eventLikes, eq(events.id, eventLikes.eventId))
      .groupBy(events.id);

    const whereConditions = [];
    if (type)     whereConditions.push(eq(events.type, type));
    if (category) whereConditions.push(ilike(events.category, category));
    if (state)    whereConditions.push(ilike(events.location, `%${state}%`));

    if (whereConditions.length > 0) {
      query.where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions));
    }

    if (type === "trending") {
      query.having(sql`count(${eventLikes.id}) > 5`);
    }

    const rows = await query;

    return NextResponse.json({ success: true, events: rows });
  } catch (error) {
    console.error("[/api/events] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
