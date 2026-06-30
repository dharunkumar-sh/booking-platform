import { NextResponse } from "next/server";

const memoryDb = new Map();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  const value = memoryDb.get(key) || null;
  return NextResponse.json({ data: value });
}

export async function POST(request) {
  try {
    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

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
