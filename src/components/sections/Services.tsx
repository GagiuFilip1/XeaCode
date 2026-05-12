import { useTranslations } from "next-intl";
import { ServicesGrid } from "./services/ServicesGrid";

/**
 * Services — 2×2 card grid (NEVER 3-col, taste-skill ban).
 *
 * RSC shell: section header + container. The animated grid + cards live in
 * a Client leaf (`ServicesGrid`) because stagger orchestration requires the
 * parent variants and child variants to share a Client Component tree.
 */
export function Services() {
  const t = useTranslations("services");

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 md:mb-20 max-w-3xl">
          <h2
            id="services-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
            {t("subtitle")}
          </p>
        </header>

        <ServicesGrid />
      </div>
    </section>
  );
}
