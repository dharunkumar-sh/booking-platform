"use client";

import React from "react";
import DiscoverCategoryPage from "@/components/DiscoverCategoryPage";
import { Trophy } from "lucide-react";

export default function SportsPage() {
  return (
    <DiscoverCategoryPage
      title="Live Sports & Matches"
      subtitle="Cheer for your favorite clubs at cricket derbies, football leagues, and marathon runs."
      category="sports"
      badgeText="Arena & Tournaments"
      icon={Trophy}
      heroGradient="from-emerald-500/20 via-neutral-950 to-teal-500/20"
    />
  );
}
