"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

const EventDetailsLayout = ({ children }) => {
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      document.title = `${decodeURIComponent(params.id)} - VibePass`;
    }
  }, [params.id]);

  return <>{children}</>;
};

export default EventDetailsLayout;