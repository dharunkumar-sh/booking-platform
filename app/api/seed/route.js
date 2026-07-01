// This API is commented out as everything is fetched directly from the database from the events table.
// It was used only to push the initial events to the database.
//
// import { db } from "@/db/index";
// import { events } from "@/db/schema";
// import eventsData from "@/data.json";
// import { NextResponse } from "next/server";
//
// export async function POST() {
//   const dbUrl = process.env.DATABASE_URL;
//   console.log("DATABASE_URL at seed time:", dbUrl ? `SET (length=${dbUrl.length}, starts=${dbUrl.slice(0,20)})` : "NOT SET");
//   try {
//     const rows = eventsData.events.map((e) => ({
//       title: e.title,
//       type: e.type,
//       category: e.category ?? null,
//       description: e.description ?? null,
//       image: e.image ?? null,
//       location: e.location,
//       latitude: e.latitude ?? null,
//       longitude: e.longitude ?? null,
//       price: e.price,
//       date: new Date(e.date),
//       time: e.time ?? null,
//       rating: e.rating ?? null,
//       organizer: e.organizer ?? null,
//       features: e.features ?? [],
//       crew: e.crew ?? [],
//       reviews: e.reviews ?? [],
//     }));
//
//     const inserted = await db
//       .insert(events)
//       .values(rows)
//       .onConflictDoNothing()
//       .returning({ id: events.id, title: events.title });
//
//     return NextResponse.json({
//       success: true,
//       message: `Seeded ${inserted.length} events into the database.`,
//       inserted,
//     });
//   } catch (error) {
//     console.error("Seed error:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Seed API is disabled. Events are fetched directly from the database.",
  }, { status: 403 });
}
