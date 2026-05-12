"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Vertical progress bar for the Process timeline.
 *
 * Track: 2px wide, 240px tall, bg-border. Fill: bg-accent, height tracks
 * the parent's scrollYProgress via useTransform. CSS `transition: height
 * 0.3s var(--ease-spring)` smooths the visual update; reduced-motion's
 * 0.001ms clamp causes the fill to snap instead of ease (passive indicator,
 * not an animation — no separate reduced-motion code path required).
 *
 * Desktop-only — hidden on mobile via the parent's `hidden lg:block`.
 */
export function ProcessProgress({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative w-[2px] h-60 bg-border">
      <motion.div
        className="absolute inset-x-0 top-0 bg-accent will-change-[height]"
        style={{
          height: fillHeight,
          transition: "height 0.3s var(--ease-spring)",
        }}
      />
    </div>
  );
}
