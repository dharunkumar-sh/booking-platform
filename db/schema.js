import { pgTable, serial, text, integer, timestamp, varchar, doublePrecision, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 50 }).unique(),
  password: text("password"),
  authMethod: varchar("auth_method", { length: 50 }).default("otp"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default("featured").notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  image: text("image"),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  price: integer("price").notNull(),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 100 }),
  rating: varchar("rating", { length: 10 }),
  organizer: varchar("organizer", { length: 255 }),
  features: jsonb("features").default([]),
  crew: jsonb("crew").default([]),
  reviews: jsonb("reviews").default([]),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  seatsBooked: integer("seats_booked").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  seats: jsonb("seats").default([]),
});

export const userform = pgTable("userform", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventLikes = pgTable("event_likes", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventFavourites = pgTable("event_favourites", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tmdbId: varchar("tmdb_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  image: text("image"),
  rating: varchar("rating", { length: 10 }),
  releaseDate: varchar("release_date", { length: 100 }),
  platforms: jsonb("platforms").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const outboxEvents = pgTable("outbox_events", {
  id: serial("id").primaryKey(),
  topic: varchar("topic", { length: 255 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  idempotencyKey: varchar("idempotency_key", { length: 255 }).unique(),
  payload: jsonb("payload").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  retries: integer("retries").default(0).notNull(),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export const deadLetterQueue = pgTable("dead_letter_queue", {
  id: serial("id").primaryKey(),
  topic: varchar("topic", { length: 255 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  idempotencyKey: varchar("idempotency_key", { length: 255 }),
  payload: jsonb("payload").notNull(),
  errorMessage: text("error_message"),
  stackTrace: text("stack_trace"),
  attempts: integer("attempts").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});
