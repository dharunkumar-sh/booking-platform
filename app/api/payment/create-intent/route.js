import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
    });
    const { amount, currency = "INR", bookingId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided." },
        { status: 400 }
      );
    }

    // Razorpay requires amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: `receipt_${bookingId ?? Date.now()}`,
      notes: {
        bookingId: bookingId ?? "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to create payment order." },
      { status: 500 }
    );
  }
}
