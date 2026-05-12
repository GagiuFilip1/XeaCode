"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";

/**
 * use-frame-sequence — preload + scroll-progress-to-frame-index mapping for the
 * Hero scroll-scrubbed canvas scene.
 *
 * Phase 6 v3 (checkpoint mode): the parent (`HeroScrollLocked`) drives the
 * passed MotionValue directly via Framer `animate()` between discrete
 * checkpoint progress values (0 / 0.16 / 0.33 / 0.50 / 0.66 / 0.83 / 1.00).
 * Wheel events are intercepted; one input = one segment tween over ~700ms.
 * The hook itself is unchanged from Phase 5 — a MotionValue is a MotionValue,
 * whether it's spring-smoothed scroll progress, raw scroll progress, or an
 * `animate()`-driven progress between discrete checkpoints.
 *
 * Phase 6 v2 (deprecated): `scrollYProgress` was spring-smoothed via
 * `useSmoothedProgress`. Removed in v3 because the spring tail felt laggy.
 *
 * Phase 5 signature: the hook no longer owns `useScroll`. It takes a
 * `scrollYProgress: MotionValue<number>` and subscribes via
 * `useMotionValueEvent`. The parent component owns the single source of
 * truth that maps user input to canvas frame index.
 *
 * Inputs:
 *   - totalFrames:    how many frames in the sequence (Phase 6: 180).
 *   - framePath:      printf-style path with {{index}} placeholder, e.g.
 *                     "/hero-frames/{{index}}.webp". Indexes are 1-based,
 *                     4-digit zero-padded ("0001"..."0180").
 *   - scrollYProgress: MotionValue<number> in [0..1] driving the frame
 *                     selection. Passed in from the parent — the hook does
 *                     NOT call `useScroll` itself.
 *
 * Outputs:
 *   - frameImage:  the currently-selected HTMLImageElement, or null until
 *                  frame 0001 has loaded. The component draws it via
 *                  ctx.drawImage(frameImage, ...).
 *   - ready:       true once frame 0001 has loaded — component can draw.
 *   - loadedCount: count of frames already in the browser cache.
 *
 * Behaviour:
 *   1. On mount, build a `HTMLImageElement[]` of length `totalFrames`, set
 *      `.src` on each. Eager preload the first 30; progressively preload the
 *      rest in batches of 10 via `requestIdleCallback` (100ms setTimeout
 *      fallback for Safari).
 *   2. Subscribe to `scrollYProgress` via `useMotionValueEvent`. Each change
 *      maps `progress in [0, 1]` to `index = round(progress * (totalFrames - 1))`,
 *      clamped to [0, totalFrames - 1]. If that frame's Image has loaded, set
 *      `frameImage` to it; if not, fall back to the nearest loaded frame
 *      (alternating outward search).
 *   3. On unmount, clear every Image's `.src` to release the reference and
 *      allow GC. Cancel any pending `requestIdleCallback`.
 *
 * SSR-safe: every browser-only thing (`new Image()`, `requestIdleCallback`,
 * `window`) is guarded behind `useEffect` (post-mount only).
 */
export function useFrameSequence({
  totalFrames,
  framePath,
  scrollYProgress,
}: {
  totalFrames: number;
  framePath: string;
  scrollYProgress: MotionValue<number>;
}): {
  frameImage: HTMLImageElement | null;
  ready: boolean;
  loadedCount: number;
} {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const idleHandlesRef = useRef<number[]>([]);

  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Resolved path for a 1-based index, zero-padded to 4 digits.
  const buildSrc = useMemo(
    () =>
      (index1based: number) =>
        framePath.replace(
          "{{index}}",
          String(index1based).padStart(4, "0"),
        ),
    [framePath],
  );

  // Find the nearest-loaded frame index given a desired index. Search outward
  // alternating +/- 1, +/- 2, ... up to the array bounds.
  const findNearestLoaded = (desired: number): number | null => {
    const loaded = loadedRef.current;
    if (loaded[desired]) return desired;
    for (let d = 1; d < totalFrames; d++) {
      const up = desired + d;
      const down = desired - d;
      if (up < totalFrames && loaded[up]) return up;
      if (down >= 0 && loaded[down]) return down;
    }
    return null;
  };

  // Mount: build the Image array, kick off preloads.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (totalFrames <= 0) return;

    const images: HTMLImageElement[] = new Array(totalFrames);
    const loadedFlags: boolean[] = new Array(totalFrames).fill(false);
    imagesRef.current = images;
    loadedRef.current = loadedFlags;

    let cancelled = false;
    const handles: number[] = [];
    let cleanupSchedule: ((handle: number) => void) | null = null;

    const markLoaded = (i: number) => {
      if (cancelled) return;
      loadedFlags[i] = true;
      setLoadedCount((n) => n + 1);
      // The very first frame's load flips `ready` + sets initial frameImage.
      if (i === 0) {
        setReady(true);
        setFrameImage(images[0]);
      }
    };

    const startLoad = (i: number) => {
      if (cancelled || images[i]) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => markLoaded(i);
      img.onerror = () => {
        // Treat error as "this frame won't load" — leave loadedFlags[i] = false.
        // Adjacent frames cover for it via findNearestLoaded.
        console.warn(
          `[useFrameSequence] frame ${i + 1} failed to load: ${img.src}`,
        );
      };
      img.src = buildSrc(i + 1);
      images[i] = img;
    };

    // Eager: first 45 frames (start-of-scroll viewport — user lands here).
    // Phase 6 bumped from 30 to 45 proportionally with totalFrames 120 -> 180.
    const EAGER_COUNT = Math.min(45, totalFrames);
    for (let i = 0; i < EAGER_COUNT; i++) startLoad(i);

    // Progressive: remaining frames in batches of 10 via requestIdleCallback.
    const BATCH = 10;
    const queueBatch = (start: number) => {
      if (cancelled || start >= totalFrames) return;
      const schedule =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback
          : (cb: IdleRequestCallback) =>
              window.setTimeout(
                () =>
                  cb({
                    didTimeout: false,
                    timeRemaining: () => 50,
                  } as IdleDeadline),
                100,
              ) as unknown as number;
      const cancel =
        typeof window.cancelIdleCallback === "function"
          ? window.cancelIdleCallback
          : (h: number) => window.clearTimeout(h);

      const handle = schedule(() => {
        if (cancelled) return;
        const end = Math.min(start + BATCH, totalFrames);
        for (let i = start; i < end; i++) startLoad(i);
        queueBatch(end);
      });
      handles.push(handle as unknown as number);
      idleHandlesRef.current = handles;
      cleanupSchedule = cancel;
    };
    queueBatch(EAGER_COUNT);

    return () => {
      cancelled = true;
      // Cancel any pending idle callbacks.
      if (cleanupSchedule) {
        for (const h of handles) cleanupSchedule(h);
      }
      // Release Image references — clearing src cancels any in-flight network
      // fetch and lets the GC reclaim memory.
      for (const img of images) {
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = "";
        }
      }
      imagesRef.current = [];
      loadedRef.current = [];
      idleHandlesRef.current = [];
    };
  }, [totalFrames, buildSrc]);

  // Subscribe to the externally-provided scroll progress. The parent owns the
  // single `useScroll({ target, offset })` call; this hook is a pure consumer.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!loadedRef.current.length) return;
    const clamped = Math.min(1, Math.max(0, progress));
    const desired = Math.round(clamped * (totalFrames - 1));
    const idx = findNearestLoaded(desired);
    if (idx === null) return;
    const img = imagesRef.current[idx];
    if (img) setFrameImage(img);
  });

  return { frameImage, ready, loadedCount };
}
