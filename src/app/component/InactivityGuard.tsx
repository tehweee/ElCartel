"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 15 minutes in milliseconds
const INACTIVITY_LIMIT = 15 * 60 * 1000;

// Events that count as "user is active"
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;

export default function InactivityGuard() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        // Session timed out — call logout endpoint, then redirect
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // Best-effort; redirect regardless
        }
        router.replace("/login");
      }, INACTIVITY_LIMIT);
    }

    // Start the timer immediately
    resetTimer();

    // Attach all activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);

  // Renders nothing — purely behavioural
  return null;
}
