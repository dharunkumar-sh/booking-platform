import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	events: {
		users: r.many.users({
			from: r.events.id.through(r.bookings.eventId),
			to: r.users.id.through(r.bookings.userId)
		}),
	},
	users: {
		events: r.many.events(),
	},
}))