import { HeroContent } from "./hero/HeroContent";

/**
 * Hero — thin RSC shell. Renders the section element + delegates layout +
 * interaction to <HeroContent />, a Client component that branches between
 * <HeroStatic /> (SSR / mobile / reduced-motion) and <HeroScrollLocked />
 * (desktop sticky-pin with progressive text reveals).
 *
 * Section is purely structural:
 *   - id="hero" — anchor target for in-page links + Header active-section sync.
 *   - aria-labelledby="hero-headline" — the headline <h1> inside HeroHeadline
 *     carries the matching id; screen readers announce the section by name.
 *   - className="relative" — positioning context for the inner wrappers.
 *
 * Section height is determined by whichever child branch renders.
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
