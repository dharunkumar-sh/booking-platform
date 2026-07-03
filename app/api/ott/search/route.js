import { db } from "@/db/index";
import { events } from "@/db/schema";
import { or, and, like, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// Global memory cache to speed up suggestion query responses
if (!global.ottSearchCache) {
  global.ottSearchCache = new Map();
}
if (!global.ottProviderCache) {
  global.ottProviderCache = new Map();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const state = (searchParams.get("state") || "").trim();
    const crossOtt = searchParams.get("crossOtt") !== "false";
    
    if (!q) {
      return NextResponse.json({ success: true, type: "db", results: [] });
    }

    // If Cross OTT search is enabled, search TMDB immediately and bypass DB search
    if (crossOtt) {
      const searchCacheKey = `${q.toLowerCase()}`;
      if (global.ottSearchCache.has(searchCacheKey)) {
        return NextResponse.json({
          success: true,
          type: "ott",
          results: global.ottSearchCache.get(searchCacheKey),
        });
      }

      // Query TMDB
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

      const getProviderLink = (providerName) => {
        const name = providerName.toLowerCase();
        if (name.includes("netflix")) return "https://www.netflix.com";
        if (name.includes("prime video") || name.includes("amazon")) return "https://www.primevideo.com";
        if (name.includes("disney") || name.includes("hotstar")) return "https://www.hotstar.com";
        if (name.includes("sony")) return "https://www.sonyliv.com";
        if (name.includes("zee")) return "https://www.zee5.com";
        if (name.includes("apple")) return "https://tv.apple.com";
        if (name.includes("jio")) return "https://www.jiocinema.com";
        return "";
      };

      const getProviderLabel = (providerName) => {
        const name = providerName.toLowerCase();
        if (name.includes("netflix")) return "Netflix";
        if (name.includes("prime video") || name.includes("amazon")) return "Amazon Prime Video";
        if (name.includes("disney") || name.includes("hotstar")) return "Disney+ Hotstar";
        if (name.includes("sony")) return "Sony LIV";
        if (name.includes("zee")) return "ZEE5";
        if (name.includes("apple")) return "Apple TV+";
        if (name.includes("jio")) return "JioCinema";
        return providerName;
      };

      const resultsWithProviders = await Promise.all(
        items.map(async (item) => {
          const providerCacheKey = `${item.media_type}-${item.id}`;
          if (global.ottProviderCache.has(providerCacheKey)) {
            const cachedItem = global.ottProviderCache.get(providerCacheKey);
            return {
              ...cachedItem,
              id: `tmdb-${item.media_type}-${item.id}`,
            };
          }

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
                    const cleanName = getProviderLabel(p.provider_name);
                    const cleanLink = getProviderLink(p.provider_name) || targetRegion.link || "https://google.com";
                    const logoUrl = p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null;
                    platforms.push({
                      name: cleanName,
                      logo: logoUrl,
                      link: cleanLink
                    });
                  }
                }
              }
            }
            
            const resItem = {
              id: `tmdb-${item.media_type}-${item.id}`,
              title: item.title || item.name,
              category: item.media_type === "movie" ? "Movie" : "TV Show",
              location: platforms.length > 0 ? platforms.map(p => p.name).join(", ") : "Currently not available on any OTT platform",
              image: item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
              type: "ott",
              platforms: platforms,
              rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
              releaseDate: item.release_date || item.first_air_date || "",
              description: item.overview || "",
            };

            global.ottProviderCache.set(providerCacheKey, resItem);
            return resItem;
          } catch (err) {
            console.error(`Error fetching providers for tmdb ${item.id}:`, err);
            return {
              id: `tmdb-${item.media_type}-${item.id}`,
              title: item.title || item.name,
              category: item.media_type === "movie" ? "Movie" : "TV Show",
              location: "Currently not available on any OTT platform",
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

      global.ottSearchCache.set(searchCacheKey, resultsWithProviders);

      return NextResponse.json({
        success: true,
        type: "ott",
        results: resultsWithProviders,
      });
    }

    // Default: Search local database events (when OTT search is disabled)
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

    return NextResponse.json({
      success: true,
      type: "db",
      results: localDbEvents,
    });

  } catch (error) {
    console.error("[/api/ott/search] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
