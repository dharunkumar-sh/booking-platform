"use client";

import React from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function MoodsPage() {
  return (
    <OttExplorerPage
      pageTitle="AI Mood Based Streaming Picks"
      pageSubtitle="Select your vibe and let our AI engine match you with the perfect movie or binge series for tonight."
      initialFilter="all"
      showMoodFilters={true}
    />
  );
}
