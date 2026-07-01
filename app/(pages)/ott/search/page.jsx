"use client";

import React, { Suspense } from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function OttSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OttExplorerPage
        pageTitle="Cross-OTT Universal Search"
        pageSubtitle="Stop switching apps. Search across Netflix, Prime, Hotstar, JioCinema, and Apple TV simultaneously."
        initialFilter="all"
      />
    </Suspense>
  );
}
