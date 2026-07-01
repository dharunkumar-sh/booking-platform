"use client";

import React from "react";
import DiscoverCategoryPage from "@/components/DiscoverCategoryPage";
import { Film } from "lucide-react";

export default function MoviesPage() {
  return (
    <DiscoverCategoryPage
      title="Blockbuster Movies"
      subtitle="Book VIP recliners, IMAX passes, and premiere screenings across top multiplexes."
      category="movie"
      badgeText="Cinema & Screenings"
      icon={Film}
      heroGradient="from-amber-500/20 via-neutral-950 to-red-500/20"
    />
  );
}
