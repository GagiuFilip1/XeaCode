import { useTranslations } from "next-intl";
import { WorkRows } from "./work/WorkRows";

/**
 * Selected Work — 3 anonymized engagement entries.
 *
 * RSC shell: section header + container. The animated rows live in
 * `WorkRows` (Client leaf) for stagger-reveal orchestration — same pattern
 * as `ServicesGrid` / `Services`.
 *
 * Layout: NOT a card grid. Single column at every breakpoint — large
 * typography rows separated by hairline rules, reading like a reading list
 * rather than a gallery. Deliberate visual contrast with the Services 2×2.
 */
export function SelectedWork() {
  const t = useTranslations("work");

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 md:mb-20 max-w-3xl">
          <h2
            id="work-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
            {t("subtitle")}
          </p>
        </header>

        <WorkRows />
      </div>
    </section>
  );
}
