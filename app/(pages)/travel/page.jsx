"use client";

import React from "react";
import DiscoverCategoryPage from "@/components/DiscoverCategoryPage";
import { Compass } from "lucide-react";

export default function TravelPage() {
  return (
    <DiscoverCategoryPage
      title="Travel & Excursions"
      subtitle="Book weekend getaways, heritage walking tours, camping trails, and adventure retreats."
      category="travel"
      badgeText="Wanderlust Vibes"
      icon={Compass}
      heroGradient="from-cyan-500/20 via-neutral-950 to-blue-500/20"
    />
  );
}
