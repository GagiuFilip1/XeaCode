"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion, useCoarsePointer } from "@/lib/motion";
import { HeroStatic } from "./HeroStatic";
import { HeroScrollLocked } from "./HeroScrollLocked";

/**
 * Branches between the sticky-locked Hero and the static Hero based on:
 *   - useStatic = prefers-reduced-motion OR coarse-pointer (touch / mobile)
 *   - mounted   = post-hydration safety gate (SSR-safe default branch)
 *
 * SSR + first paint always render <HeroStatic /> — the universally safe
 * fallback. Post-hydration, capable clients (mounted && !useStatic) swap to
 * <HeroScrollLocked />.
 *
 * `usePrefersReducedMotion` and `useCoarsePointer` return false on SSR
 * (motion-friendly default per src/lib/motion.ts). Without the mounted gate,
 * SSR would emit the scroll-locked branch and the first client render on a
 * reduced-motion / mobile environment would swap it for the static branch —
 * causing a flash of empty scroll-locked content and a React 19 hydration
 * mismatch warning. Defaulting SSR + first paint to <HeroStatic /> avoids both.
 */
export function HeroContent() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const useStatic = reduced || coarse;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || useStatic) return <HeroStatic />;
  return <HeroScrollLocked />;
}
