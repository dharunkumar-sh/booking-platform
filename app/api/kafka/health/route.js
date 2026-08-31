import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isKafkaConfigured } from "@/lib/kafka/client";
import { KAFKA_TOPICS, EVENT_TYPES } from "@/lib/kafka/events";

export const dynamic = "force-dynamic";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

/**
 * GET /api/kafka/health
 * Returns status of Kafka configuration, database outbox, and DLQ.
 */
export async function GET() {
  try {
    const configured = isKafkaConfigured();
    const sql = neon(DATABASE_URL);

    // Fetch Outbox stats
    const outboxStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') AS "pendingCount",
        COUNT(*) FILTER (WHERE status = 'retrying') AS "retryingCount",
        COUNT(*) FILTER (WHERE status = 'published') AS "publishedCount",
        COUNT(*) FILTER (WHERE status = 'failed') AS "failedCount",
        COUNT(*) AS "totalCount"
      FROM outbox_events
    `;

    // Fetch DLQ stats
    const dlqStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE resolved_at IS NULL) AS "unresolvedCount",
        COUNT(*) AS "totalCount"
      FROM dead_letter_queue
    `;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      kafka: {
        provider: "Upstash Kafka (REST API)",
        isConfigured: configured,
        mode: configured ? "production" : "mock_simulation",
        registeredTopics: Object.values(KAFKA_TOPICS),
        registeredEventTypes: Object.values(EVENT_TYPES),
      },
      outbox: {
        pending: Number(outboxStats[0]?.pendingCount || 0),
        retrying: Number(outboxStats[0]?.retryingCount || 0),
        published: Number(outboxStats[0]?.publishedCount || 0),
        failed: Number(outboxStats[0]?.failedCount || 0),
        total: Number(outboxStats[0]?.totalCount || 0),
      },
      deadLetterQueue: {
        unresolved: Number(dlqStats[0]?.unresolvedCount || 0),
        total: Number(dlqStats[0]?.totalCount || 0),
      },
    });
  } catch (error) {
    console.error("[GET /api/kafka/health] Error:", error);
    return NextResponse.json(
      {
        status: "degraded",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
