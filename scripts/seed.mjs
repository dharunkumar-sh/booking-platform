// scripts/seed.mjs
// Run with: npm run db:seed
// Deletes ALL existing events and re-inserts the 20 structured events from seed-data.js

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

import { drizzle } from "drizzle-orm/neon-http";
import { events } from "../db/schema.js";
import { seedEvents } from "../db/seed-data.js";

const FALLBACK_DB_URL =
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

const raw = process.env.DATABASE_URL || "";
const databaseUrl = raw.replace(/^["']|["']$/g, "") || FALLBACK_DB_URL;

const db = drizzle(databaseUrl);

async function seed() {
  console.log("🌱 Starting seed...");

  // ── 1. Delete all existing events ──────────────────────────────────────────
  console.log("🗑️  Deleting all existing events...");
  await db.delete(events);
  console.log("✅  All events deleted.");

  // ── 2. Insert the 20 structured events ─────────────────────────────────────
  console.log(`📥  Inserting ${seedEvents.length} events...`);

  const rows = seedEvents.map((e) => ({
    title:       e.title,
    type:        e.type || "featured",
    category:    e.category,
    description: e.description,
    image:       e.image,
    location:    e.location,
    price:       e.price,
    date:        new Date(e.date),
    time:        e.time,
    rating:      e.rating,
    organizer:   e.organizer,
    features:    e.features || [],
    crew:        e.crew     || [],
    reviews:     e.reviews  || [],
    likes:       0,
  }));

  await db.insert(events).values(rows);
  console.log(`✅  ${rows.length} events inserted successfully.`);
  console.log("");
  console.log("📋  Summary:");
  const cats = {};
  rows.forEach((r) => { cats[r.category] = (cats[r.category] || 0) + 1; });
  Object.entries(cats).forEach(([cat, count]) =>
    console.log(`    ${cat.padEnd(10)} → ${count} events`)
  );
  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
