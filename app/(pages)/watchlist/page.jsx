"use client";

import React from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function WatchlistPage() {
  return (
    <OttExplorerPage
      pageTitle="My Curated Watchlist"
      pageSubtitle="Your saved shows and AI bookmarks ready to stream when you have free time."
      initialFilter="all"
    />
  );
}
