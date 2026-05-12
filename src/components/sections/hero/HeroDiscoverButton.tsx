"use client";

import { useEffect, useRef } from "react";
import { motion, type Transition } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * HeroDiscoverButton — "Discover" affordance rendered inline below the
 * headline in the Hero's left column.
 *
 * Always visible (no scroll-driven hide). On click:
 *   1. If `onSkipToEnd` is provided (scroll-locked Hero path), call it to
 *      fast-forward the canvas + reveals to their final state in parallel
 *      with the scroll tween. The static Hero path omits this callback.
 *   2. rAF-tween `window.scrollY` from current to `#services.offsetTop` over
 *      1200ms with easeOutCubic. Reduced-motion: instant `scrollTo` with no
 *      tween, no fast-forward.
 *   3. Cancel any in-flight rAF tween from a prior click before starting a
 *      new one (avoids the double-click jitter race).
 *
 * Real `<button type="button">` (not `<a href>`) — JS click for the rAF tween.
 * Accessible name comes from the visible text (no `aria-label`); icon is
 * `aria-hidden`. Focus indicator comes from the global `:focus-visible` rule
 * in `globals.css`.
 *
 * The `hidden` prop is retained on the type for backwards compatibility but
 * is no longer used by either caller (both paths show the button always).
 */
export function HeroDiscoverButton({
  hidden,
  revealTransition,
  onSkipToEnd,
}: {
  hidden?: boolean;
  revealTransition?: Transition;
  /**
   * Optional callback fired BEFORE the scroll-to-Services tween starts.
   * Used by the scroll-locked Hero path (HeroScrollLocked) to fast-forward
   * the canvas + reveals to their final state in parallel with the scroll
   * tween. Static Hero path (HeroStatic) omits it — no checkpoints to skip.
   */
  onSkipToEnd?: () => void;
}) {
  const t = useTranslations("hero");
  const reduced = usePrefersReducedMotion();
  const tweenHandleRef = useRef<number | null>(null);

  // Cancel any in-flight tween on unmount (e.g., user navigates away mid-tween).
  useEffect(() => {
    return () => {
      if (tweenHandleRef.current !== null) {
        cancelAnimationFrame(tweenHandleRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    // Fast-forward the Hero animation in parallel with the scroll tween, so
    // when the page lands on Services the canvas + reveals are at their
    // final state instead of frozen mid-segment. No-op on the static path.
    onSkipToEnd?.();

    const services = document.getElementById("services");
    if (!services) return;
    const target = services.getBoundingClientRect().top + window.scrollY;

    if (reduced) {
      window.scrollTo({ top: target, behavior: "instant" });
      return;
    }

    // Cancel any in-flight tween from a prior click — otherwise a rapid
    // double-click runs two rAF loops against the same scrollY, fighting
    // each other for one frame until the older closure finally exits.
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
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
      if (t < 1) {
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

  // `hidden` is undefined on the static path → button is always visible.
  const isHidden = hidden === true;

  // Idle pulse: finite repeat (2 → 3 visible cycles). Disabled on reduced
  // motion. Phase 4 lesson: NEVER `repeat: Infinity`.
  const pulseAnimate = reduced
    ? undefined
    : {
        opacity: isHidden ? 0 : 1,
        y: isHidden ? 20 : 0,
        scale: [1, 1.06, 1],
      };
  const pulseTransition: Transition = reduced
    ? transition
    : {
        opacity: transition,
        y: transition,
        scale: { duration: 1.6, repeat: 2, ease: "easeInOut" },
      };

  return (
    // Wrapper owns the slow vertical float (CSS @keyframes float in
    // globals.css). The inner <motion.button> keeps writing its own
    // transform via Framer (reveal-y + idle scale pulse) — wrapper +
    // child transforms compose through the DOM tree, no fight over
    // style.transform. CSS infinite animation auto-stops under
    // prefers-reduced-motion via the global clamp.
    <div className="self-start mt-2 md:mt-4 animate-float will-change-transform">
      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20, scale: 1 }}
        animate={
          reduced
            ? { opacity: isHidden ? 0 : 1, y: isHidden ? 20 : 0 }
            : pulseAnimate
        }
        transition={pulseTransition}
        style={{ pointerEvents: isHidden ? "none" : "auto" }}
        className={discoverButtonClasses}
      >
        <span>{label}</span>
        <ArrowDown weight="light" size={14} strokeWidth={1.5} aria-hidden />
      </motion.button>
    </div>
  );
}

// Module-scoped so both render paths share the same merged class string and
// `cn()` doesn't re-run per render. Focus indicator is intentionally NOT
// specified — the global `:focus-visible` rule in globals.css supplies it,
// consistent with HeroCTA, ContactForm submit, MobileMenu.
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
  "will-change-transform",
);
