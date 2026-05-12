"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion, useCoarsePointer } from "@/lib/motion";
import { HeroStatic } from "./HeroStatic";
import { HeroScrollLocked } from "./HeroScrollLocked";

/**
 * HeroContent — branches between the Phase 5 sticky-locked Hero and the
 * Phase 4-equivalent static Hero based on:
 *
 *   - useStatic = prefers-reduced-motion OR coarse-pointer (touch / mobile)
 *   - mounted   = post-hydration safety gate (SSR-safe default branch)
 *
 * SSR + first paint always render <HeroStatic /> — the universally safe
 * fallback. Post-hydration, capable clients (mounted && !useStatic) swap to
 * <HeroScrollLocked />.
 *
 * Why the mounted gate exists (Phase 4 lesson, "RSC -> Client -> Client
 * subtree owns own refs"): `usePrefersReducedMotion` and `useCoarsePointer`
 * return `false` on SSR (the motion-friendly default per src/lib/motion.ts).
 * Without this gate, SSR would emit the scroll-locked branch and the first
 * client render on a reduced-motion / mobile environment would swap it for
 * the static branch — a flash of empty scroll-locked content (the canvas
 * hasn't loaded yet) and a potential React 19 hydration mismatch warning.
 * Defaulting SSR + first paint to <HeroStatic /> avoids both.
 *
 * Pattern identical to the Phase 4 mounted gate inside HeroScrollScene that
 * decided canvas-vs-static-img. Phase 5 lifts that decision up one level so
 * the whole layout (not just the backdrop) can branch.
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
