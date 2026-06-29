ALTER TABLE "events" ADD COLUMN "type" varchar(50) DEFAULT 'featured' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "time" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "rating" varchar(10);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "organizer" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "features" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "crew" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "reviews" jsonb DEFAULT '[]';