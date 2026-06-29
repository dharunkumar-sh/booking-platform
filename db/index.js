import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

let _db = null;

export function getDb() {
  if (_db) return _db;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not defined. Check your .env file."
    );
  }
  const sql = neon(databaseUrl);
  _db = drizzle(sql, { schema });
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
