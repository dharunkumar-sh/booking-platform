import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[verify] Signature mismatch — possible tampered request.");
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Signature valid — payment is authentic
    console.log(
      `[verify] Payment verified: orderId=${razorpay_order_id} paymentId=${razorpay_payment_id} bookingId=${bookingId}`
    );

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("[verify] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Verification failed." },
      { status: 500 }
    );
  }
}
