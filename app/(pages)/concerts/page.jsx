"use client";

import React from "react";
import DiscoverCategoryPage from "@/components/DiscoverCategoryPage";
import { Music } from "lucide-react";

export default function ConcertsPage() {
  return (
    <DiscoverCategoryPage
      title="Live Music Concerts"
      subtitle="Feel the bass at stadium tours, acoustic intimate sets, and EDM festivals."
      category="music"
      badgeText="Stage & Acoustics"
      icon={Music}
      heroGradient="from-purple-500/20 via-neutral-950 to-pink-500/20"
    />
  );
}
