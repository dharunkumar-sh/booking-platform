import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required." },
        { status: 400 }
      );
    }

    // ── Step 1: Fetch user info from Google API ────────────────────────────
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AUTH-GOOGLE] Failed to fetch Google userinfo:", errText);
      return NextResponse.json(
        { error: "Invalid Google access token or session expired." },
        { status: 400 }
      );
    }

    const userInfo = await response.json();
    const { email, name, picture } = userInfo;

    if (!email) {
      return NextResponse.json(
        { error: "Email address not found in Google account profile info." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // ── Step 2: Query database with raw Neon SQL ───────────────────────────
    const sql = neon(DB_URL);
    const existing = await sql`
      SELECT id, name, email, auth_method, avatar_url FROM users WHERE email = ${emailLower} LIMIT 1
    `;

    let user = existing[0];
    let isNewUser = false;

    // ── Step 3: Register or update user in DB ──────────────────────────────
    if (!user) {
      const derivedName = name || emailLower.split("@")[0];
      const inserted = await sql`
        INSERT INTO users (name, email, auth_method, avatar_url)
        VALUES (${derivedName}, ${emailLower}, 'google', ${picture || null})
        RETURNING id, name, email, auth_method, avatar_url
      `;
      user = inserted[0];
      isNewUser = true;
      console.log(`[AUTH-GOOGLE] Registered new Google user: ${emailLower} (id: ${user.id})`);
    } else {
      // Update existing user with latest Google info
      const updated = await sql`
        UPDATE users
        SET avatar_url = ${picture || user.avatar_url || null}, auth_method = 'google'
        WHERE id = ${user.id}
        RETURNING id, name, email, auth_method, avatar_url
      `;
      user = updated[0];
      console.log(`[AUTH-GOOGLE] Signed in existing Google user: ${emailLower} (id: ${user.id})`);
    }

    return NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.avatar_url || null,
        authMethod: user.auth_method,
      },
    });

  } catch (error) {
    console.error("[AUTH-GOOGLE] Error in Google auth route:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
