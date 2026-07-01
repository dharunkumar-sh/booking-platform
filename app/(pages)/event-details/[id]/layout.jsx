"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

const EventDetailsLayout = ({ children }) => {
  const params = useParams();

  useEffect(() => {
    try {
      const data = localStorage.getItem("selectedEvent");
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed?.title) {
          document.title = `${parsed.title} - VibePass`;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

  return <>{children}</>;
};

export default EventDetailsLayout;