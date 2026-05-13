"use client";

import { Fragment } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Auto-scrolling marquee row. CSS-keyframes (defined in globals.css under
 * `@theme`) for GPU-friendly perf — no JS frame ticks.
 *
 * Tiles render as HTML pill labels per design (kit.css `.tile`): 64px tall,
 * 168px min-width, 28px horizontal padding, rounded-full, hairline border,
 * mono 12px uppercase tracking-[0.2em].
 *
 * Seamless loop achieved by duplicating the tile sequence and translating
 * by -50% over the animation cycle. With identical halves, the wrap is
 * invisible.
 *
 * direction="left"  → tiles scroll right-to-left.
 * direction="right" → tiles scroll left-to-right.
 *
 * Reduced-motion path: animation disabled, single (non-duplicated) row,
 * tiles wrap with flex-wrap. Section still communicates content with zero
 * movement.
 */
export function Marquee({
  tiles,
  direction,
  ariaLabel,
}: {
  tiles: readonly string[];
  direction: "left" | "right";
  ariaLabel: string;
}) {
  const reduced = usePrefersReducedMotion();

  const tileClass = cn(
    "shrink-0 inline-flex items-center justify-center",
    "h-16 min-w-[168px] px-7",
    "rounded-full border border-border",
    "bg-bg-elevated/60",
    "font-mono text-xs tracking-[0.2em] uppercase text-fg-muted",
  );

  if (reduced) {
    return (
      <ul
        role="list"
        aria-label={ariaLabel}
        className="flex flex-wrap items-center gap-4 py-2"
      >
        {tiles.map((label, idx) => (
          <li key={`${label}-${idx}`} className={tileClass}>
            {label}
          </li>
        ))}
      </ul>
    );
  }

  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-hidden">
      <ul
        role="list"
        aria-label={ariaLabel}
        className={cn(
          "flex w-max items-center gap-4 py-2",
          animClass,
          "will-change-transform",
        )}
      >
        {/* Duplicate the sequence so the -50% translate produces a seamless loop */}
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {tiles.map((label, idx) => (
              <li
                key={`${dup}-${label}-${idx}`}
                aria-hidden={dup === 1 ? true : undefined}
                className={tileClass}
              >
                {label}
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
