import { NextResponse } from 'next/server';
import { db } from "@/db/index";
import { events as eventsTable } from "@/db/schema";

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, location } = body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Missing or empty query' }, { status: 400 });
    }
    const trimmedQuery = query.trim();

    // Query events from Drizzle DB
    const dbEvents = await db.select().from(eventsTable);

    const eventsSummary = dbEvents
      .map((e) => '- ' + e.title + ' (' + e.category + ', ' + e.location + ', Rs.' + (e.price ? (e.price / 100).toFixed(0) : '0') + ')')
      .join('\n');
    const locationContext = location ? 'The user is near ' + location + '.' : '';
    const prompt = 'You are a smart event and travel booking assistant for an Indian platform.\n' + locationContext + '\n\nAvailable events:\n' + eventsSummary + '\n\nUser searched: ' + trimmedQuery + '\n\nGenerate exactly 5 short search suggestions (Google autocomplete style) based on what the user might be looking for.\nEach suggestion must start with a relevant emoji.\nRespond ONLY with a valid JSON array of 5 strings. No explanation, no code fences.';
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = generateLocalSuggestions(trimmedQuery, dbEvents, location);
      return NextResponse.json({ suggestions: fallback, source: 'local' });
    }
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
      }),
    });
    if (!geminiResponse.ok) {
      const fallback = generateLocalSuggestions(trimmedQuery, dbEvents, location);
      return NextResponse.json({ suggestions: fallback, source: 'local' });
    }
    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    let suggestions = [];
    try {
      const cleaned = rawText.replace(/\\json|\\/g, '').trim();
      suggestions = JSON.parse(cleaned);
      if (!Array.isArray(suggestions)) suggestions = [];
      suggestions = suggestions.filter((s) => typeof s === 'string').slice(0, 5);
    } catch (_) {
      suggestions = generateLocalSuggestions(trimmedQuery, dbEvents, location);
    }
    if (suggestions.length === 0) {
      suggestions = generateLocalSuggestions(trimmedQuery, dbEvents, location);
    }
    return NextResponse.json({ suggestions, source: 'gemini' });
  } catch (err) {
    console.error('AI Search API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateLocalSuggestions(query, events, location) {
  const q = query.toLowerCase();
  const results = [];
  const titleMatches = events.filter((e) =>
    (e.title || '').toLowerCase().includes(q) ||
    (e.category || '').toLowerCase().includes(q) ||
    (e.organizer && e.organizer.toLowerCase().includes(q)) ||
    (e.location && e.location.toLowerCase().includes(q))
  );
  for (const e of titleMatches.slice(0, 3)) {
    results.push(categoryEmoji(e.category) + ' ' + e.title);
  }
  if (q.includes('music') || q.includes('concert') || q.includes('live')) {
    results.push('\uD83C\uDFB5 Live concerts this weekend');
    results.push('\uD83C\uDFA4 Top music artists near you');
  }
  if (q.includes('comedy') || q.includes('laugh') || q.includes('stand')) {
    results.push('\uD83D\uDE02 Stand-up comedy shows');
    results.push('\uD83C\uDFAD Comedy nights in your city');
  }
  if (location) results.push('\uD83D\uDCCD Events near ' + location);
  const generics = [
    '\u2728 Trending events this week',
    '\uD83D\uDD25 Hot picks near you',
    '\uD83C\uDF89 Upcoming events for you',
    '\uD83C\uDFC6 Top rated experiences',
    '\uD83C\uDFAB All events and shows'
  ];
  for (const g of generics) {
    if (results.length >= 5) break;
    results.push(g);
  }
  return [...new Set(results)].slice(0, 5);
}

function categoryEmoji(category) {
  const map = {
    music: '\uD83C\uDFB5',
    comedy: '\uD83D\uDE02',
    sports: '\uD83C\uDFC6',
    food: '\uD83C\uDF5C',
    dance: '\uD83D\uDC83',
    drama: '\uD83C\uDFAD',
    games: '\uD83C\uDFAE',
    movie: '\uD83C\uDFAC',
    travel: '\u2708\uFE0F',
  };
  return map[category?.toLowerCase()] || '\uD83C\uDFAB';
}