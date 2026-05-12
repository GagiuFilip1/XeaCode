"use client";

import { Fragment } from "react";
import type { TechLogo } from "./logos";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

const TILE_W = 96;
const TILE_H = 40;

/**
 * Placeholder SVG tile — text rendered with `currentColor` so theme switching
 * works. When real brand SVGs land, replace this rendering with a name→SVG
 * mapping (see /public/logos/README.md for the swap procedure).
 */
function TextTile({ label, name }: { label: string; name: string }) {
  return (
    <svg
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      width={TILE_W}
      height={TILE_H}
      role="img"
      aria-label={name}
      className="block"
    >
      <text
        x={TILE_W / 2}
        y={TILE_H / 2 + 4}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="11"
        fontWeight="500"
        letterSpacing="0.04em"
        fill="currentColor"
      >
        {label}
      </text>
    </svg>
  );
}

/**
 * Auto-scrolling marquee row. CSS-keyframes (defined in globals.css under
 * `@theme`) for GPU-friendly perf — no JS frame ticks.
 *
 * Seamless loop achieved by duplicating the tile sequence and translating
 * by -50% over the animation cycle. With identical halves, the wrap is
 * invisible.
 *
 * `direction="left"` → tiles scroll right-to-left.
 * `direction="right"` → tiles scroll left-to-right.
 *
 * Reduced-motion path: animation disabled, single (non-duplicated) row,
 * tiles wrap with `flex-wrap` instead — section still communicates content
 * with zero movement.
 */
export function Marquee({
  tiles,
  direction,
}: {
  tiles: readonly TechLogo[];
  direction: "left" | "right";
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-2 text-fg-muted">
        {tiles.map((tile) => (
          <span key={tile.name} className="shrink-0">
            <TextTile label={tile.label} name={tile.name} />
          </span>
        ))}
      </div>
    );
  }

  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex w-max items-center gap-12 py-2 text-fg-muted",
          animClass,
          "will-change-transform",
        )}
      >
        {/* Duplicate the sequence so the -50% translate produces a seamless loop */}
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {tiles.map((tile) => (
              <span
                key={`${dup}-${tile.name}`}
                className="shrink-0 hover:text-fg transition-colors duration-200"
                aria-hidden={dup === 1 ? true : undefined}
              >
                <TextTile label={tile.label} name={tile.name} />
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
