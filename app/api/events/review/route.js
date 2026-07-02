import { db } from "@/db/index";
import { events, users, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/events/review?eventId=<eventId>
// Fetch reviews for a specific event from the dedicated reviews DB table
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const dbReviews = await db
      .select({
        id: reviews.id,
        name: reviews.name,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(eq(reviews.eventId, Number(eventId)))
      .orderBy(reviews.createdAt);

    return NextResponse.json({ success: true, reviews: dbReviews });
  } catch (error) {
    console.error("[GET /api/events/review] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/events/review
// Add a review to an event in the dedicated reviews DB table
export async function POST(request) {
  try {
    const { eventId, userId, rating, comment } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Authentication required to leave a review." }, { status: 401 });
    }
    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5 stars" }, { status: 400 });
    }
    if (!comment?.trim()) {
      return NextResponse.json({ error: "Review comment cannot be empty" }, { status: 400 });
    }

    // 1. Verify user is authenticated and exists in users table
    const userRow = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (userRow.length === 0) {
      return NextResponse.json({ error: "User is unauthenticated/not found" }, { status: 401 });
    }

    const user = userRow[0];

    // 2. Verify event exists
    const eventRow = await db
      .select()
      .from(events)
      .where(eq(events.id, Number(eventId)))
      .limit(1);

    if (eventRow.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 3. Insert review into the reviews table
    await db.insert(reviews).values({
      eventId: Number(eventId),
      userId: Number(userId),
      name: user.name || user.email.split("@")[0],
      rating: Number(rating),
      comment: comment.trim(),
    });

    // 4. Fetch the updated list of reviews
    const dbReviews = await db
      .select({
        id: reviews.id,
        name: reviews.name,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(eq(reviews.eventId, Number(eventId)))
      .orderBy(reviews.createdAt);

    return NextResponse.json({
      success: true,
      message: "Review added successfully",
      reviews: dbReviews,
    });
  } catch (error) {
    console.error("[POST /api/events/review] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
