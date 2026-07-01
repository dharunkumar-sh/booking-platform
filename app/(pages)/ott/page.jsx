"use client";

import React, { Suspense } from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function BrowseOttPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OttExplorerPage
        pageTitle="Browse OTT Streaming Platforms"
        pageSubtitle="Discover where to watch the hottest series and digital premieres across Netflix, Prime Video, Disney+, Hotstar, and Apple TV+."
        initialFilter="all"
      />
    </Suspense>
  );
}
