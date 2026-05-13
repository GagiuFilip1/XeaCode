"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  animate,
  type Transition,
  type MotionProps,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroHeadline } from "./HeroHeadline";
import { HeroCTA } from "./HeroCTA";
import { HeroDiscoverButton } from "./HeroDiscoverButton";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Scroll-locked Hero — a discrete checkpoint state machine.
 *
 * Seven checkpoints in canvas-progress space (0 / 0.16 / 0.33 / 0.50 / 0.66 /
 * 0.83 / 1.00) map to frames in the 180-frame sequence. One wheel input
 * advances or retreats the checkpoint by exactly 1; a Framer `animate()`
 * tween drives `frameProgress` linearly over SEGMENT_DURATION. Tweens CHAIN:
 * an arriving wheel mid-tween stops the in-flight `animate()` and starts a
 * new one from the current value toward the next checkpoint, so continuous
 * scrolling produces continuous animation in either direction.
 *
 * The lock releases at LAST_CHECKPOINT (one-way — wheel-up at the final
 * checkpoint scrolls natively, no reverse) but only after the final tween's
 * `onComplete` has fired — until then wheel events are swallowed so the user
 * can't reach Services while the canvas is still settling, and so the loop
 * video (gated on the same flag) doesn't appear over a mid-tween canvas.
 * At checkpoint 0, wheel-up releases the lock too (we're already at scrollY=0).
 *
 * Refs back the checkpoint + first-animation-complete flags because the
 * wheel handler reads them inside a `useEffect` and capturing the state
 * values directly would either go stale or force re-binding on every tick.
 * The state mirrors drive the reveal booleans.
 *
 * Reduced-motion: tweens become effectively instant (REDUCED_MOTION_DURATION).
 * Mobile / coarse-pointer: never reaches this component — `HeroContent`
 * routes those users to `HeroStatic`.
 */

const CHECKPOINTS = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1.0] as const;
const NUM_CHECKPOINTS = CHECKPOINTS.length;
const LAST_CHECKPOINT = NUM_CHECKPOINTS - 1;

// One wheel input → one segment. Source video plays at 24 fps × 30 frames
// per segment ≈ 1.25 s; the slight extension gives the ease-out tail room
// so each segment "feels" like it plays at the original-video speed.
const SEGMENT_DURATION = 1.5; // seconds
const SKIP_TO_END_DURATION = 0.5; // Discover-button fast-forward
const REDUCED_MOTION_DURATION = 0.0001; // effectively instant

const REVEAL_HIDDEN = { opacity: 0, y: 20 } as const;
const REVEAL_VISIBLE = { opacity: 1, y: 0 } as const;
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_DURATION = 0.45;

type RevealTag = "span" | "p" | "div";

function Reveal({
  as,
  show,
  transition,
  className,
  style,
  children,
}: {
  as: RevealTag;
  show: boolean;
  transition: Transition;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const motionProps: MotionProps = {
    initial: REVEAL_HIDDEN,
    animate: show ? REVEAL_VISIBLE : REVEAL_HIDDEN,
    transition,
  };
  if (as === "span")
    return (
      <motion.span {...motionProps} className={className} style={style}>
        {children}
      </motion.span>
    );
  if (as === "p")
    return (
      <motion.p {...motionProps} className={className} style={style}>
        {children}
      </motion.p>
    );
  return (
    <motion.div {...motionProps} className={className} style={style}>
      {children}
    </motion.div>
  );
}

export function HeroScrollLocked() {
  const t = useTranslations("hero");
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Refs back the wheel handler (read inside useEffect — state values would
  // go stale); state mirrors drive the reveal booleans.
  const checkpointRef = useRef(0);
  const [checkpoint, setCheckpoint] = useState(0);

  // Flips true only when an `animate()` targeting LAST_CHECKPOINT completes
  // its tween uninterrupted. Until then the wheel handler holds the lock
  // AND the loop video stays unmounted — so the user can't scroll to
  // Services and the video can't start playing over a mid-tween canvas.
  const firstAnimationCompleteRef = useRef(false);
  const [firstAnimationComplete, setFirstAnimationComplete] = useState(false);

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
        // Linear ease for video-like constant-velocity playback. Source video
        // plays at constant 24 fps — linear matches that pacing.
        ease: "linear",
        onComplete: () => {
          activeAnimRef.current = null;
          // Only an uninterrupted tween that actually reached LAST_CHECKPOINT
          // gets here — `.stop()` does NOT fire onComplete.
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
  const skipToEnd = useCallback(() => {
    goToCheckpoint(LAST_CHECKPOINT, SKIP_TO_END_DURATION);
  }, [goToCheckpoint]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // Wheel-lock engages while the user has not yet scrolled past the
      // section's top edge. The <Header> is sticky (~64px), so at scrollY=0
      // rect.top equals header height — NOT 0. Using `rect.top >= 0` covers
      // both "page at top" and "section pinned flush against viewport top".
      // Once rect.top < 0 the user has scrolled past the Hero and native
      // scroll must resume.
      if (rect.top < 0) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const current = checkpointRef.current;

      // At LAST_CHECKPOINT the lock releases (any direction → native scroll)
      // ONLY after the first animation has truly finished. Until then,
      // wheel events are swallowed so the user can't reach Services while
      // the canvas is settling. Lock-in is one-way (no reverse from LAST)
      // because when input is accepted again native scroll handles both
      // directions.
      if (current >= LAST_CHECKPOINT) {
        if (firstAnimationCompleteRef.current) return;
        e.preventDefault();
        return;
      }

      // Wheel-up at the very start — native scroll no-ops anyway. Let it through.
      if (direction < 0 && current <= 0) return;

      e.preventDefault();
      goToCheckpoint(current + direction, SEGMENT_DURATION);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
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

  const revealTransition: Transition = {
    duration: reduced ? REDUCED_MOTION_DURATION : REVEAL_DURATION,
    ease: REVEAL_EASE,
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
            <Reveal
              as="span"
              show={reveals.eyebrow}
              transition={revealTransition}
              className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent"
            >
              {t("eyebrow")}
            </Reveal>
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
            <Reveal
              as="p"
              show={reveals.lead}
              transition={revealTransition}
              className="max-w-[55ch] text-base md:text-lg leading-relaxed text-fg-muted"
            >
              {t("subtitle")}
            </Reveal>
            <Reveal
              as="p"
              show={reveals.capability}
              transition={revealTransition}
              className="text-[10px] font-mono uppercase tracking-[0.28em] text-fg-subtle max-w-[55ch]"
            >
              {t("capabilities")}
            </Reveal>
            <Reveal
              as="p"
              show={reveals.trust}
              transition={revealTransition}
              className="text-[10px] font-mono uppercase tracking-[0.28em] text-fg-subtle max-w-[60ch]"
            >
              {t("trustStrip")}
            </Reveal>
            <Reveal
              as="p"
              show={reveals.quality}
              transition={revealTransition}
              className="text-sm md:text-base text-fg-muted max-w-[50ch]"
            >
              {t("qualityMarker")}
            </Reveal>
            <Reveal
              as="div"
              show={reveals.ctas}
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
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
