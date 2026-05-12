"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Vertical progress indicator for the Process timeline. Track + dot markers
 * are static, the fill height tracks the parent timeline's `scrollYProgress`.
 *
 * Desktop-only — hidden on mobile via the parent's `hidden lg:block`.
 */
export function ProcessProgress({
  scrollYProgress,
  total,
}: {
  scrollYProgress: MotionValue<number>;
  total: number;
}) {
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative w-[2px] h-72 bg-border-strong rounded-full">
      <motion.div
        className="absolute inset-x-0 top-0 bg-accent rounded-full will-change-[height]"
        style={{ height: fillHeight }}
      />

      {Array.from({ length: total }).map((_, i) => {
        const pos = total > 1 ? (i / (total - 1)) * 100 : 50;
        return (
          <div
            key={i}
            className={cn(
              "absolute -left-[5px]",
              "w-[12px] h-[12px] rounded-full",
              "border-2 border-bg",
              "bg-bg-elevated",
            )}
            style={{
              top: `${pos}%`,
              transform: "translateY(-50%)",
            }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
