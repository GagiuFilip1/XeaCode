"use client";

import type { MotionValue } from "framer-motion";
import { HeroCanvasScene } from "./HeroCanvasScene";

// Inward radial mask — identical to HeroCanvasScene's INWARD_MASK and to the
// dot-grid mask in HeroBackdrop. All three layers fade at the same ellipse.
const INWARD_MASK =
  "radial-gradient(ellipse 80% 55% at 60% 45%, black 30%, transparent 85%)";

const END_FRAME = "/hero-end-frame.webp";

/**
 * HeroScrollScene — the backdrop scene layer of the Hero section.
 *
 * Phase 5: this component is now a pure switch driven by whether or not its
 * parent passes a `scrollYProgress` MotionValue:
 *
 *   - scrollYProgress provided -> render <HeroCanvasScene scrollYProgress={...} />.
 *     The scroll-scrubbed canvas branch. Used by HeroScrollLocked (Phase 5
 *     sticky path) when desktop + fine-pointer + no-reduced-motion.
 *
 *   - scrollYProgress undefined -> render <HeroStaticBackdrop />.
 *     The static <img> end-frame branch. Used by HeroStatic (Phase 5 static
 *     path) for SSR, mobile / coarse-pointer, and prefers-reduced-motion.
 *
 * The Phase-4 mounted-gate + `useStatic` decision is GONE from this file —
 * it moved up to `HeroContent.tsx`, which is what decides whether to render
 * `HeroStatic` (no scrollYProgress) or `HeroScrollLocked` (with scrollYProgress).
 * `HeroScrollScene` now never has to second-guess its parent.
 *
 * Both `HeroCanvasScene` and `HeroStaticBackdrop` paint into the same
 * absolute-fill wrapper with the same INWARD_MASK and the same light-theme
 * `opacity-40` dimming, so swapping between them is visually a no-op on the
 * outer container's box.
 */
export function HeroScrollScene({
  scrollYProgress,
  firstAnimationComplete,
}: {
  scrollYProgress?: MotionValue<number>;
  firstAnimationComplete?: boolean;
}) {
  if (scrollYProgress) {
    return (
      <HeroCanvasScene
        scrollYProgress={scrollYProgress}
        firstAnimationComplete={firstAnimationComplete}
      />
    );
  }
  return <HeroStaticBackdrop />;
}

/**
 * Static fallback — SSR + first paint, coarse pointer, or reduced motion.
 * No canvas, no scroll listener, no frame array, no `useScroll`. Single WebP.
 *
 * Lives in this file (vs. its own file) because it's tightly paired with the
 * branching decision above — both branches share the same outer wrapper
 * (absolute inset-0, inward mask, light:opacity-40). Extracting it would only
 * duplicate the wrapper plumbing.
 */
function HeroStaticBackdrop() {
  return (
    <div
      aria-hidden
      // light:opacity-40 — the source asset has a dark navy backdrop that fights
      // the warm off-white page bg on light theme. Dimming to 40% lets the scene
      // remain present as a subtle suggestion while restoring text contrast.
      className="absolute inset-0 pointer-events-none light:opacity-40"
      style={{
        maskImage: INWARD_MASK,
        WebkitMaskImage: INWARD_MASK,
      }}
    >
      {/*
       * Plain <img> not next/image: the asset is decorative + below-the-fold
       * content stays prioritized as LCP. eager + async-decoding so the
       * image arrives quickly without blocking text paint. fetchpriority
       * "low" so the headline + CTAs still win the network priority race.
       */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={END_FRAME}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}
