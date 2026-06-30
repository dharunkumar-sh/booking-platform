import { pgTable, serial, integer, varchar, text, timestamp, doublePrecision, jsonb, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const bookings = pgTable("bookings", {
	id: serial().primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id),
	eventId: integer("event_id").notNull().references(() => events.id),
	seatsBooked: integer("seats_booked").notNull(),
	totalPrice: integer("total_price").notNull(),
	status: varchar({ length: 50 }).default("pending").notNull(),
	bookingDate: timestamp("booking_date").default(sql`now()`).notNull(),
});

export const events = pgTable("events", {
	id: serial().primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	location: varchar({ length: 255 }).notNull(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	price: integer().notNull(),
	date: timestamp().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	type: varchar({ length: 50 }).default("featured").notNull(),
	category: varchar({ length: 100 }),
	image: text(),
	time: varchar({ length: 100 }),
	rating: varchar({ length: 10 }),
	organizer: varchar({ length: 255 }),
	features: jsonb().default([]),
	crew: jsonb().default([]),
	reviews: jsonb().default([]),
});

export const users = pgTable("users", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),]);
