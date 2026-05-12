"use client";

import { useTranslations } from "next-intl";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroHeadline } from "./HeroHeadline";
import { HeroCTA } from "./HeroCTA";
import { HeroDiscoverButton } from "./HeroDiscoverButton";

/**
 * HeroStatic — the static (non-sticky) Hero layout, used for:
 *
 *   - SSR + first paint (before the mounted gate flips in HeroContent)
 *   - Coarse-pointer / touch devices (mobile)
 *   - prefers-reduced-motion users (any pointer)
 *
 * Layout:
 *   - min-h-[100dvh] (NO 300/500vh budget — static path has no scroll lock)
 *   - asymmetric two-column grid (58%/1fr) at min-[980px]
 *   - left col: eyebrow + headline + Discover button (always visible here)
 *   - right col: lead + trust strip + two CTAs
 *   - all text visible immediately, no scroll-driven reveals
 *
 * Phase 6 iteration:
 *   - <HeroDiscoverButton /> mounts inside the left column under the headline
 *     (matches the user's annotation; same placement as the scroll-locked
 *     path). On the static path it's always visible since there's no scroll
 *     budget to fade against. Click still tweens (or instant-jumps for
 *     reduced-motion) the page to #services.
 *   - Right-column scrim strengthened to bg-bg/85 + blur-3xl with extended
 *     bounds + saturation reduction. The Phase-6 source clip has a bright
 *     emerald wireframe peak; the previous bg-bg/55 + blur-2xl scrim left
 *     text-fg-muted barely readable when the static end-frame was viewed.
 *
 * The static path keeps Phase 5's cadence of 4 visible elements (eyebrow,
 * lead, trust strip, CTAs). Capability strip + quality marker are
 * intentionally NOT shown here — they only make sense in the scroll-locked
 * path's staged reveal; showing them statically would clutter.
 */
export function HeroStatic() {
  const t = useTranslations("hero");

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-none 2xl:mx-0 2xl:px-[8vw] pt-28 pb-20 md:pt-36 md:pb-28 min-h-[100dvh] flex flex-col justify-center">
        <div className="grid grid-cols-1 min-[980px]:grid-cols-[minmax(0,58%)_1fr] gap-10 min-[980px]:gap-16 items-center">
          <div className="flex flex-col gap-6 md:gap-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent">
              {t("eyebrow")}
            </span>
            <HeroHeadline text={t("headline")} />
            <HeroDiscoverButton />
          </div>

          <div
            className="
              relative flex flex-col gap-6 md:gap-8
              min-[980px]:ml-24 lg:ml-32 xl:ml-40
              before:absolute before:-inset-y-6 before:-inset-x-8 md:before:-inset-x-10
              before:rounded-3xl before:bg-bg/85
              before:pointer-events-none before:-z-10
            "
          >
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
              <HeroCTA href="#work" variant="secondary">
                {t("ctaSecondary")}
              </HeroCTA>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
