"use client";

import type { MotionValue } from "framer-motion";
import { HeroCanvasScene } from "./HeroCanvasScene";
import { INWARD_MASK } from "./hero-mask";

const END_FRAME = "/hero-end-frame.webp";

/**
 * Hero backdrop — three layers, bottom-to-top:
 *
 *   1. Scene — canvas (when scrollYProgress provided) or static <img>
 *      end-frame (when omitted). Inward-masked.
 *   2. Dot-grid pattern — CSS-only, inward-masked with the same ellipse so it
 *      composites cleanly with the scene at the edges.
 *   3. Bottom fade — gradient from --bg to transparent so the Hero transitions
 *      cleanly to Services below.
 *
 * Client component because `MotionValue<number>` (Framer's reactive value
 * primitive) is a Client-only construct and can't be passed through an RSC
 * component as a prop. Both call sites:
 *   - HeroStatic        → <HeroBackdrop />                              static path
 *   - HeroScrollLocked  → <HeroBackdrop scrollYProgress={…} …/>        canvas path
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
      {scrollYProgress ? (
        <HeroCanvasScene
          scrollYProgress={scrollYProgress}
          firstAnimationComplete={firstAnimationComplete}
        />
      ) : (
        <HeroStaticBackdrop />
      )}

      {/* z=1 — dot grid pattern, same inward-mask ellipse as the scene */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-fg-subtle) 0.8px, transparent 1.4px)",
          backgroundSize: "32px 32px",
          maskImage: INWARD_MASK,
          WebkitMaskImage: INWARD_MASK,
        }}
      />

      {/* z=2 — bottom fade for section transition */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
    </div>
  );
}

/**
 * Static fallback — SSR + first paint, coarse pointer, or reduced motion.
 * No canvas, no scroll listener, no frame array. Single decorative WebP.
 *
 * light:opacity-40 dims the dark source asset so it doesn't fight the warm
 * off-white page bg on light theme, while still suggesting the scene.
 */
function HeroStaticBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none light:opacity-40"
      style={{
        maskImage: INWARD_MASK,
        WebkitMaskImage: INWARD_MASK,
      }}
    >
      {/* Decorative — plain <img> so the headline + CTAs win LCP priority. */}
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
