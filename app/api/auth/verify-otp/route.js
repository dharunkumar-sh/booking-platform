import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

if (!global.otpStore) {
  global.otpStore = new Map();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, email, otp } = body;

    if (!otp) {
      return NextResponse.json({ error: "Missing OTP verification code." }, { status: 400 });
    }

    const cleanOtp = otp.trim();

    // 1. Verify Phone OTP
    if (phone) {
      const sanitizedPhone = phone.replace(/[^0-9]/g, "");
      const cacheKey = `otp:phone:${sanitizedPhone}`;
      const record = global.otpStore.get(cacheKey);

      if (!record) {
        return NextResponse.json({ error: "OTP has expired or was never requested. Please try again." }, { status: 400 });
      }

      if (Date.now() > record.expiresAt) {
        global.otpStore.delete(cacheKey);
        return NextResponse.json({ error: "OTP has expired. Please request a new code." }, { status: 400 });
      }

      if (record.otp !== cleanOtp) {
        return NextResponse.json({ error: "Incorrect verification code. Please check and try again." }, { status: 400 });
      }

      // Valid OTP: delete from cache
      global.otpStore.delete(cacheKey);

      // Check if user exists
      let userList = await db.select().from(users).where(eq(users.phone, sanitizedPhone));
      let user = userList[0];

      if (!user) {
        // Create new guest user since it's the first time
        const [newUser] = await db.insert(users).values({
          phone: sanitizedPhone,
          name: `User_${sanitizedPhone.slice(-4)}`,
        }).returning();
        user = newUser;
        console.log(`[AUTH] Registered new phone user: ${sanitizedPhone}`);
      }

      return NextResponse.json({ success: true, user });
    }

    // 2. Verify Email OTP
    if (email) {
      const emailLower = email.toLowerCase().trim();
      const cacheKey = `otp:email:${emailLower}`;
      const record = global.otpStore.get(cacheKey);

      if (!record) {
        return NextResponse.json({ error: "Verification code has expired or was never requested." }, { status: 400 });
      }

      if (Date.now() > record.expiresAt) {
        global.otpStore.delete(cacheKey);
        return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
      }

      if (record.otp !== cleanOtp) {
        return NextResponse.json({ error: "Incorrect verification code. Please check and try again." }, { status: 400 });
      }

      // Valid OTP: delete from cache
      global.otpStore.delete(cacheKey);

      // Check if user exists
      let userList = await db.select().from(users).where(eq(users.email, emailLower));
      let user = userList[0];

      if (!user) {
        // Retrieve temporary password hash
        const passwordHash = global.otpStore.get(`reg:email:password:${emailLower}`);
        if (!passwordHash) {
          return NextResponse.json({ error: "Registration session expired. Please start over." }, { status: 400 });
        }

        // Create new email user
        const [newUser] = await db.insert(users).values({
          email: emailLower,
          password: passwordHash,
          name: emailLower.split("@")[0],
        }).returning();
        
        user = newUser;
        global.otpStore.delete(`reg:email:password:${emailLower}`);
        console.log(`[AUTH] Registered new email user: ${emailLower}`);
      }

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: "Missing required verification parameters." }, { status: 400 });
  } catch (error) {
    console.error("Error in verify-otp API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
