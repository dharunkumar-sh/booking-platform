"use client";

import { createContext, useContext, useEffect } from "react";

const AutoRefreshContext = createContext(null);

export function AutoRefreshProvider({ children }) {
  useEffect(() => {
    let eventSource;

    function connect() {
      eventSource = new EventSource("/api/db-changes");

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "refresh") {
            console.log("[AutoRefresh] Database change detected, dispatching db-update event");
            window.dispatchEvent(new CustomEvent("db-update"));
          }
        } catch (e) {
          console.error("[AutoRefresh] Error parsing SSE message:", e);
        }
      };

      eventSource.onerror = (err) => {
        console.error("[AutoRefresh] EventSource failed, attempting reconnect in 5s...", err);
        eventSource.close();
        setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <AutoRefreshContext.Provider value={null}>
      {children}
    </AutoRefreshContext.Provider>
  );
}

export function useAutoRefreshContext() {
  return useContext(AutoRefreshContext);
}
