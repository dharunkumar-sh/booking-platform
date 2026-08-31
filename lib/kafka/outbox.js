import { neon } from "@neondatabase/serverless";
import { createEventEnvelope, DEFAULT_TOPIC_MAP } from "./events.js";
import { publishReliableEvent, sendToDeadLetterQueue } from "./producer.js";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

/**
 * Record an event into the PostgreSQL Outbox table.
 * This guarantees zero message loss even during network partitions or broker outages.
 */
export async function recordOutboxEvent({
  sqlClient = null,
  eventType,
  topic = null,
  entityId = null,
  payload = {},
  metadata = {},
  idempotencyKey = null,
}) {
  const sql = sqlClient || neon(DATABASE_URL);
  const envelope = createEventEnvelope({
    eventType,
    topic: topic || DEFAULT_TOPIC_MAP[eventType],
    entityId,
    payload,
    metadata,
    idempotencyKey,
  });

  try {
    const inserted = await sql`
      INSERT INTO outbox_events (
        topic, event_type, idempotency_key, payload, status, retries, created_at
      ) VALUES (
        ${envelope.topic},
        ${envelope.eventType},
        ${envelope.idempotencyKey},
        ${JSON.stringify(envelope)},
        'pending',
        0,
        NOW()
      )
      ON CONFLICT (idempotency_key) DO UPDATE
      SET status = CASE WHEN outbox_events.status = 'published' THEN 'published' ELSE 'pending' END
      RETURNING id, idempotency_key, status
    `;

    return {
      success: true,
      outboxId: inserted[0]?.id,
      idempotencyKey: envelope.idempotencyKey,
      envelope,
    };
  } catch (err) {
    console.error("[Outbox Record Error]:", err);
    throw err;
  }
}

/**
 * Process and dispatch a batch of pending outbox events to Kafka.
 */
export async function processPendingOutbox({ batchSize = 25, maxRetries = 5 } = {}) {
  const sql = neon(DATABASE_URL);

  // Fetch pending or failed events that have not exceeded max retries
  const pendingRows = await sql`
    SELECT id, topic, event_type AS "eventType", idempotency_key AS "idempotencyKey", 
           payload, retries, created_at AS "createdAt"
    FROM outbox_events
    WHERE status IN ('pending', 'retrying') 
      AND retries < ${maxRetries}
    ORDER BY created_at ASC
    LIMIT ${batchSize}
  `;

  if (pendingRows.length === 0) {
    return {
      processed: 0,
      succeeded: 0,
      failed: 0,
      events: [],
    };
  }

  let succeeded = 0;
  let failed = 0;
  const dispatchResults = [];

  for (const row of pendingRows) {
    let envelope = row.payload;
    if (typeof envelope === "string") {
      try {
        envelope = JSON.parse(envelope);
      } catch {
        envelope = { payload: row.payload, eventType: row.eventType, topic: row.topic };
      }
    }

    // Publish to Kafka with retries
    const publishResult = await publishReliableEvent(envelope, {
      maxRetries: 2,
      routeToDlqOnFail: false, // Outbox handles DLQ routing after max retries
    });

    if (publishResult.success) {
      await sql`
        UPDATE outbox_events
        SET status = 'published',
            published_at = NOW(),
            last_error = NULL
        WHERE id = ${row.id}
      `;
      succeeded++;
      dispatchResults.push({ id: row.id, status: "published", eventType: row.eventType });
    } else {
      const newRetries = (row.retries || 0) + 1;
      const isDead = newRetries >= maxRetries;

      await sql`
        UPDATE outbox_events
        SET status = ${isDead ? "failed" : "retrying"},
            retries = ${newRetries},
            last_error = ${publishResult.error || "Publish failed"}
        WHERE id = ${row.id}
      `;

      if (isDead) {
        await sendToDeadLetterQueue({
          topic: row.topic,
          eventType: row.eventType,
          idempotencyKey: row.idempotencyKey,
          payload: envelope,
          errorMessage: publishResult.error || `Outbox max retries (${maxRetries}) exceeded`,
          attempts: newRetries,
        });
      }

      failed++;
      dispatchResults.push({
        id: row.id,
        status: isDead ? "dead_lettered" : "retrying",
        error: publishResult.error,
      });
    }
  }

  return {
    processed: pendingRows.length,
    succeeded,
    failed,
    events: dispatchResults,
  };
}

/**
 * Convenient utility to record in Outbox and attempt immediate synchronous dispatch.
 * If immediate dispatch fails, the event safely remains in the outbox to be re-drained.
 */
export async function emitReliableEvent({
  sqlClient = null,
  eventType,
  topic = null,
  entityId = null,
  payload = {},
  metadata = {},
  idempotencyKey = null,
  immediateDispatch = true,
}) {
  const outboxRes = await recordOutboxEvent({
    sqlClient,
    eventType,
    topic,
    entityId,
    payload,
    metadata,
    idempotencyKey,
  });

  if (!immediateDispatch) {
    return {
      recordedInOutbox: true,
      publishedImmediately: false,
      outboxId: outboxRes.outboxId,
      idempotencyKey: outboxRes.idempotencyKey,
    };
  }

  // Attempt immediate flush
  try {
    const publishRes = await publishReliableEvent(outboxRes.envelope, {
      maxRetries: 2,
      routeToDlqOnFail: false,
    });

    if (publishRes.success) {
      const sql = sqlClient || neon(DATABASE_URL);
      await sql`
        UPDATE outbox_events
        SET status = 'published',
            published_at = NOW()
        WHERE id = ${outboxRes.outboxId}
      `;
      return {
        recordedInOutbox: true,
        publishedImmediately: true,
        outboxId: outboxRes.outboxId,
        idempotencyKey: outboxRes.idempotencyKey,
        publishResult: publishRes,
      };
    }
  } catch (err) {
    console.warn("[Immediate Kafka publish failed, kept in outbox]:", err.message);
  }

  return {
    recordedInOutbox: true,
    publishedImmediately: false,
    outboxId: outboxRes.outboxId,
    idempotencyKey: outboxRes.idempotencyKey,
  };
}
