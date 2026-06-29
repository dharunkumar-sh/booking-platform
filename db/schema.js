import { pgTable, serial, text, integer, timestamp, varchar, doublePrecision, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default("featured").notNull(), // "trending" | "featured"
  category: varchar("category", { length: 100 }),
  description: text("description"),
  image: text("image"),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  price: integer("price").notNull(), // price in paise (cents)
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 100 }),
  rating: varchar("rating", { length: 10 }),
  organizer: varchar("organizer", { length: 255 }),
  features: jsonb("features").default([]),  // string[]
  crew: jsonb("crew").default([]),          // { name, role, img }[]
  reviews: jsonb("reviews").default([]),    // { name, rating, comment }[]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  seatsBooked: integer("seats_booked").notNull(),
  totalPrice: integer("total_price").notNull(), // price in paise
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
});
