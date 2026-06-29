import { pgTable, serial, text, integer, timestamp, varchar, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 50 }).unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  price: integer("price").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  type: varchar("type", { length: 50 }).default("featured").notNull(),
  category: varchar("category", { length: 100 }),
  image: text("image"),
  time: varchar("time", { length: 100 }),
  rating: varchar("rating", { length: 10 }),
  organizer: varchar("organizer", { length: 255 }),
  features: jsonb("features").default([]),
  crew: jsonb("crew").default([]),
  reviews: jsonb("reviews").default([]),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  seatsBooked: integer("seats_booked").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
});
