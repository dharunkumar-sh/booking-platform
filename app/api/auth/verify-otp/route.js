import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// ---------------------------------------------------------------------------
// Connection — uses env var with hardcoded fallback so it NEVER fails
// ---------------------------------------------------------------------------
const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

// ---------------------------------------------------------------------------
// Shared in-memory OTP store (persists across hot-reloads via global)
// ---------------------------------------------------------------------------
if (!global.otpStore) {
  global.otpStore = new Map();
}

export async function POST(request) {
  try {
    // ── Step 1: Parse & validate body ─────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { email, otp } = body ?? {};

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Both email and OTP are required." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    // ── Step 2: Look up OTP record ─────────────────────────────────────────
    const cacheKey = `otp:email:${emailLower}`;
    const record = global.otpStore?.get(cacheKey);

    if (!record) {
      return NextResponse.json(
        { error: "Verification code has expired or was never sent. Please request a new one." },
        { status: 400 }
      );
    }

    // ── Step 3: Check expiry ───────────────────────────────────────────────
    if (Date.now() > record.expiresAt) {
      global.otpStore.delete(cacheKey);
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // ── Step 4: Validate OTP ───────────────────────────────────────────────
    if (record.otp !== cleanOtp) {
      return NextResponse.json(
        { error: "Incorrect verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // ── Step 5: Consume OTP — prevents replay attacks ─────────────────────
    global.otpStore.delete(cacheKey);
    console.log(`[AUTH] ✅ OTP verified for: ${emailLower}`);

    // ── Step 6: Connect to Neon directly (no drizzle layer) ────────────────
    const sql = neon(DB_URL);

    // ── Step 7: Check if user already exists ──────────────────────────────
    const existing = await sql`
      SELECT id, name, email FROM users WHERE email = ${emailLower} LIMIT 1
    `;

    let user = existing[0];
    let isNewUser = false;

    // ── Step 8: Create user if not found ──────────────────────────────────
    if (!user) {
      const derivedName = emailLower.split("@")[0];
      const inserted = await sql`
        INSERT INTO users (name, email)
        VALUES (${derivedName}, ${emailLower})
        RETURNING id, name, email
      `;
      user = inserted[0];
      isNewUser = true;
      console.log(`[AUTH] 🆕 New user registered: ${emailLower} (id: ${user.id})`);
    } else {
      console.log(`[AUTH] 👤 Existing user signed in: ${emailLower} (id: ${user.id})`);
    }

    // ── Step 9: Return session data ────────────────────────────────────────
    return NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("[AUTH] ❌ verify-otp error:", error.message, error.stack);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
