"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * One step of the Process timeline.
 *
 * Each step container is `min-h-[80vh]` — that's the scroll real estate the
 * step gets before the next one takes over. The step's content uses
 * `lg:sticky lg:top-32` so it stays visible at the top of the viewport while
 * the user scrolls through its container's range.
 *
 * Opacity + scale fade at the entry/exit boundaries are driven by Framer's
 * `useScroll` + `useTransform` — `transform`/`opacity` only (rule §motion).
 * Reduced-motion path renders the step at identity transforms with no fade.
 */
export function ProcessStep({
  stepKey,
  index,
  total,
}: {
  stepKey: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale-only depth cue. Opacity-fade was tempting but composited the
  // off-screen step text below WCAG 4.5:1 contrast — Lighthouse measures
  // all rendered elements regardless of viewport. The subtle scale shift
  // is enough to communicate "this step is the focus" with the sticky
  // positioning doing most of the heavy lifting.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.96, 1, 1, 0.96],
  );

  const t = useTranslations("process");

  const stepNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(total).padStart(2, "0");

  return (
    <li
      ref={ref}
      className="relative min-h-[80vh] flex items-center list-none"
    >
      <motion.div
        style={reduced ? undefined : { scale }}
        className={cn(
          "lg:sticky lg:top-32",
          "w-full max-w-2xl",
          "will-change-transform",
        )}
      >
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
            {stepNumber}
          </span>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-fg-subtle">
            / {totalNumber}
          </span>
        </div>

        <p className="text-xs font-mono uppercase tracking-[0.2em] text-fg-subtle max-w-[55ch] mb-6">
          {t(`${stepKey}.deliverable`)}
        </p>

        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tighter leading-[0.95] text-fg mb-6">
          {t(`${stepKey}.title`)}
        </h3>

        <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
          {t(`${stepKey}.description`)}
        </p>
      </motion.div>
    </li>
  );
}
