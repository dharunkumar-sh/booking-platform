import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Server-side in-memory map to store temporary OTPs
// In production, this would be Redis or stored in a DB with an expiration time
if (!global.otpStore) {
  global.otpStore = new Map();
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, email, password } = body;

    // Generate a 6-digit OTP code (e.g. 123456)
    // We make it semi-random but consistent or fully random
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // 1. Mobile OTP Authentication
    if (phone) {
      const sanitizedPhone = phone.replace(/[^0-9]/g, "");
      if (sanitizedPhone.length !== 10) {
        return NextResponse.json({ error: "Invalid phone number. Must be 10 digits." }, { status: 400 });
      }

      // Store OTP in cache
      global.otpStore.set(`otp:phone:${sanitizedPhone}`, { otp, expiresAt });
      console.log(`[AUTH] SMS OTP generated for +91${sanitizedPhone}: ${otp}`);

      return NextResponse.json({ success: true, otp, message: "OTP sent successfully" });
    }

    // 2. Email & Password Authentication
    if (email && password) {
      const emailLower = email.toLowerCase().trim();

      // Check if user already exists
      const existingUserList = await db.select().from(users).where(eq(users.email, emailLower));
      const existingUser = existingUserList[0];

      if (existingUser) {
        // User exists: verify password
        const hashedPassword = hashPassword(password);
        if (existingUser.password && existingUser.password !== hashedPassword) {
          return NextResponse.json({ error: "Incorrect password for this email." }, { status: 401 });
        }
      } else {
        // User doesn't exist: save temporary password registration detail in otpStore
        const hashedPassword = hashPassword(password);
        global.otpStore.set(`reg:email:password:${emailLower}`, hashedPassword);
      }

      // Store OTP in cache for 2FA
      global.otpStore.set(`otp:email:${emailLower}`, { otp, expiresAt });
      console.log(`[AUTH] Email 2FA OTP generated for ${emailLower}: ${otp}`);

      return NextResponse.json({ success: true, otp, message: "2FA verification code sent successfully" });
    }

    return NextResponse.json({ error: "Missing required authentication parameters." }, { status: 400 });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
