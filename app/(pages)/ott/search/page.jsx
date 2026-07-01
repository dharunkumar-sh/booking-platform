"use client";

import React from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function OttSearchPage() {
  return (
    <OttExplorerPage
      pageTitle="Cross-OTT Universal Search"
      pageSubtitle="Stop switching apps. Search across Netflix, Prime, Hotstar, JioCinema, and Apple TV simultaneously."
      initialFilter="all"
    />
  );
}
