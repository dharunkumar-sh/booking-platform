import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  try {
    const { amount, currency = "inr", bookingId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided." },
        { status: 400 }
      );
    }

    // Stripe requires amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: "inr",
      payment_method_types: ["card"],
      metadata: {
        bookingId: bookingId ?? "",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
