"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ProcessStep } from "./ProcessStep";
import { ProcessProgress } from "./ProcessProgress";

const STEPS = ["1", "2", "3", "4"] as const;

/**
 * Sticky-scroll narrative orchestrator. Tracks the section's `scrollYProgress`
 * and hands it to the side progress indicator. Each `ProcessStep` independently
 * computes its own scroll-driven opacity + scale from its own ref.
 *
 * Desktop (lg+): two-column grid — sticky progress indicator left, sticky-
 * narrative steps right. Mobile: single column, steps stack and each step
 * still individually sticks at `top-32` (cheaper visual that still feels right).
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-20"
    >
      <aside
        className="hidden lg:block"
        aria-hidden
      >
        <div className="sticky top-32">
          <ProcessProgress
            scrollYProgress={scrollYProgress}
            total={STEPS.length}
          />
        </div>
      </aside>

      <ol className="flex flex-col">
        {STEPS.map((stepKey, idx) => (
          <ProcessStep
            key={stepKey}
            stepKey={stepKey}
            index={idx}
            total={STEPS.length}
          />
        ))}
      </ol>
    </div>
  );
}
