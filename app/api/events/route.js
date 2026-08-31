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
    if (type && type !== "trending") whereConditions.push(eq(events.type, type));
    if (category) whereConditions.push(ilike(events.category, category));
    if (state)    whereConditions.push(ilike(events.location, `%${state}%`));

    if (whereConditions.length > 0) {
      query.where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions));
    }

    if (type === "trending") {
      query.having(sql`count(${eventLikes.id}) >= 5`);
      query.orderBy(sql`count(${eventLikes.id}) DESC`);
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

/**
 * POST /api/events
 * Creates a new event and publishes an EVENT_CREATED message to Kafka via Outbox.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      type = "featured",
      category,
      description,
      image,
      location,
      latitude,
      longitude,
      price,
      date,
      time,
      rating,
      organizer,
      features = [],
      crew = [],
      reviews = [],
    } = body;

    if (!title || !location || price === undefined || !date) {
      return NextResponse.json(
        { success: false, error: "Title, location, price, and date are required." },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(events)
      .values({
        title,
        type,
        category,
        description,
        image,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        price: parseInt(price, 10),
        date: new Date(date),
        time,
        rating: rating || "4.5",
        organizer,
        features,
        crew,
        reviews,
        likes: 0,
      })
      .returning();

    const createdEvent = inserted[0];

    // Emit Kafka Outbox Event
    const { emitReliableEvent } = await import("@/lib/kafka/outbox");
    const { EVENT_TYPES } = await import("@/lib/kafka/events");

    try {
      await emitReliableEvent({
        eventType: EVENT_TYPES.EVENT_CREATED,
        entityId: createdEvent.id,
        payload: createdEvent,
        idempotencyKey: `event-created-${createdEvent.id}`,
        immediateDispatch: true,
      });
    } catch (kErr) {
      console.error("Kafka emission error for event create:", kErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully.",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/events] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
