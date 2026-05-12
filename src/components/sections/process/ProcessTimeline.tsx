"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ProcessStep } from "./ProcessStep";
import { ProcessProgress } from "./ProcessProgress";

const STEPS = ["1", "2", "3", "4"] as const;

/**
 * Process timeline body.
 *
 * Layout: at lg+, two columns — sticky progress bar (left, hidden on mobile)
 * + a vertical hairline-divided list of steps (right). The section's
 * `scrollYProgress` drives the progress-bar fill height.
 *
 * The old per-step sticky-scroll narrative is gone; steps are plain <li>s.
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
      className="relative grid grid-cols-1 min-[980px]:grid-cols-[auto_1fr] gap-8 min-[980px]:gap-20"
    >
      <aside className="hidden min-[980px]:block" aria-hidden>
        <div className="sticky top-32">
          <ProcessProgress scrollYProgress={scrollYProgress} />
        </div>
      </aside>

      <ol className="flex flex-col divide-y divide-border">
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
