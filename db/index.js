import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    let databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl === "undefined" || databaseUrl === "null" || !databaseUrl) {
      databaseUrl = "";
    }
    
    if (!databaseUrl) {
      console.warn("DATABASE_URL environment variable is not defined, using placeholder connection");
    }
    
    const sql = neon(databaseUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder");
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
}

// Export a proxy that redirects all calls to the lazy-loaded dbInstance
export const db = new Proxy({}, {
  get(target, prop) {
    const instance = getDb();
    const value = instance[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  }
});
