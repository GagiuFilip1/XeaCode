"use client";

import { useSyncExternalStore } from "react";
import type { Transition } from "framer-motion";

/**
 * Shared spring config — taste-skill MOTION_INTENSITY=7.
 * "Premium, weighty, never linear." Used by every motion surface
 * (magnetic CTAs, stagger reveals, mobile menu, etc.).
 */
export const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
};

/** Slightly snappier spring for hover-tracking effects. */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 22,
  mass: 0.6,
};

/**
 * Subscribe to a media query without triggering React's
 * "setState inside useEffect" lint (uses useSyncExternalStore, the
 * canonical React 19 pattern for external subscriptions).
 *
 * SSR returns `ssrFallback` — pick the value that produces the most
 * motion-friendly initial render so animations don't get blocked on
 * server. The client snapshot reconciles immediately on mount.
 */
function useMediaQuery(query: string, ssrFallback: boolean): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => ssrFallback,
  );
}

/**
 * Detect reduced-motion preference. Returns false during SSR (motion-friendly
 * default), reconciles on client mount. Use this to render no-motion fallback
 * branches for every animated component.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/**
 * Detect coarse-pointer devices (touch). Used to disable hover-only effects
 * like the magnetic-cursor pull, which kills mobile scroll performance.
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)", false);
}
