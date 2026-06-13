import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import axios from "axios";

export default function Home() {
  // Server-side fetching to completely bypass browser CORS blocks
  async function searchEventsAction(query, location) {
    "use server";

    const key = process.env.NEXT_PUBLIC_SERPAPI_KEY || "0cf6781b3f385b49a70dcfc0186b2ac3c966e60fa6d2b224f86c77312b6a5aac";
    const searchStr = query.trim() ? query : "events";
    const q = `${searchStr} in ${location}`;
    const url = `https://serpapi.com/search.json?engine=google_events&q=${encodeURIComponent(q)}&api_key=${key}`;

    try {
      const response = await axios.get(url, { timeout: 12000 });
      if (response.data && response.data.events_results) {
        return { success: true, events: response.data.events_results };
      }
      return { success: true, events: [] };
    } catch (err) {
      console.error("Server-side SerpApi request failed:", err.message);
      return { success: false, error: err.message };
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500/30 selection:text-orange-200">
      <Hero />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <EventCard searchEvents={searchEventsAction} />
      </main>
    </div>
  );
}
