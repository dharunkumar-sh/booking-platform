"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

const EventDetailsLayout = ({ children }) => {
  const params = useParams();

  useEffect(() => {
    fetch(`/api/redis?key=selectedEvent`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data?.title) {
          document.title = `${res.data.title} - VibePass`;
        }
      })
      .catch((e) => console.error(e));
  }, [params.id]);

  return <>{children}</>;
};

export default EventDetailsLayout;