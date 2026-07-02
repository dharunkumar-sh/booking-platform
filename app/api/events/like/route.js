import { db } from "@/db/index";
import { events, eventLikes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { eventId, userId } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
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

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // 1. Get likes count by counting records in eventLikes table
    const countRow = await db
      .select({ count: sql`count(*)` })
      .from(eventLikes)
      .where(eq(eventLikes.eventId, Number(eventId)));

    const likesCount = Number(countRow[0]?.count || 0);

    // 2. Check if user has liked
    let hasLiked = false;
    if (userId) {
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
