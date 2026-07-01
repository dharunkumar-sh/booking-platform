"use client";

import React from "react";
import DiscoverCategoryPage from "@/components/DiscoverCategoryPage";
import { Smile } from "lucide-react";

export default function ComedyPage() {
  return (
    <DiscoverCategoryPage
      title="Standup Comedy Nights"
      subtitle="Catch top comedians testing new material and national touring specials live."
      category="comedy"
      badgeText="Laugh Out Loud"
      icon={Smile}
      heroGradient="from-yellow-500/20 via-neutral-950 to-orange-500/20"
    />
  );
}
