import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { createEventEnvelope, EVENT_TYPES, KAFKA_TOPICS } from "../lib/kafka/events.js";
import { publishReliableEvent, sendToDeadLetterQueue } from "../lib/kafka/producer.js";
import { recordOutboxEvent, processPendingOutbox, emitReliableEvent } from "../lib/kafka/outbox.js";
import { isKafkaConfigured } from "../lib/kafka/client.js";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

async function runTests() {
  console.log("=== RUNNING KAFKA & OUTBOX VERIFICATION SUITE ===");

  console.log("\n[Test 1] Checking Kafka Configuration Status");
  const configured = isKafkaConfigured();
  console.log(`Kafka Configured: ${configured} (${configured ? "Production Upstash" : "Safe Mock/Simulation Mode"})`);

  console.log("\n[Test 2] Testing Event Envelope Creation");
  const envelope = createEventEnvelope({
    eventType: EVENT_TYPES.EVENT_CREATED,
    entityId: "test-evt-101",
    payload: { title: "Rock Concert 2026", price: 499 },
  });
  console.log("Generated Envelope:", {
    id: envelope.id,
    topic: envelope.topic,
    eventType: envelope.eventType,
    idempotencyKey: envelope.idempotencyKey,
  });
  if (envelope.topic !== KAFKA_TOPICS.EVENTS_LIFECYCLE) {
    throw new Error(`Topic mismatch: expected ${KAFKA_TOPICS.EVENTS_LIFECYCLE}, got ${envelope.topic}`);
  }
  console.log("✓ Event Envelope created with correct topic mapping");

  console.log("\n[Test 3] Testing Reliable Producer with Retry & Jitter");
  const produceRes = await publishReliableEvent(envelope, { maxRetries: 1 });
  console.log("Produce Result:", produceRes);
  if (!produceRes.success) {
    throw new Error("Failed to produce event");
  }
  console.log("✓ Reliable Producer passed");

  console.log("\n[Test 4] Testing Transactional Outbox Pattern");
  const idempotencyKey = `test-outbox-${Date.now()}`;
  const outboxRes = await recordOutboxEvent({
    eventType: EVENT_TYPES.BOOKING_CONFIRMED,
    entityId: "bk-999",
    payload: { bookingId: "bk-999", amount: 1200, seats: ["A1", "A2"] },
    idempotencyKey,
  });
  console.log("Outbox Record Result:", outboxRes);
  if (!outboxRes.outboxId) {
    throw new Error("Outbox record insertion failed");
  }
  console.log("✓ Transactional Outbox write verified in PostgreSQL");

  console.log("\n[Test 5] Testing Outbox Processor Batch Draining");
  const processRes = await processPendingOutbox({ batchSize: 10, maxRetries: 3 });
  console.log("Outbox Process Result:", processRes);
  if (processRes.processed < 1 || processRes.succeeded < 1) {
    throw new Error("Outbox processor failed to drain pending events");
  }
  console.log("✓ Outbox batch processor drained and published events");

  console.log("\n[Test 6] Testing Dead Letter Queue (DLQ) Recording & Recovery");
  const dlqKey = `dlq-test-${Date.now()}`;
  await sendToDeadLetterQueue({
    topic: KAFKA_TOPICS.EVENTS_LIFECYCLE,
    eventType: "TEST_POISON_PILL",
    idempotencyKey: dlqKey,
    payload: { reason: "Simulated fatal broker partition" },
    errorMessage: "Simulated broker failure",
    attempts: 3,
  });

  const sql = neon(DATABASE_URL);
  const dlqRecords = await sql`
    SELECT id, topic, event_type, idempotency_key, resolved_at
    FROM dead_letter_queue
    WHERE idempotency_key = ${dlqKey}
  `;
  if (dlqRecords.length === 0) {
    throw new Error("DLQ record not found in database");
  }
  console.log("DLQ Record Created:", dlqRecords[0]);
  console.log("✓ Dead Letter Queue routing verified");

  console.log("\n[Test 7] Testing emitReliableEvent (Direct Outbox + Immediate Flush)");
  const emitRes = await emitReliableEvent({
    eventType: EVENT_TYPES.EVENT_LIKED,
    entityId: "evt-555",
    payload: { eventId: 555, userId: 1, likesCount: 42 },
    immediateDispatch: true,
  });
  console.log("emitReliableEvent Result:", emitRes);
  if (!emitRes.recordedInOutbox || !emitRes.publishedImmediately) {
    throw new Error("emitReliableEvent failed");
  }
  console.log("✓ emitReliableEvent successfully wrote to outbox and flushed immediately");

  console.log("\n=== ALL KAFKA VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
