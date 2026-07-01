"use client";

import React from "react";
import DiscoverCategoryPage from "@/components/DiscoverCategoryPage";
import { Sparkles } from "lucide-react";

export default function LiveEventsPage() {
  return (
    <DiscoverCategoryPage
      title="All Live Events"
      subtitle="Discover workshops, art galleries, nightlife gatherings, and seasonal fests near you."
      category="all"
      badgeText="Live Community Vibes"
      icon={Sparkles}
      heroGradient="from-orange-500/20 via-neutral-950 to-rose-500/20"
    />
  );
}
