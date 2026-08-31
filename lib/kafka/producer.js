import { getKafkaClient } from "./client.js";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

/**
 * Sleep helper for retry backoff
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Route poison pill / permanently failed event to PostgreSQL Dead Letter Queue (DLQ).
 */
export async function sendToDeadLetterQueue({
  topic,
  eventType,
  idempotencyKey,
  payload,
  errorMessage,
  stackTrace,
  attempts = 1,
}) {
  try {
    const sql = neon(DATABASE_URL);
    await sql`
      INSERT INTO dead_letter_queue (
        topic, event_type, idempotency_key, payload, error_message, stack_trace, attempts, created_at
      ) VALUES (
        ${topic},
        ${eventType},
        ${idempotencyKey || null},
        ${JSON.stringify(payload)},
        ${errorMessage || "Unknown error"},
        ${stackTrace || null},
        ${attempts},
        NOW()
      )
    `;
    console.warn(`[Kafka DLQ] Event routed to Dead Letter Queue: [${topic}] ${eventType}`);
  } catch (dlqErr) {
    console.error("[Kafka DLQ Critical] Failed to write to Dead Letter Queue table:", dlqErr);
  }
}

/**
 * Highly reliable Kafka Producer with Exponential Backoff, Jitter, and DLQ routing.
 *
 * @param {Object} envelope - Event envelope created with createEventEnvelope
 * @param {Object} options - Config options { maxRetries: 3, baseDelayMs: 150, routeToDlqOnFail: true }
 */
export async function publishReliableEvent(envelope, options = {}) {
  const { maxRetries = 3, baseDelayMs = 150, routeToDlqOnFail = true } = options;
  const { topic, idempotencyKey, eventType } = envelope;

  const kafka = getKafkaClient();
  const producer = kafka.producer();

  let attempt = 0;
  let lastError = null;

  const messageValue = typeof envelope === "string" ? envelope : JSON.stringify(envelope);

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const response = await producer.produce(topic, messageValue, {
        key: idempotencyKey || envelope.entityId || undefined,
        headers: {
          "x-idempotency-key": idempotencyKey || "",
          "x-event-type": eventType || "",
          "x-producer-attempt": String(attempt),
        },
      });

      return {
        success: true,
        topic,
        idempotencyKey,
        attempts: attempt,
        response,
      };
    } catch (err) {
      lastError = err;
      console.warn(
        `[Kafka Producer Attempt ${attempt}/${maxRetries + 1} Failed] Topic: ${topic}, Event: ${eventType}. Error: ${err.message}`
      );

      if (attempt <= maxRetries) {
        // Exponential backoff with jitter
        const backoffMs = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 100;
        await sleep(backoffMs);
      }
    }
  }

  // All retries failed
  if (routeToDlqOnFail) {
    await sendToDeadLetterQueue({
      topic,
      eventType: envelope.eventType || "UNKNOWN",
      idempotencyKey: envelope.idempotencyKey || null,
      payload: envelope,
      errorMessage: lastError?.message || "Max retries exceeded",
      stackTrace: lastError?.stack || null,
      attempts: attempt,
    });
  }

  return {
    success: false,
    topic,
    idempotencyKey,
    attempts: attempt,
    error: lastError?.message || "Failed to publish event to Kafka",
  };
}

/**
 * Publish a batch of events with individual error resilience.
 */
export async function publishBatchEvents(envelopes, options = {}) {
  const results = [];
  for (const envelope of envelopes) {
    const res = await publishReliableEvent(envelope, options);
    results.push(res);
  }
  return results;
}
