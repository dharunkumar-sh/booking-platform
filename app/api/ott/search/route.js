import { db } from "@/db/index";
import { events } from "@/db/schema";
import { or, and, like, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const state = (searchParams.get("state") || "").trim();
    const crossOtt = searchParams.get("crossOtt") !== "false";
    
    console.log(`[/api/ott/search] q: "${q}", state: "${state}", crossOtt: ${crossOtt} (raw: "${searchParams.get("crossOtt")}")`);

    if (!q) {
      return NextResponse.json({ success: true, type: "db", results: [] });
    }

    // 1. Search local events under state first
    const searchConditions = or(
      like(sql`LOWER(${events.title})`, `%${q.toLowerCase()}%`),
      like(sql`LOWER(${events.category})`, `%${q.toLowerCase()}%`),
      like(sql`LOWER(${events.location})`, `%${q.toLowerCase()}%`),
      like(sql`LOWER(${events.organizer})`, `%${q.toLowerCase()}%`),
      like(sql`LOWER(${events.description})`, `%${q.toLowerCase()}%`)
    );

    const conditions = [searchConditions];
    if (state) {
      conditions.push(like(sql`LOWER(${events.location})`, `%${state.toLowerCase()}%`));
    }

    const localDbEvents = await db
      .select({
        id: events.id,
        title: events.title,
        category: events.category,
        location: events.location,
        image: events.image,
        type: events.type,
        price: events.price,
      })
      .from(events)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .limit(6);

    if (localDbEvents.length > 0) {
      return NextResponse.json({
        success: true,
        type: "db",
        results: localDbEvents,
      });
    }

    if (!crossOtt) {
      return NextResponse.json({
        success: true,
        type: "db",
        results: [],
      });
    }

    // 2. If not found in database, search TMDB for OTT movies/shows
    const apiKey = "fc8544873a24aece75531acb201efa3b";
    const tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(q)}&language=en-US&page=1`;
    
    const tmdbRes = await fetch(tmdbUrl);
    if (!tmdbRes.ok) {
      throw new Error(`TMDB Search failed with status ${tmdbRes.status}`);
    }
    const tmdbData = await tmdbRes.json();
    
    const items = (tmdbData.results || [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .slice(0, 5);

    const resultsWithProviders = await Promise.all(
      items.map(async (item) => {
        try {
          const providerUrl = `https://api.themoviedb.org/3/${item.media_type}/${item.id}/watch/providers?api_key=${apiKey}`;
          const providerRes = await fetch(providerUrl);
          let platforms = [];
          if (providerRes.ok) {
            const providerData = await providerRes.json();
            const inRegion = providerData.results?.IN;
            const usRegion = providerData.results?.US;
            const targetRegion = inRegion || usRegion;
            
            if (targetRegion) {
              const flatrate = targetRegion.flatrate || [];
              const rent = targetRegion.rent || [];
              const buy = targetRegion.buy || [];
              const allProviders = [...flatrate, ...rent, ...buy];
              
              const seen = new Set();
              for (const p of allProviders) {
                if (p.provider_name && !seen.has(p.provider_name)) {
                  seen.add(p.provider_name);
                  platforms.push(p.provider_name);
                }
              }
            }
          }
          
          return {
            id: `tmdb-${item.media_type}-${item.id}`,
            title: item.title || item.name,
            category: item.media_type === "movie" ? "Movie" : "TV Show",
            location: platforms.length > 0 ? platforms.join(", ") : "OTT Streaming",
            image: item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
            type: "ott",
            platforms: platforms,
            rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
            releaseDate: item.release_date || item.first_air_date || "",
            description: item.overview || "",
          };
        } catch (err) {
          console.error(`Error fetching providers for tmdb ${item.id}:`, err);
          return {
            id: `tmdb-${item.media_type}-${item.id}`,
            title: item.title || item.name,
            category: item.media_type === "movie" ? "Movie" : "TV Show",
            location: "OTT Streaming",
            image: item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
            type: "ott",
            platforms: [],
            rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
            releaseDate: item.release_date || item.first_air_date || "",
            description: item.overview || "",
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      type: "ott",
      results: resultsWithProviders,
    });

  } catch (error) {
    console.error("[/api/ott/search] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
