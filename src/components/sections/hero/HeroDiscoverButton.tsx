"use client";

import { useEffect, useRef } from "react";
import { motion, type Transition } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * "Discover" affordance below the Hero headline. Always visible. On click:
 *   1. Calls `onSkipToEnd` if provided (scroll-locked path) so the canvas +
 *      reveals fast-forward in parallel with the scroll tween.
 *   2. rAF-tweens window.scrollY to `#services` over 1200ms with easeOutCubic.
 *      Reduced-motion: instant `scrollTo`, no tween, no fast-forward.
 *   3. Cancels any in-flight tween from a prior click before starting a new
 *      one (avoids the double-click jitter race).
 *
 * Real `<button type="button">` — JS click for the rAF tween. Accessible
 * name comes from the visible text; icon is `aria-hidden`. Focus indicator
 * comes from the global `:focus-visible` rule in globals.css.
 */
export function HeroDiscoverButton({
  revealTransition,
  onSkipToEnd,
}: {
  revealTransition?: Transition;
  /**
   * Fired BEFORE the scroll-to-Services tween starts. The scroll-locked Hero
   * path uses it to fast-forward the canvas + reveals to their final state
   * in parallel with the scroll tween. Static path omits it.
   */
  onSkipToEnd?: () => void;
}) {
  const t = useTranslations("hero");
  const reduced = usePrefersReducedMotion();
  const tweenHandleRef = useRef<number | null>(null);

  // Cancel any in-flight tween on unmount.
  useEffect(() => {
    return () => {
      if (tweenHandleRef.current !== null) {
        cancelAnimationFrame(tweenHandleRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    onSkipToEnd?.();

    const services = document.getElementById("services");
    if (!services) return;
    const target = services.getBoundingClientRect().top + window.scrollY;

    if (reduced) {
      window.scrollTo({ top: target, behavior: "instant" });
      return;
    }

    // Cancel any in-flight tween from a prior click — otherwise a rapid
    // double-click runs two rAF loops fighting for the same scrollY.
    if (tweenHandleRef.current !== null) {
      cancelAnimationFrame(tweenHandleRef.current);
      tweenHandleRef.current = null;
    }

    // rAF tween, 1200ms, easeOutCubic. The smoothed progress (driven by
    // window scrollY through `useScroll`) chases the rapidly-changing scroll
    // position — the canvas + reveals visibly fast-forward during this window.
    const startY = window.scrollY;
    const distance = target - startY;
    const duration = 1200;
    const startTime = performance.now();
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
      if (progress < 1) {
        tweenHandleRef.current = requestAnimationFrame(tick);
      } else {
        tweenHandleRef.current = null;
      }
    };
    tweenHandleRef.current = requestAnimationFrame(tick);
  };

  const label = t("discover");

  // Default reveal transition if the parent didn't pass one (static path).
  const transition: Transition = revealTransition ?? {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1],
  };

  // Idle pulse: finite repeat (2 → 3 visible cycles). Disabled on reduced
  // motion. Phase 4 lesson: NEVER `repeat: Infinity`.
  const pulseAnimate = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, scale: [1, 1.06, 1] };
  const pulseTransition: Transition = reduced
    ? transition
    : {
        opacity: transition,
        y: transition,
        scale: { duration: 1.6, repeat: 2, ease: "easeInOut" },
      };

  return (
    // Wrapper owns the slow vertical float (CSS @keyframes float in
    // globals.css). The inner <motion.button> writes its own transform via
    // Framer (reveal-y + idle scale pulse); wrapper + child transforms
    // compose through the DOM tree. CSS infinite animation auto-stops under
    // prefers-reduced-motion via the global clamp.
    <div className="self-start mt-2 md:mt-4 animate-float will-change-transform">
      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20, scale: 1 }}
        animate={pulseAnimate}
        transition={pulseTransition}
        className={discoverButtonClasses}
      >
        <span>{label}</span>
        <ArrowDown weight="light" size={14} strokeWidth={1.5} aria-hidden />
      </motion.button>
    </div>
  );
}

// Module-scoped so both render paths share the same merged class string.
// Focus indicator is intentionally NOT specified — the global `:focus-visible`
// rule in globals.css supplies it, consistent with HeroCTA, ContactForm
// submit, MobileMenu.
const discoverButtonClasses = cn(
  "group",
  "inline-flex items-center gap-2",
  "h-10 px-4 rounded-full",
  "text-xs font-mono uppercase tracking-[0.18em] text-fg-muted",
  "border border-border-strong/60",
  "bg-bg/60 backdrop-blur-md",
  "shadow-[0_8px_28px_-4px_var(--color-accent-soft)]",
  "transition-[color,background-color,border-color,box-shadow] duration-200",
  "hover:text-fg hover:border-fg/40 hover:bg-bg-elevated/70",
  "hover:shadow-[0_10px_36px_-2px_var(--color-accent)]",
);
