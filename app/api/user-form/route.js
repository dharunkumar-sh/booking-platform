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

    // Ensure userform table exists (if not already there, though we pushed the schema)
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS userform (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `;
    } catch (e) {
      // ignore
    }

    // Insert the details into the userform table in Neon database
    const result = await sql`
      INSERT INTO userform (name, email, phone)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${phone?.trim() || null})
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
        message: "User details saved in userform table in Neon DB.",
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
