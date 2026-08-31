import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

async function main() {
  console.log("Connecting to Postgres database to verify/create Kafka outbox tables...");
  const sql = neon(DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS outbox_events (
      id SERIAL PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      idempotency_key VARCHAR(255) UNIQUE,
      payload JSONB NOT NULL,
      status VARCHAR(50) DEFAULT 'pending' NOT NULL,
      retries INTEGER DEFAULT 0 NOT NULL,
      last_error TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      published_at TIMESTAMP
    );
  `;
  console.log("✓ Table 'outbox_events' verified/created.");

  await sql`
    CREATE INDEX IF NOT EXISTS idx_outbox_events_status ON outbox_events (status, created_at);
  `;
  console.log("✓ Index 'idx_outbox_events_status' verified/created.");

  await sql`
    CREATE TABLE IF NOT EXISTS dead_letter_queue (
      id SERIAL PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      idempotency_key VARCHAR(255),
      payload JSONB NOT NULL,
      error_message TEXT,
      stack_trace TEXT,
      attempts INTEGER DEFAULT 1 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      resolved_at TIMESTAMP
    );
  `;
  console.log("✓ Table 'dead_letter_queue' verified/created.");

  console.log("All Kafka database tables initialized successfully!");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
