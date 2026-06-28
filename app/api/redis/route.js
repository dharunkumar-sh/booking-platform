import { createClient } from "redis";
import { NextResponse } from "next/server";

// Keep a server-side in-memory map as fallback if Redis is unavailable
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
    const client = createClient({
      url: process.env.REDIS_URL || "redis://default:A46s14rreowlwx3eh3u1ldr9ovpwegl729pc8gez5nsl9tlt7q7@127.0.0.1:6379",
    });
    client.on("error", (err) => {
      console.warn("Redis client connection error, using fallback in-memory DB:", err.message);
      isRedisConnected = false;
    });
    
    // Connect with a 1.5s timeout race to avoid blocking thread on offline instance
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout")), 1500)
    );
    await Promise.race([connectPromise, timeoutPromise]);

    redisClient = client;
    isRedisConnected = true;
    console.log("Connected to Redis successfully.");
    return redisClient;
  } catch (error) {
    console.warn("Could not instantiate Redis client, using fallback in-memory DB:", error.message);
    redisClient = null;
    isRedisConnected = false;
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  try {
    const client = await getRedisClient();
    if (client && isRedisConnected) {
      const data = await client.get(key);
      return NextResponse.json({ data: data ? JSON.parse(data) : null });
    }
  } catch (error) {
    console.warn("Error getting key from Redis, using fallback memoryDb:", error.message);
  }

  // Fallback to memoryDb
  const value = memoryDb.get(key) || null;
  return NextResponse.json({ data: value });
}

export async function POST(request) {
  try {
    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    try {
      const client = await getRedisClient();
      if (client && isRedisConnected) {
        if (value === null || value === undefined) {
          await client.del(key);
        } else {
          await client.set(key, JSON.stringify(value));
        }
      }
    } catch (error) {
      console.warn("Error setting/deleting key in Redis, using fallback memoryDb:", error.message);
    }

    // Always keep memoryDb sync'd as fallback
    if (value === null || value === undefined) {
      memoryDb.delete(key);
    } else {
      memoryDb.set(key, value);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
