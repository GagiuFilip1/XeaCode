import { useTranslations } from "next-intl";
import { ProcessTimeline } from "./process/ProcessTimeline";

/**
 * Process — 4-step sequential timeline with sticky-scroll narrative.
 *
 * RSC shell: section header + container. The sticky-scroll orchestration
 * + per-step transforms + side progress indicator live in Client leaves
 * (`ProcessTimeline`, `ProcessStep`, `ProcessProgress`).
 *
 * Sticky positioning uses `top-32` (8rem) to clear the 4rem sticky Header
 * with breathing room. NEVER `h-screen` for the section root.
 */
export function Process() {
  const t = useTranslations("process");

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="scroll-mt-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 md:mb-24 max-w-3xl">
          <h2
            id="process-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
            {t("subtitle")}
          </p>
        </header>

        <ProcessTimeline />
      </div>
    </section>
  );
}
