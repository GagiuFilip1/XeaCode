"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useFrameSequence } from "./use-frame-sequence";

const TOTAL_FRAMES = 180;
const FRAME_PATH = "/hero-frames/{{index}}.webp";

// Inward radial mask — identical to the dot-grid mask in HeroBackdrop so the
// canvas and the dot-grid fade together at the same ellipse boundary.
const INWARD_MASK =
  "radial-gradient(ellipse 80% 55% at 60% 45%, black 30%, transparent 85%)";

// Center-cropped draw — mirrors CSS `object-fit: cover`. Scales the source
// image to cover the entire canvas while preserving aspect ratio; overflow
// is cropped equally on the two opposite sides. Matches the `object-cover`
// class on the static <img> fallback in HeroScrollScene.tsx, so the canvas
// branch and the static branch render the asset with the same framing.
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
    // Source wider than destination — fit height, overflow horizontally.
    dh = canvasH;
    dw = dh * srcRatio;
    dx = (canvasW - dw) / 2;
  } else {
    // Source taller (or equal) — fit width, overflow vertically.
    dw = canvasW;
    dh = dw / srcRatio;
    dy = (canvasH - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * HeroCanvasScene — the scroll-scrubbed canvas branch of the Hero backdrop.
 *
 * Phase 6: TOTAL_FRAMES bumped 120 -> 180 because the source MP4
 * (motions/final.mp4) is ~10s vs the previous ~5s clip, so more frames are
 * needed to preserve scrub smoothness across the same 300vh budget. The hook
 * signature is unchanged — passes through `scrollYProgress` (which in the
 * Phase 6 wiring is the smoothed-spring MotionValue from HeroScrollLocked).
 *
 * Phase 5: accepts `scrollYProgress` as a prop (lifted from the parent
 * `HeroScrollLocked`) instead of owning a `useScroll` internally. The hook
 * `useFrameSequence` is the consumer of that MotionValue.
 *
 * The canvas container ref (`containerRef`) is still owned here — it's used
 * by the ResizeObserver to size the canvas bitmap to DPR x CSS dimensions on
 * every container resize. It is NOT a scroll target anymore.
 *
 * Mounted only when the parent has decided (a) we're past hydration AND (b)
 * the user is on a fine-pointer device with motion preference allowed (those
 * branches now live in `HeroContent`, two levels up).
 *
 * Image rendering:
 *   - canvas bitmap = floor(cssW * dpr) x floor(cssH * dpr) for retina crispness.
 *   - 2D context with `alpha: true` so the inward mask clips to transparent
 *     at the ellipse boundaries.
 *   - On each `frameImage` change, ctx.drawImage stretches the source frame
 *     to fill the bitmap. Source frames are 16:9; Hero at desktop is roughly
 *     16:9-ish. Aspect mismatch at extreme aspect ratios is hidden by the mask.
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

  const seq = useFrameSequence({
    totalFrames: TOTAL_FRAMES,
    framePath: FRAME_PATH,
    scrollYProgress,
  });

  // Resize the canvas bitmap to devicePixelRatio * cssDimensions whenever the
  // container resizes. Re-draws the current frame after each resize so we
  // don't see a one-frame blank.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
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
      const img = seq.frameImage;
      const c = canvasRef.current;
      const cx = ctxRef.current;
      if (img && c && cx) {
        cx.clearRect(0, 0, c.width, c.height);
        drawCover(cx, img, c.width, c.height);
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      ctxRef.current = null;
    };
  }, [seq.frameImage]);

  // Draw the current frame on each frameImage change.
  useEffect(() => {
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
      // light:opacity-40 — same rationale as HeroStaticBackdrop in
      // HeroScrollScene.tsx: dark source asset recedes against the warm
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
        // tween's `onComplete` has fired in HeroScrollLocked — so the
        // canvas has fully settled at frame 0180 before this video appears
        // over it. autoPlay requires muted + playsInline per browser policy.
        // The parent wrapper carries the INWARD_MASK + light:opacity-40,
        // so this element inherits the masking and dimming for free.
        // Decorative — aria-hidden + no audio track, so no caption needed.
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
