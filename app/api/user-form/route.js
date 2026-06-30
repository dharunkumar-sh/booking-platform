import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const sql = neon(DATABASE_URL);

    // Ensure phone column exists (if not already there)
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone varchar(50)`;
    } catch (e) {
      console.log("Column phone might already exist or could not be created:", e.message);
    }

    // Upsert the user into Neon database
    const result = await sql`
      INSERT INTO users (name, email, phone)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${phone?.trim() || null})
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone
      RETURNING id, name, email, phone
    `;

    const user = result[0];

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        message: "User details saved in Neon DB.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/user-form] Error:", error);
    return NextResponse.json(
      { error: "Failed to store user details in Neon database." },
      { status: 500 }
    );
  }
}
