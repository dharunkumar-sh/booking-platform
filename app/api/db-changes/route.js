import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eIksTfn5lH6B@ep-fancy-rice-aohecs3k-pooler.c-2.ap-southeast-1.aws.neon.tech/booking-platform?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

export async function GET(request) {
  const responseStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const getDbState = async () => {
        try {
          const res = await sql`
            SELECT 
              (SELECT COALESCE(MAX(id), 0) FROM bookings) AS bookings,
              (SELECT COALESCE(MAX(id), 0) FROM reviews) AS reviews,
              (SELECT COALESCE(MAX(id), 0) FROM event_likes) AS likes,
              (SELECT COALESCE(MAX(id), 0) FROM event_favourites) AS favourites,
              (SELECT COALESCE(MAX(id), 0) FROM events) AS events,
              (SELECT COALESCE(MAX(id), 0) FROM users) AS users,
              (SELECT COALESCE(MAX(id), 0) FROM userform) AS userform,
              (SELECT COALESCE(MAX(id), 0) FROM watchlist) AS watchlist
          `;
          return res[0];
        } catch (e) {
          console.error("Error querying db state for SSE:", e);
          return null;
        }
      };

      let lastState = await getDbState();

      // Send initial success connection message
      sendEvent({ type: "connected", timestamp: Date.now() });

      const interval = setInterval(async () => {
        const currentState = await getDbState();
        if (!currentState || !lastState) return;

        let hasChanges = false;
        for (const key in currentState) {
          if (currentState[key] > lastState[key]) {
            hasChanges = true;
            break;
          }
        }

        if (hasChanges) {
          lastState = currentState;
          sendEvent({ type: "refresh", timestamp: Date.now() });
        }
      }, 3000); // Poll DB every 3 seconds

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch (e) {
          // Stream might be closed already
        }
      });
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
