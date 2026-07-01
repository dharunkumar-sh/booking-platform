import { drizzle } from "drizzle-orm/neon-http";

// ---------------------------------------------------------------------------
// drizzle-orm@1.0.0-rc.4 / neon-http: drizzle() accepts the connection
// string directly — NOT a pre-created neon() sql function.
// ---------------------------------------------------------------------------
const FALLBACK_DB_URL =
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

let _db = null;

export function getDb() {
  if (_db) return _db;

  // Strip surrounding quotes that some env loaders may leave around the value
  const raw = process.env.DATABASE_URL || "";
  const databaseUrl = raw.replace(/^["']|["']$/g, "") || FALLBACK_DB_URL;

  _db = drizzle(databaseUrl);
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
