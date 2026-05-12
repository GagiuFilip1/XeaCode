"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Paw } from "@/components/icons/Paw";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero backdrop — three slow-drifting gradient blobs + dot-grid pattern + paw.
 *
 * Animation is transforms-only (no animating background-position; taste-skill
 * performance rule). Reduced-motion path: static blob positions, no animation.
 *
 * Memoized + isolated so the rest of the Hero re-renders don't restart drifts.
 */
function HeroBackdropImpl() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Blob 1 — emerald wash, anchored top-right (the "asset zone") */}
      <motion.div
        className="absolute h-[70vh] w-[70vw] rounded-full"
        style={{
          top: "-15%",
          right: "-20%",
          background:
            "radial-gradient(circle at center, oklch(0.66 0.13 165 / 0.22), transparent 65%)",
          willChange: "transform",
        }}
        animate={reduced ? undefined : { x: [0, 28, 0], y: [0, -18, 0] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Blob 2 — cool grey-blue mid */}
      <motion.div
        className="absolute h-[55vh] w-[55vw] rounded-full"
        style={{
          top: "30%",
          left: "5%",
          background:
            "radial-gradient(circle at center, oklch(0.50 0.10 250 / 0.14), transparent 70%)",
          willChange: "transform",
        }}
        animate={reduced ? undefined : { x: [0, -22, 0], y: [0, 22, 0] }}
        transition={{
          duration: 22,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* Blob 3 — second emerald accent bottom-left */}
      <motion.div
        className="absolute h-[45vh] w-[45vw] rounded-full"
        style={{
          bottom: "-10%",
          left: "-10%",
          background:
            "radial-gradient(circle at center, oklch(0.66 0.13 165 / 0.12), transparent 70%)",
          willChange: "transform",
        }}
        animate={reduced ? undefined : { x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{
          duration: 26,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
      />

      {/* Dot grid — CSS pattern, masked so it fades at edges */}
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

      {/* Paw easter egg #1 — sits in the right "asset zone" at a grid intersection.
          Hidden on mobile (right column collapses; placement breaks). */}
      <div className="absolute inset-0 hidden lg:block">
        <Paw className="absolute top-[32%] right-[18%] text-fg/40" />
      </div>

      {/* Bottom fade — softens the section transition to the next one */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
    </div>
  );
}

export const HeroBackdrop = memo(HeroBackdropImpl);
