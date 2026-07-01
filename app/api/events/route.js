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
 *   state    — e.g. "Tamil Nadu"          (optional, case-insensitive substring match on location)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type     = searchParams.get("type")     || null;
    const category = searchParams.get("category") || null;
    const state    = searchParams.get("state")    || null;

    // Build filter conditions
    const conditions = [];
    if (type)     conditions.push(eq(events.type, type));
    if (category) conditions.push(eq(events.category, category));
    if (state)    conditions.push(ilike(events.location, `%${state}%`));

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
