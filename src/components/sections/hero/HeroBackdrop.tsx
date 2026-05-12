"use client";

import type { MotionValue } from "framer-motion";
import { HeroScrollScene } from "./HeroScrollScene";

/**
 * Hero backdrop — three layers, bottom-to-top:
 *
 *   1. HeroScrollScene — canvas (when scrollYProgress provided) or static <img>
 *      end-frame (when omitted). Inward-masked.
 *   2. Dot-grid pattern — CSS-only, inward-masked with the same ellipse so it
 *      composites cleanly with the scene at the edges.
 *   3. Bottom fade — gradient from --bg to transparent so the Hero transitions
 *      cleanly to Services below.
 *
 * PHASE 5: promoted from RSC to Client. The promotion is required because
 * `MotionValue<number>` (Framer's reactive value primitive) is a Client-only
 * construct and cannot be passed through an RSC component as a prop. The
 * three child layers' content is unchanged; only the surrounding component's
 * directive changes from "default" (RSC) to `"use client"`.
 *
 * Two call sites:
 *   - HeroStatic         -> <HeroBackdrop />                                static path
 *   - HeroScrollLocked   -> <HeroBackdrop scrollYProgress={scrollYProgress} /> canvas path
 *
 * The `scrollYProgress` prop is FORWARDED to HeroScrollScene, which uses it
 * to decide between rendering the canvas branch (HeroCanvasScene) and the
 * static branch (HeroStaticBackdrop).
 *
 * Phase 4 history: three Framer-Motion blob drifts lived here pre-Phase-4.
 * Phase 4 removed them in favor of the scroll-scrubbed canvas (also quietly
 * closing the suspected Phase 3 Turbopack memory blowup vector — see
 * .claude/docs/lessons.md "Turbopack leaks past any V8 cap").
 */
export function HeroBackdrop({
  scrollYProgress,
  firstAnimationComplete,
}: {
  scrollYProgress?: MotionValue<number>;
  firstAnimationComplete?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* z=0 — scroll-scrubbed canvas (or static <img> fallback) */}
      <HeroScrollScene
        scrollYProgress={scrollYProgress}
        firstAnimationComplete={firstAnimationComplete}
      />

      {/* z=1 — dot grid pattern, same inward-mask ellipse as the scene */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-fg-subtle) 0.8px, transparent 1.4px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 55% at 60% 45%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 55% at 60% 45%, black 30%, transparent 85%)",
        }}
      />

      {/* z=2 — bottom fade for section transition */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
    </div>
  );
}
