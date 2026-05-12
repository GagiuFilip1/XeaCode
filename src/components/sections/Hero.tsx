import { HeroContent } from "./hero/HeroContent";

/**
 * Hero — Phase 5 thin RSC shell.
 *
 * Renders the section element + delegates all layout + interaction to
 * <HeroContent />, which is a Client component that branches between
 * <HeroStatic /> (SSR / mobile / reduced-motion) and <HeroScrollLocked />
 * (desktop sticky-pin with progressive text reveals).
 *
 * The section is purely structural:
 *   - id="hero" — anchor target for in-page links + Header active-section sync.
 *   - aria-labelledby="hero-headline" — the headline <h1> inside HeroHeadline
 *     carries the matching id; screen readers announce the section by name.
 *   - className="relative" — required as the positioning context for the
 *     min-h-[300vh] wrapper inside HeroScrollLocked (sticky needs a non-static
 *     ancestor). Also harmless for HeroStatic.
 *
 * Phase 4 surface (eyebrow + headline + lead + trust + CTAs inline here) is
 * GONE — that content moved into HeroStatic and HeroScrollLocked. The
 * useTranslations("hero") call moved with it.
 *
 * Section height is determined by whichever child branch renders:
 *   - HeroStatic        -> inner div is min-h-[100dvh]
 *   - HeroScrollLocked  -> inner div is min-h-[300vh]
 * Both render <HeroBackdrop /> in their own wrapper; the section itself
 * carries no height.
 */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative"
    >
      <HeroContent />
    </section>
  );
}
