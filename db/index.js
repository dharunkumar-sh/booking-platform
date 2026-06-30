import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

// ---------------------------------------------------------------------------
// Inline fallback so the DB always initializes even if the env loader
// fails to pick up the .env / .env.local file before the module loads.
// ---------------------------------------------------------------------------
const FALLBACK_DB_URL =
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

let _db = null;

export function getDb() {
  if (_db) return _db;

  const databaseUrl = process.env.DATABASE_URL || FALLBACK_DB_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not defined. Check your .env.local file."
    );
  }

  try {
    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
  } catch (err) {
    console.error("[DB] Failed to initialize Neon connection:", err.message);
    throw err;
  }

  return _db;
}

// Keep backward-compatible named export for existing code that uses `db`
// This is a Proxy so it initializes lazily when first used.
export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      return getDb()[prop];
    },
  }
);
