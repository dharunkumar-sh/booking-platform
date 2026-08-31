import { NextResponse } from "next/server";
import { emitReliableEvent } from "@/lib/kafka/outbox";
import { publishReliableEvent } from "@/lib/kafka/producer";
import { createEventEnvelope, EVENT_TYPES } from "@/lib/kafka/events";

export const dynamic = "force-dynamic";

/**
 * POST /api/kafka/publish
 *
 * Body:
 * {
 *   eventType: "EVENT_CREATED" | "BOOKING_CREATED" | ... (required),
 *   topic: "events.lifecycle" (optional, inferred from eventType),
 *   entityId: "123" (optional),
 *   payload: { ... } (required),
 *   metadata: { ... } (optional),
 *   idempotencyKey: "custom-key" (optional),
 *   mode: "outbox" | "direct" (default: "outbox")
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      eventType,
      topic,
      entityId,
      payload = {},
      metadata = {},
      idempotencyKey,
      mode = "outbox",
    } = body;

    if (!eventType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field 'eventType'.",
          validEventTypes: Object.values(EVENT_TYPES),
        },
        { status: 400 }
      );
    }

    if (mode === "direct") {
      const envelope = createEventEnvelope({
        eventType,
        topic,
        entityId,
        payload,
        metadata,
        idempotencyKey,
      });

      const result = await publishReliableEvent(envelope, {
        maxRetries: 3,
        routeToDlqOnFail: true,
      });

      return NextResponse.json(
        {
          success: result.success,
          mode: "direct",
          result,
        },
        { status: result.success ? 200 : 502 }
      );
    }

    // Default: High-reliability Transactional Outbox mode
    const outboxResult = await emitReliableEvent({
      eventType,
      topic,
      entityId,
      payload,
      metadata,
      idempotencyKey,
      immediateDispatch: true,
    });

    return NextResponse.json(
      {
        success: true,
        mode: "outbox",
        outboxResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/kafka/publish] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to publish event to Kafka",
      },
      { status: 500 }
    );
  }
}
