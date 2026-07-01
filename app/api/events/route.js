import { db } from "@/db/index";
import { events } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * GET /api/events
 *
 * Query params:
 *   type     — "featured" | "trending"   (optional)
 *   category — e.g. "music" | "comedy"   (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || null;
    const category = searchParams.get("category") || null;
    const id = searchParams.get("id") || null;
    const title = searchParams.get("title") || null;

    // Build filter conditions
    const conditions = [];
    if (type) conditions.push(eq(events.type, type));
    if (category) conditions.push(eq(events.category, category));
    if (id) conditions.push(eq(events.id, parseInt(id, 10)));
    if (title) conditions.push(ilike(events.title, title));

    const rows =
      conditions.length > 0
        ? await db
            .select()
            .from(events)
            .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        : await db.select().from(events);

    return NextResponse.json({ success: true, events: rows });
  } catch (error) {
    console.error("[/api/events] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
