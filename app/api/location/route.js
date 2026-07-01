import { NextResponse } from "next/server";

const memoryDb = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude, accuracy, timestamp, sessionId, city, region, country } = body;

    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Missing required fields: latitude and longitude" },
        { status: 400 }
      );
    }

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
    const value = memoryDb.get(key) ?? null;
    return NextResponse.json({ data: value });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
