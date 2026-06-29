import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL environment variable is not defined");
}

const sql = neon(databaseUrl || "");
export const db = drizzle(sql, { schema });
