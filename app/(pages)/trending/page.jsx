"use client";

import React from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function TrendingPage() {
  return (
    <OttExplorerPage
      pageTitle="Trending Now Top 10"
      pageSubtitle="See what everyone is streaming right now across all major OTT platforms."
      initialFilter="netflix"
    />
  );
}
