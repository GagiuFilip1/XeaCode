"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useTranslations } from "next-intl";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroHeadline } from "./HeroHeadline";
import { HeroCTA } from "./HeroCTA";
import { HeroDiscoverButton } from "./HeroDiscoverButton";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * HeroScrollLocked — checkpoint-state scroll mode (Phase 6 v3).
 *
 * Previous iterations mapped continuous scroll position to a canvas frame
 * index via `useScroll` + `useSpring` smoothing. The user found the
 * continuous mode felt laggy on slow scroll and slowed too much at scroll-
 * stop — the spring tail kept advancing the canvas after the user expected
 * it to settle.
 *
 * This iteration replaces continuous scrubbing with a **discrete checkpoint
 * state machine**:
 *
 *   - Seven checkpoints in canvas-progress space: 0 / 0.16 / 0.33 / 0.50 /
 *     0.66 / 0.83 / 1.00. Each maps to a frame in the 180-frame sequence
 *     (roughly 0 / 30 / 60 / 90 / 120 / 150 / 179).
 *   - One scroll input (wheel down / wheel up) advances or retreats the
 *     checkpoint by exactly 1. A Framer `animate()` tween drives the
 *     `frameProgress` MotionValue from current → target over 1500ms with a
 *     linear ease (matches the source video's 24 fps × 30 frames-per-segment
 *     constant-velocity pacing).
 *   - Tweens CHAIN: if a wheel arrives mid-tween, the in-flight `animate()` is
 *     stopped (preserving its current `frameProgress` value) and a new tween
 *     starts from there toward the next checkpoint. Continuous scrolling
 *     therefore produces a continuous animation in either direction — there
 *     is no per-segment rate-limit.
 *   - At checkpoint 6 (last), **any** wheel direction releases the lock —
 *     the animation is one-way once played. Wheel down moves the page to
 *     Services; wheel up just scrolls natively without reversing checkpoints.
 *   - At checkpoint 0 scrolling up → release scroll lock. Native wheel
 *     scrolls the page to top.
 *   - Text reveals are keyed off the checkpoint index (boolean per element),
 *     not off scroll progress. This is cheaper than the threshold-MotionValue
 *     pattern from the previous iteration.
 *
 * Architecture:
 *   - Single `min-h-[100dvh]` section. No 500vh budget, no sticky positioning,
 *     no useScroll.
 *   - A `wheel` listener on `window` (passive: false so we can preventDefault).
 *   - The handler intercepts events while the user has not yet scrolled past
 *     the section's top edge (`rect.top >= 0`). The <Header> is sticky and
 *     ~64px tall, so at scrollY=0 `rect.top === 64`, NOT 0 — that's why the
 *     trigger is "not past the top" rather than "fully covering viewport."
 *   - When the user scrolls out (because we released at an extreme), `rect.top`
 *     goes negative and the handler stops intercepting; native scroll resumes.
 *
 * Reduced-motion: instant snap (~0.0001s tween, effectively a jump).
 * Mobile / coarse-pointer: never reaches this component — `HeroContent`
 * routes those users to `HeroStatic`.
 *
 * Keyboard / arrow-key scrolling: not intercepted. Keyboard users page past
 * the Hero naturally (the animation is decorative; reveal content is still
 * accessible because the next section's content is independently keyed).
 * The Discover button is the explicit keyboard-friendly "skip ahead"
 * affordance and is `<button>`-tabbable.
 */

// Canvas-progress targets per checkpoint. Index 0 = initial state.
const CHECKPOINTS = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1.0] as const;
const NUM_CHECKPOINTS = CHECKPOINTS.length;
const LAST_CHECKPOINT = NUM_CHECKPOINTS - 1;

// Tween durations.
// One wheel input → one segment. Matches the source video pacing
// (motions/final.mp4 is 24 fps × 30 frames per segment ≈ 1.25 s), plus a
// touch of breathing room for the ease-out tail so each segment "feels"
// like it plays at the original-video speed.
const SEGMENT_DURATION = 1.5; // seconds
const SKIP_TO_END_DURATION = 0.5; // seconds — Discover-button fast-forward
const REDUCED_MOTION_DURATION = 0.0001; // effectively instant

export function HeroScrollLocked() {
  const t = useTranslations("hero");
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Canonical checkpoint for the handler (avoids stale closures from useState).
  const checkpointRef = useRef(0);
  // Reflect the same value in React state so derived rendering (reveals)
  // updates. Handler always reads from ref, then mirrors to state.
  const [checkpoint, setCheckpoint] = useState(0);

  // Flips true only when an `animate()` targeting LAST_CHECKPOINT completes
  // its tween (i.e. the canvas actually reached progress=1.0). Until then,
  // the loop video stays unmounted AND the wheel handler holds the scroll
  // lock — so the user can't scroll to Services and the video can't start
  // playing on top of a mid-tween canvas. Ref is read by the wheel handler
  // (avoids stale closures); state drives the render that mounts the video.
  const firstAnimationCompleteRef = useRef(false);
  const [firstAnimationComplete, setFirstAnimationComplete] = useState(false);

  // Canvas frame index is `floor(frameProgress * 179)`. Framer `animate()`
  // tweens this between CHECKPOINTS[i] values on each segment transition.
  const frameProgress = useMotionValue(0);
  // Handle to the active animation so we can cancel mid-flight on
  // skip-to-end (Discover button) or unmount.
  const activeAnimRef = useRef<ReturnType<typeof animate> | null>(null);

  const goToCheckpoint = useCallback(
    (target: number, duration: number) => {
      if (activeAnimRef.current) {
        activeAnimRef.current.stop();
        activeAnimRef.current = null;
      }
      const clamped = Math.max(0, Math.min(LAST_CHECKPOINT, target));
      checkpointRef.current = clamped;
      setCheckpoint(clamped);
      activeAnimRef.current = animate(frameProgress, CHECKPOINTS[clamped], {
        duration: reduced ? REDUCED_MOTION_DURATION : duration,
        // Linear ease for video-like constant-velocity playback. An ease-out
        // curve would front-load the motion (90 %+ of frame change in the
        // first 50 % of duration), making the animation feel faster than
        // SEGMENT_DURATION suggests. Source video plays at constant 24 fps —
        // linear matches that pacing.
        ease: "linear",
        onComplete: () => {
          activeAnimRef.current = null;
          // Only the tween that actually reaches LAST_CHECKPOINT and isn't
          // interrupted gets here — `.stop()` (called from this same
          // function when a new wheel arrives) does NOT fire onComplete.
          // So this is the canonical "first animation truly finished" event.
          if (clamped >= LAST_CHECKPOINT) {
            firstAnimationCompleteRef.current = true;
            setFirstAnimationComplete(true);
          }
        },
      });
    },
    [frameProgress, reduced],
  );

  // Discover-button callback: jump to last checkpoint with a faster tween.
  // The button's own click handler then rAF-tweens scroll to #services in
  // parallel — the canvas catches up to its final frame while the page
  // scrolls.
  const skipToEnd = useCallback(() => {
    goToCheckpoint(LAST_CHECKPOINT, SKIP_TO_END_DURATION);
  }, [goToCheckpoint]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // Wheel-lock engages while the user has not yet scrolled past the
      // section's top edge. The <Header> is sticky (h-16, ~64px), so at
      // scrollY=0 the section's rect.top equals header height — NOT 0.
      // Using `rect.top >= 0` covers both the initial "page is at top" state
      // AND the moment the section is pinned flush against the viewport top.
      // Once rect.top < 0 the user has scrolled past the Hero and native
      // scroll must resume so they can move freely through the page.
      if (rect.top < 0) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const current = checkpointRef.current;

      // At LAST_CHECKPOINT, the lock releases (any direction → native scroll)
      // ONLY after the first animation has truly finished — the tween
      // targeting LAST fired its `onComplete` and flipped
      // firstAnimationCompleteRef. Until that moment, wheel events are
      // swallowed (preventDefault, no advance, no native scroll) so the user
      // can't reach Services while the canvas is still settling, and so the
      // loop video — gated on the same flag — doesn't appear over a mid-tween
      // canvas. The lock-in is still one-way (no reverse from LAST) because
      // when input is accepted again, native scroll handles both directions.
      if (current >= LAST_CHECKPOINT) {
        if (firstAnimationCompleteRef.current) return; // tween done → native scroll
        e.preventDefault(); // tween in flight → hold lock
        return;
      }

      // Wheel-up at the very start — native scroll no-ops (we're already at
      // scrollY=0). Let it through.
      if (direction < 0 && current <= 0) return;

      e.preventDefault();
      goToCheckpoint(current + direction, SEGMENT_DURATION);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      // Cancel any in-flight tween on unmount.
      if (activeAnimRef.current) {
        activeAnimRef.current.stop();
        activeAnimRef.current = null;
      }
    };
  }, [goToCheckpoint]);

  // Reveal booleans — one per text element. Each fires when its checkpoint
  // is reached. Headline is always visible (no entry).
  const reveals = {
    eyebrow: checkpoint >= 1,
    lead: checkpoint >= 2,
    capability: checkpoint >= 3,
    trust: checkpoint >= 4,
    quality: checkpoint >= 5,
    ctas: checkpoint >= 6,
  };

  const revealTransition = {
    duration: reduced ? REDUCED_MOTION_DURATION : 0.45,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <HeroBackdrop
        scrollYProgress={frameProgress}
        firstAnimationComplete={firstAnimationComplete}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-none 2xl:mx-0 2xl:px-[8vw] h-[100dvh] flex flex-col justify-center">
        <div className="grid grid-cols-1 min-[980px]:grid-cols-[minmax(0,58%)_1fr] gap-10 min-[980px]:gap-16 items-center">
          <div className="flex flex-col gap-6 md:gap-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={
                reveals.eyebrow ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={revealTransition}
              className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent"
            >
              {t("eyebrow")}
            </motion.span>
            <HeroHeadline text={t("headline")} />
            <HeroDiscoverButton
              onSkipToEnd={skipToEnd}
              revealTransition={revealTransition}
            />
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
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                reveals.lead ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={revealTransition}
              className="max-w-[55ch] text-base md:text-lg leading-relaxed text-fg-muted"
            >
              {t("subtitle")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                reveals.capability
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={revealTransition}
              className="text-[10px] font-mono uppercase tracking-[0.28em] text-fg-subtle max-w-[55ch]"
            >
              {t("capabilities")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                reveals.trust ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={revealTransition}
              className="text-[10px] font-mono uppercase tracking-[0.28em] text-fg-subtle max-w-[60ch]"
            >
              {t("trustStrip")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                reveals.quality ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={revealTransition}
              className="text-sm md:text-base text-fg-muted max-w-[50ch]"
            >
              {t("qualityMarker")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                reveals.ctas ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={revealTransition}
              style={{ pointerEvents: reveals.ctas ? "auto" : "none" }}
              className="mt-2 flex flex-col sm:flex-row gap-3"
            >
              <HeroCTA href="#contact" variant="primary">
                {t("ctaPrimary")}
              </HeroCTA>
              <HeroCTA href="#work" variant="secondary">
                {t("ctaSecondary")}
              </HeroCTA>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
