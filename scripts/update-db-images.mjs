import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const { neon } = await import("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

// Import seed data
const { seedEvents } = await import("../db/seed-data.js");

async function updateDb() {
  console.log("🔄 Updating database event details and image URLs from seed-data.js...");

  let updatedCount = 0;
  for (const e of seedEvents) {
    try {
      const rows = await sql`
        UPDATE events 
        SET 
          image = ${e.image},
          price = ${e.price},
          location = ${e.location},
          date = ${e.date},
          time = ${e.time},
          rating = ${e.rating},
          organizer = ${e.organizer},
          features = ${JSON.stringify(e.features ?? [])}::jsonb,
          crew = ${JSON.stringify(e.crew ?? [])}::jsonb,
          reviews = ${JSON.stringify(e.reviews ?? [])}::jsonb
        WHERE title = ${e.title}
        RETURNING id
      `;
      if (rows.length > 0) {
        console.log(`  ✅ Updated: ${e.title} (id=${rows[0].id})`);
        updatedCount++;
      } else {
        console.log(`  ❌ Not found in DB: ${e.title}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed updating: ${e.title} — ${err.message}`);
    }
  }

  console.log(`\n🎉 Completed updating ${updatedCount} events!`);
}

await updateDb();
