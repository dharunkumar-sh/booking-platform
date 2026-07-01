"use client";

import React from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function BrowseOttPage() {
  return (
    <OttExplorerPage
      pageTitle="Browse OTT Streaming Platforms"
      pageSubtitle="Discover where to watch the hottest series and digital premieres across Netflix, Prime Video, Disney+, Hotstar, and Apple TV+."
      initialFilter="all"
    />
  );
}
