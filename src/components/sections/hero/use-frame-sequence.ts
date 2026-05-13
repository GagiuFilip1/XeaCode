"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";

/**
 * Preloads a WebP frame sequence and maps a MotionValue<number> in [0, 1] to
 * the corresponding HTMLImageElement (clamped + rounded to nearest). The
 * parent drives the MotionValue — this hook does not call `useScroll`.
 *
 * Loading strategy: eager-load the first ~25% of frames, then progressively
 * load the rest via `requestIdleCallback` in batches of 10 (setTimeout 100ms
 * fallback for Safari). If a desired frame hasn't decoded yet, the nearest-
 * loaded neighbour is returned instead (alternating outward search).
 *
 * SSR-safe: every browser-only call is guarded behind `useEffect`.
 */
export function useFrameSequence({
  totalFrames,
  buildSrc,
  scrollYProgress,
}: {
  totalFrames: number;
  buildSrc: (oneBasedIndex: number) => string;
  scrollYProgress: MotionValue<number>;
}): {
  frameImage: HTMLImageElement | null;
  ready: boolean;
} {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const idleHandlesRef = useRef<number[]>([]);
  // Last index pushed into `setFrameImage` — guards the per-tick no-op path.
  const lastIndexRef = useRef(-1);

  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);

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

    // requestIdleCallback polyfill resolved once per effect (not once per batch).
    const schedule: (cb: IdleRequestCallback) => number =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (cb) =>
            window.setTimeout(
              () =>
                cb({
                  didTimeout: false,
                  timeRemaining: () => 50,
                } as IdleDeadline),
              100,
            );
    const cancel: (handle: number) => void =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : (h) => window.clearTimeout(h);

    const markLoaded = (i: number) => {
      if (cancelled) return;
      loadedFlags[i] = true;
      // The very first frame's load sets the initial frameImage so the canvas
      // can render. `ready` is derived from `frameImage !== null` in the return.
      if (i === 0) {
        lastIndexRef.current = 0;
        setFrameImage(images[0]);
      }
    };

    const startLoad = (i: number) => {
      if (cancelled || images[i]) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => markLoaded(i);
      img.onerror = () => {
        // Treat error as "this frame won't load" — adjacent frames cover for
        // it via findNearestLoaded.
        console.warn(
          `[useFrameSequence] frame ${i + 1} failed to load: ${img.src}`,
        );
      };
      img.src = buildSrc(i + 1);
      images[i] = img;
    };

    // Eager: first ~25% of frames (start-of-scroll viewport — user lands here).
    const EAGER_COUNT = Math.min(45, totalFrames);
    for (let i = 0; i < EAGER_COUNT; i++) startLoad(i);

    // Progressive: remaining frames in batches of 10 via requestIdleCallback.
    const BATCH = 10;
    const queueBatch = (start: number) => {
      if (cancelled || start >= totalFrames) return;
      const handle = schedule(() => {
        if (cancelled) return;
        const end = Math.min(start + BATCH, totalFrames);
        for (let i = start; i < end; i++) startLoad(i);
        queueBatch(end);
      });
      handles.push(handle);
      idleHandlesRef.current = handles;
    };
    queueBatch(EAGER_COUNT);

    return () => {
      cancelled = true;
      for (const h of handles) cancel(h);
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
      lastIndexRef.current = -1;
    };
  }, [totalFrames, buildSrc]);

  // Subscribe to the externally-provided scroll progress. The parent owns the
  // single source of truth that maps user input to canvas frame index.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!loadedRef.current.length) return;
    const clamped = Math.min(1, Math.max(0, progress));
    const desired = Math.round(clamped * (totalFrames - 1));
    // No-op guard: Framer's `animate()` emits per RAF (~60 Hz). Many emits land
    // on the same frame index — skip the array walk + state update for those.
    if (desired === lastIndexRef.current) return;
    const idx = findNearestLoaded(desired);
    if (idx === null) return;
    lastIndexRef.current = idx;
    const img = imagesRef.current[idx];
    if (img) setFrameImage(img);
  });

  return { frameImage, ready: frameImage !== null };
}
