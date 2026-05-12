import { useTranslations } from "next-intl";
import { ProcessTimeline } from "./process/ProcessTimeline";

/**
 * Process — 4 plain stacked steps + sticky-side progress bar.
 *
 * Per design handoff: no per-step sticky-scroll narrative. Steps are simple
 * <li>s with hairline borders between them. A single 2px-wide, ~240px-tall
 * sticky progress bar on the left fills based on the section's
 * scrollYProgress (handled inside ProcessTimeline). Section background is
 * bg-elevated for alternating-section rhythm.
 *
 * RSC shell: section header + container. The progress motion value + steps
 * render inside `ProcessTimeline` (Client leaf).
 */
export function Process() {
  const t = useTranslations("process");

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="scroll-mt-20 py-[clamp(72px,11vw,128px)] bg-bg-elevated"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 md:mb-20 max-w-[56ch]">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent mb-4">
            {t("eyebrow")}
          </p>
          <h2
            id="process-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
        </header>

        <ProcessTimeline />
      </div>
    </section>
  );
}
