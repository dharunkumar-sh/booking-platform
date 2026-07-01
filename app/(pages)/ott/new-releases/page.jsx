"use client";

import React from "react";
import OttExplorerPage from "@/components/OttExplorerPage";

export default function NewReleasesPage() {
  return (
    <OttExplorerPage
      pageTitle="Fresh OTT Releases This Week"
      pageSubtitle="Catch the newest web shows, direct-to-digital films, and exclusive Friday releases."
      initialFilter="prime"
    />
  );
}
