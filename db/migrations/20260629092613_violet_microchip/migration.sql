CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"seats_booked" integer NOT NULL,
	"total_price" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"booking_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(255) NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"price" integer NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id");