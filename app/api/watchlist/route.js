import { db } from "@/db/index";
import { users, watchlist } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ success: true, watchlist: [] });
    }

    const userId = user[0].id;
    const items = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.userId, userId))
      .orderBy(watchlist.createdAt);

    // Format fields for frontend consistency
    const formattedItems = items.map((item) => ({
      id: item.tmdbId, // Client side maps id to TMDB ID
      dbId: item.id,
      title: item.title,
      category: item.category,
      image: item.image,
      rating: item.rating,
      releaseDate: item.releaseDate,
      platforms: item.platforms || [],
    }));

    return NextResponse.json({ success: true, watchlist: formattedItems });
  } catch (error) {
    console.error("[api/watchlist] GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, tmdbId, title, category, image, rating, releaseDate, platforms } = body;

    if (!email || !tmdbId || !title || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const userId = user[0].id;

    // Check if duplicate exists
    const existing = await db
      .select()
      .from(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, String(tmdbId))))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: "Item already in watchlist.", item: existing[0] });
    }

    // Insert new item
    const inserted = await db
      .insert(watchlist)
      .values({
        userId,
        tmdbId: String(tmdbId),
        title,
        category,
        image,
        rating: String(rating || ""),
        releaseDate: String(releaseDate || ""),
        platforms: platforms || [],
      })
      .returning();

    return NextResponse.json({ success: true, message: "Added to watchlist.", item: inserted[0] });
  } catch (error) {
    console.error("[api/watchlist] POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim();
    const tmdbId = (searchParams.get("tmdbId") || "").trim();

    if (!email || !tmdbId) {
      return NextResponse.json({ success: false, error: "Email and tmdbId are required." }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const userId = user[0].id;

    // Delete item
    await db
      .delete(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, String(tmdbId))));

    return NextResponse.json({ success: true, message: "Removed from watchlist." });
  } catch (error) {
    console.error("[api/watchlist] DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
