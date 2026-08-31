import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { emitReliableEvent } from "@/lib/kafka/outbox";

export const dynamic = "force-dynamic";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

/**
 * GET /api/kafka/dlq
 *
 * Query params:
 *   limit  — number of records (default: 50)
 *   topic  — filter by topic
 *   status — 'unresolved' | 'all' (default: 'unresolved')
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const topic = searchParams.get("topic");
    const showAll = searchParams.get("status") === "all";

    const sql = neon(DATABASE_URL);

    let rows;
    if (topic) {
      if (showAll) {
        rows = await sql`
          SELECT id, topic, event_type AS "eventType", idempotency_key AS "idempotencyKey",
                 payload, error_message AS "errorMessage", stack_trace AS "stackTrace",
                 attempts, created_at AS "createdAt", resolved_at AS "resolvedAt"
          FROM dead_letter_queue
          WHERE topic = ${topic}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
      } else {
        rows = await sql`
          SELECT id, topic, event_type AS "eventType", idempotency_key AS "idempotencyKey",
                 payload, error_message AS "errorMessage", stack_trace AS "stackTrace",
                 attempts, created_at AS "createdAt", resolved_at AS "resolvedAt"
          FROM dead_letter_queue
          WHERE topic = ${topic} AND resolved_at IS NULL
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
      }
    } else {
      if (showAll) {
        rows = await sql`
          SELECT id, topic, event_type AS "eventType", idempotency_key AS "idempotencyKey",
                 payload, error_message AS "errorMessage", stack_trace AS "stackTrace",
                 attempts, created_at AS "createdAt", resolved_at AS "resolvedAt"
          FROM dead_letter_queue
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
      } else {
        rows = await sql`
          SELECT id, topic, event_type AS "eventType", idempotency_key AS "idempotencyKey",
                 payload, error_message AS "errorMessage", stack_trace AS "stackTrace",
                 attempts, created_at AS "createdAt", resolved_at AS "resolvedAt"
          FROM dead_letter_queue
          WHERE resolved_at IS NULL
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
      }
    }

    return NextResponse.json({
      success: true,
      count: rows.length,
      deadLetters: rows,
    });
  } catch (error) {
    console.error("[GET /api/kafka/dlq] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch DLQ records" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kafka/dlq
 * Replay a dead-lettered message.
 *
 * Body:
 * {
 *   dlqId: number (required)
 * }
 */
export async function POST(request) {
  try {
    const { dlqId } = await request.json();

    if (!dlqId) {
      return NextResponse.json(
        { success: false, error: "Missing required field 'dlqId'." },
        { status: 400 }
      );
    }

    const sql = neon(DATABASE_URL);
    const rows = await sql`
      SELECT id, topic, event_type AS "eventType", idempotency_key AS "idempotencyKey",
             payload, attempts, resolved_at AS "resolvedAt"
      FROM dead_letter_queue
      WHERE id = ${parseInt(dlqId, 10)}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: `DLQ record with id ${dlqId} not found.` },
        { status: 404 }
      );
    }

    const record = rows[0];
    const payload = typeof record.payload === "string" ? JSON.parse(record.payload) : record.payload;

    // Re-emit into outbox with a fresh retry cycle
    const replayResult = await emitReliableEvent({
      eventType: record.eventType,
      topic: record.topic,
      payload: payload?.payload || payload,
      idempotencyKey: `replay-${record.idempotencyKey || Date.now()}`,
      immediateDispatch: true,
    });

    // Mark as resolved in DLQ
    await sql`
      UPDATE dead_letter_queue
      SET resolved_at = NOW()
      WHERE id = ${record.id}
    `;

    return NextResponse.json({
      success: true,
      message: `DLQ message ${dlqId} replayed successfully.`,
      replayResult,
    });
  } catch (error) {
    console.error("[POST /api/kafka/dlq] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to replay DLQ record" },
      { status: 500 }
    );
  }
}
