"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] bg-error-container text-on-error-container py-2 px-4 text-center font-body-sm transition-transform duration-300",
        isOnline ? "-translate-y-full" : "translate-y-0"
      )}
      role="status"
      aria-live="polite"
      aria-hidden={isOnline}
    >
      You are offline. Some features may be unavailable.
    </div>
  );
}
