import { db } from "@/db/index";
import { events, eventLikes, users } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { emitReliableEvent } from "@/lib/kafka/outbox";
import { EVENT_TYPES } from "@/lib/kafka/events";

export async function POST(request) {
  try {
    const { eventId, userId } = await request.json();
    if (!eventId || isNaN(Number(eventId))) {
      return NextResponse.json({ error: "Valid Event ID is required" }, { status: 400 });
    }
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "Valid User ID is required" }, { status: 401 });
    }

    // Verify user and event exist to avoid foreign key violations (e.g. on database reseed)
    const userExists = await db.select().from(users).where(eq(users.id, Number(userId)));
    if (userExists.length === 0) {
      return NextResponse.json({ error: "User session is invalid. Please sign out and sign in again.", invalidSession: true }, { status: 400 });
    }

    const eventExists = await db.select().from(events).where(eq(events.id, Number(eventId)));
    if (eventExists.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 400 });
    }

    // Check if the user has already liked this event
    const existing = await db
      .select()
      .from(eventLikes)
      .where(
        and(
          eq(eventLikes.eventId, Number(eventId)),
          eq(eventLikes.userId, Number(userId))
        )
      );


    if (existing.length > 0) {
      // User has already liked, so UNLIKE it
      await db.delete(eventLikes)
        .where(
          and(
            eq(eventLikes.eventId, Number(eventId)),
            eq(eventLikes.userId, Number(userId))
          )
        );

      // Get updated count
      const countRow = await db
        .select({ count: sql`count(*)` })
        .from(eventLikes)
        .where(eq(eventLikes.eventId, Number(eventId)));

      const likesCount = Number(countRow[0]?.count || 0);

      // Sync the events table likes column
      await db.update(events)
        .set({ likes: likesCount })
        .where(eq(events.id, Number(eventId)));

      // Emit Kafka event
      try {
        await emitReliableEvent({
          eventType: EVENT_TYPES.EVENT_UNLIKED,
          entityId: eventId,
          payload: {
            eventId: Number(eventId),
            userId: Number(userId),
            likesCount,
            unlikedAt: new Date().toISOString(),
          },
          idempotencyKey: `event-unliked-${eventId}-${userId}-${Date.now()}`,
          immediateDispatch: true,
        });
      } catch (kErr) {
        console.error("Kafka emission error for unlike:", kErr);
      }

      return NextResponse.json({
        success: true,
        message: "Unliked successfully",
        likes: likesCount,
        hasLiked: false
      });
    }

    // Record the like
    await db.insert(eventLikes).values({
      eventId: Number(eventId),
      userId: Number(userId),
    });

    // Get the updated count
    const countRow = await db
      .select({ count: sql`count(*)` })
      .from(eventLikes)
      .where(eq(eventLikes.eventId, Number(eventId)));

    const likesCount = Number(countRow[0]?.count || 0);

    // Sync the events table likes column
    await db.update(events)
      .set({ likes: likesCount })
      .where(eq(events.id, Number(eventId)));

    // Emit Kafka event
    try {
      await emitReliableEvent({
        eventType: EVENT_TYPES.EVENT_LIKED,
        entityId: eventId,
        payload: {
          eventId: Number(eventId),
          userId: Number(userId),
          likesCount,
          likedAt: new Date().toISOString(),
        },
        idempotencyKey: `event-liked-${eventId}-${userId}-${Date.now()}`,
        immediateDispatch: true,
      });
    } catch (kErr) {
      console.error("Kafka emission error for like:", kErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Liked successfully", 
      likes: likesCount,
      hasLiked: true
    });
  } catch (error) {
    console.error("[POST /api/events/like] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/events/like — Get dynamic likes count and user liked status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!eventId || isNaN(Number(eventId))) {
      return NextResponse.json({ error: "Valid Event ID is required" }, { status: 400 });
    }

    // 1. Get likes count by counting records in eventLikes table
    const countRow = await db
      .select({ count: sql`count(*)` })
      .from(eventLikes)
      .where(eq(eventLikes.eventId, Number(eventId)));

    const likesCount = Number(countRow[0]?.count || 0);

    // 2. Check if user has liked
    let hasLiked = false;
    if (userId && !isNaN(Number(userId))) {
      const existing = await db
        .select()
        .from(eventLikes)
        .where(
          and(
            eq(eventLikes.eventId, Number(eventId)),
            eq(eventLikes.userId, Number(userId))
          )
        );
      hasLiked = existing.length > 0;
    }

    return NextResponse.json({
      success: true,
      likes: likesCount,
      hasLiked
    });
  } catch (error) {
    console.error("[GET /api/events/like] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
