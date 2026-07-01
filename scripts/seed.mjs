// Standalone seed script - run with: node scripts/seed.mjs
// Uses dynamic imports to ensure dotenv loads BEFORE any DB modules

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local (or .env) from project root FIRST before any DB module is imported
let result = config({ path: resolve(__dirname, "../.env.local") });
if (result.error) {
  result = config({ path: resolve(__dirname, "../.env") });
}
if (result.error) {
  console.error("❌ Failed to load environment variables:", result.error.message);
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

console.log("✅ DATABASE_URL found:", DATABASE_URL.substring(0, 30) + "...");

// Dynamic import AFTER env is loaded to avoid ESM hoisting issues
const { neon } = await import("@neondatabase/serverless");

const sql = neon(DATABASE_URL);

// Import seed data from our JS module instead of data.json
const { seedEvents: eventsList } = await import("../db/seed-data.js");

async function seed() {
  console.log(`📦 Seeding ${eventsList.length} events into the database...`);

  let successCount = 0;
  let skipCount = 0;

  for (const e of eventsList) {
    try {
      const rows = await sql`
        INSERT INTO events (
          title, type, category, description, image,
          location, price, date, time, rating,
          organizer, features, crew, reviews
        )
        SELECT
          ${e.title},
          ${e.type},
          ${e.category ?? null},
          ${e.description ?? null},
          ${e.image ?? null},
          ${e.location},
          ${e.price},
          ${e.date},
          ${e.time ?? null},
          ${e.rating ?? null},
          ${e.organizer ?? null},
          ${JSON.stringify(e.features ?? [])}::jsonb,
          ${JSON.stringify(e.crew ?? [])}::jsonb,
          ${JSON.stringify(e.reviews ?? [])}::jsonb
        WHERE NOT EXISTS (
          SELECT 1 FROM events WHERE title = ${e.title}
        )
        RETURNING id
      `;
      if (rows.length > 0) {
        console.log(`  ✅ Inserted: ${e.title} (id=${rows[0].id})`);
        successCount++;
      } else {
        console.log(`  ⏭ Skipped (already exists): ${e.title}`);
        skipCount++;
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${e.title} — ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Inserted: ${successCount}, Skipped: ${skipCount}`);
}

await seed();
