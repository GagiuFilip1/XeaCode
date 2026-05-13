"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useFrameSequence } from "./use-frame-sequence";
import { INWARD_MASK } from "./hero-mask";

const TOTAL_FRAMES = 180;

const buildFramePath = (oneBasedIndex: number) =>
  `/hero-frames/${String(oneBasedIndex).padStart(4, "0")}.webp`;

/**
 * Center-cropped draw — mirrors CSS `object-fit: cover`. Scales the source
 * image to cover the entire canvas while preserving aspect ratio; overflow
 * is cropped equally on the two opposite sides. Matches the `object-cover`
 * class on the static <img> fallback so the canvas branch and the static
 * branch render the asset with the same framing.
 */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
) {
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  if (srcW <= 0 || srcH <= 0) return;
  const srcRatio = srcW / srcH;
  const dstRatio = canvasW / canvasH;
  let dx = 0;
  let dy = 0;
  let dw = canvasW;
  let dh = canvasH;
  if (srcRatio > dstRatio) {
    dh = canvasH;
    dw = dh * srcRatio;
    dx = (canvasW - dw) / 2;
  } else {
    dw = canvasW;
    dh = dw / srcRatio;
    dy = (canvasH - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * The scroll-scrubbed canvas branch of the Hero backdrop. Takes a
 * scrollYProgress MotionValue from the parent (HeroScrollLocked) and drives
 * the canvas frame index through `useFrameSequence`.
 *
 * Canvas bitmap is sized to devicePixelRatio × CSS dimensions for retina
 * crispness, re-fit on every container resize. Once the parent flips
 * `firstAnimationComplete` (the LAST-targeting tween fired its onComplete),
 * a looping `<video>` mounts over the canvas for the rest-state animation.
 */
export function HeroCanvasScene({
  scrollYProgress,
  firstAnimationComplete,
}: {
  scrollYProgress: MotionValue<number>;
  firstAnimationComplete?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Stash the latest frame image so the ResizeObserver callback (whose effect
  // doesn't depend on `seq.frameImage`) can redraw with the current frame.
  const frameImageRef = useRef<HTMLImageElement | null>(null);

  const seq = useFrameSequence({
    totalFrames: TOTAL_FRAMES,
    buildSrc: buildFramePath,
    scrollYProgress,
  });

  // One-time setup: 2D context + ResizeObserver. Independent of frame changes
  // so the observer isn't torn down/rebuilt on every scrub tick.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const applyDimensions = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = container.clientWidth;
      const cssH = container.clientHeight;
      if (cssW <= 0 || cssH <= 0) return;
      const targetW = Math.floor(cssW * dpr);
      const targetH = Math.floor(cssH * dpr);
      if (canvas.width !== targetW) canvas.width = targetW;
      if (canvas.height !== targetH) canvas.height = targetH;
    };

    applyDimensions();

    const ro = new ResizeObserver(() => {
      applyDimensions();
      const img = frameImageRef.current;
      if (img) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCover(ctx, img, canvas.width, canvas.height);
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      ctxRef.current = null;
    };
  }, []);

  // Draw the current frame on each frameImage change.
  useEffect(() => {
    frameImageRef.current = seq.frameImage;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = seq.frameImage;
    if (!canvas || !ctx || !img) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCover(ctx, img, canvas.width, canvas.height);
  }, [seq.frameImage]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      // light:opacity-40 — dark source asset recedes against the warm
      // off-white page bg on light theme so the dark text content can read.
      className="absolute inset-0 pointer-events-none light:opacity-40"
      style={{
        maskImage: INWARD_MASK,
        WebkitMaskImage: INWARD_MASK,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {firstAnimationComplete && (
        // Continuous-loop swap-in. Mounted ONLY after the LAST-targeting
        // tween's `onComplete` has fired in HeroScrollLocked — so the canvas
        // has fully settled at the final frame before this video appears
        // over it. autoPlay requires muted + playsInline per browser policy.
        // Inherits masking + dimming from the parent wrapper.
        <video
          src="/hero-continuous.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
