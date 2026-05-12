import { useTranslations } from "next-intl";
import { HeroBackdrop } from "./hero/HeroBackdrop";
import { HeroHeadline } from "./hero/HeroHeadline";
import { HeroCTA } from "./hero/HeroCTA";

/**
 * Hero — the design-vocabulary section.
 *
 * Layout: asymmetric left-aligned (taste-skill DESIGN_VARIANCE=6 bans centered).
 * Text occupies ~55% column at lg+; right column is the "asset zone" where the
 * mesh gradient anchors. Mobile collapses to single column per taste-skill rule.
 *
 * Viewport: `min-h-[100dvh]` — never `h-screen` (iOS Safari trap).
 *
 * RSC. The animated/interactive bits (backdrop drift, headline reveal,
 * magnetic CTAs, paw easter egg) live in dedicated client leaves.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <HeroBackdrop />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28 min-h-[100dvh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,58%)_1fr] gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 md:gap-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent">
              {t("eyebrow")}
            </span>

            <HeroHeadline text={t("headline")} />

            <p className="max-w-[55ch] text-base md:text-lg leading-relaxed text-fg-muted">
              {t("subtitle")}
            </p>

            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-fg-subtle max-w-[60ch]">
              {t("trustStrip")}
            </p>

            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <HeroCTA href="#contact" variant="primary">
                {t("ctaPrimary")}
              </HeroCTA>
              <HeroCTA href="#process" variant="secondary">
                {t("ctaSecondary")}
              </HeroCTA>
            </div>
          </div>

          {/* Right column is intentionally empty — the mesh gradient + paw
              occupy the visual real estate. This is the asymmetric "asset zone"
              per taste-skill section 8 (Hero Paradigm). */}
          <div aria-hidden className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
