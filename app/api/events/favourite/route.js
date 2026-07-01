import { db } from "@/db/index";
import { events, eventFavourites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// POST /api/events/favourite — Toggle favourite
export async function POST(request) {
  try {
    const { eventId, userId } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
    }

    // Check if already favourited
    const existing = await db
      .select()
      .from(eventFavourites)
      .where(
        and(
          eq(eventFavourites.eventId, Number(eventId)),
          eq(eventFavourites.userId, Number(userId))
        )
      );

    if (existing.length > 0) {
      // Remove favourite (toggle off)
      await db
        .delete(eventFavourites)
        .where(
          and(
            eq(eventFavourites.eventId, Number(eventId)),
            eq(eventFavourites.userId, Number(userId))
          )
        );
      return NextResponse.json({ success: true, isFavourite: false, message: "Removed from favourites" });
    } else {
      // Add favourite (toggle on)
      await db.insert(eventFavourites).values({
        eventId: Number(eventId),
        userId: Number(userId),
      });
      return NextResponse.json({ success: true, isFavourite: true, message: "Added to favourites" });
    }
  } catch (error) {
    console.error("[POST /api/events/favourite] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/events/favourite — List all favourites for user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch user's favourited events
    const rows = await db
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
        likes: events.likes,
      })
      .from(eventFavourites)
      .innerJoin(events, eq(eventFavourites.eventId, events.id))
      .where(eq(eventFavourites.userId, Number(userId)));

    return NextResponse.json({ success: true, events: rows });
  } catch (error) {
    console.error("[GET /api/events/favourite] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
