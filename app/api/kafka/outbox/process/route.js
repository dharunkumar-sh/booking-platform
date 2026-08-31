import { NextResponse } from "next/server";
import { processPendingOutbox } from "@/lib/kafka/outbox";

export const dynamic = "force-dynamic";

/**
 * Handles outbox draining/processing.
 * Supports both GET and POST for ease of cron integration (e.g. Vercel Cron or custom triggers).
 */
async function handleOutboxDrain(request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchSize = parseInt(searchParams.get("batchSize") || "50", 10);
    const maxRetries = parseInt(searchParams.get("maxRetries") || "5", 10);

    const result = await processPendingOutbox({
      batchSize: isNaN(batchSize) ? 50 : batchSize,
      maxRetries: isNaN(maxRetries) ? 5 : maxRetries,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: result,
    });
  } catch (error) {
    console.error("[/api/kafka/outbox/process] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process outbox",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return handleOutboxDrain(request);
}

export async function POST(request) {
  return handleOutboxDrain(request);
}
