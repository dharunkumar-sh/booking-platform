import { NextResponse } from "next/server";

// Re-use the same Redis/memoryDb pattern as existing /api/redis route
const memoryDb = new Map();
let redisClient = null;
let isRedisConnected = false;
let hasAttemptedConnection = false;

async function getRedisClient() {
  if (hasAttemptedConnection) {
    return isRedisConnected ? redisClient : null;
  }
  hasAttemptedConnection = true;
  try {
    const { createClient } = await import("redis");
    const client = createClient({
      url: process.env.REDIS_URL || "redis://default:A46s14rreowlwx3eh3u1ldr9ovpwegl729pc8gez5nsl9tlt7q7@127.0.0.1:6379",
    });
    client.on("error", () => { isRedisConnected = false; });
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout")), 1500)
    );
    await Promise.race([connectPromise, timeoutPromise]);
    redisClient = client;
    isRedisConnected = true;
    return redisClient;
  } catch {
    redisClient = null;
    isRedisConnected = false;
    return null;
  }
}

/**
 * POST /api/location
 * Body: { latitude, longitude, accuracy, timestamp, sessionId, city?, region?, country? }
 *
 * Stores geolocation data keyed by sessionId.
 * Returns: { success: true, message: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude, accuracy, timestamp, sessionId, city, region, country } = body;

    // Validate required fields
    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Missing required fields: latitude and longitude" },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates: latitude must be -90..90, longitude -180..180" },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid sessionId" },
        { status: 400 }
      );
    }

    const locationRecord = {
      latitude,
      longitude,
      accuracy: accuracy ?? null,
      timestamp: timestamp ?? Date.now(),
      city: city ?? null,
      region: region ?? null,
      country: country ?? null,
      savedAt: Date.now(),
    };

    const key = `location:${sessionId}`;

    // Try Redis first, fall back to in-memory
    try {
      const client = await getRedisClient();
      if (client && isRedisConnected) {
        await client.set(key, JSON.stringify(locationRecord), { EX: 86400 }); // 24h TTL
      }
    } catch (redisErr) {
      console.warn("Redis location save failed, using memoryDb:", redisErr.message);
    }

    // Always sync memoryDb as fallback
    memoryDb.set(key, locationRecord);

    return NextResponse.json({
      success: true,
      message: "Location saved successfully",
      city: city ?? null,
    });
  } catch (err) {
    console.error("Location API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/location?sessionId=xxx
 * Retrieve saved location for a session.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId parameter" },
        { status: 400 }
      );
    }

    const key = `location:${sessionId}`;

    try {
      const client = await getRedisClient();
      if (client && isRedisConnected) {
        const data = await client.get(key);
        if (data) {
          return NextResponse.json({ data: JSON.parse(data) });
        }
      }
    } catch {
      // Fall through to memoryDb
    }

    const value = memoryDb.get(key) ?? null;
    return NextResponse.json({ data: value });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
