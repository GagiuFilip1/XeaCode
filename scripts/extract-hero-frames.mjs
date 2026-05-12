#!/usr/bin/env node
// scripts/extract-hero-frames.mjs
//
// Phase 4 — Hero Scroll Scene (Phase 6: source bumped to motions/final.mp4
// and TARGET_FRAME_COUNT bumped 120 -> 180).
// One-shot frame extractor. Reads the source MP4 in `motions/`, downsamples
// to exactly TARGET_FRAME_COUNT evenly-spaced frames across the whole video
// duration, writes each as WebP quality 82 to `public/hero-frames/*.webp`,
// and writes the LAST frame separately to `public/hero-end-frame.webp` at
// quality 92 for the mobile + reduced-motion static fallback. (End frame uses
// a higher quality because it's the only path mobile users ever see and the
// `object-cover` magnification on small viewports reveals subtle banding in
// the dark-cyan gradient zone at lower qualities.)
//
// Cross-platform: uses `ffmpeg-static` + `ffprobe-static` binaries shipped via
// npm/Bun — no system ffmpeg required. Verified on Windows.
//
// Idempotent: clears `public/hero-frames/` before writing. Verbose: logs each
// step. Exits 1 on any failure (no partial frame sets left in `public/`).
//
// Run:   bun run extract-frames
// Sole source: hardcoded `SOURCE_VIDEO` constant below — change here if the
// asset filename ever rotates.

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

const SOURCE_VIDEO = resolve(
  PROJECT_ROOT,
  "motions",
  "final.mp4",
);
const FRAMES_DIR = resolve(PROJECT_ROOT, "public", "hero-frames");
const END_FRAME = resolve(PROJECT_ROOT, "public", "hero-end-frame.webp");

const TARGET_FRAME_COUNT = 180;
const FRAME_QUALITY = 82;
const END_FRAME_QUALITY = 92;

const FFMPEG = ffmpegPath;
const FFPROBE = ffprobeStatic.path;

if (!FFMPEG || !existsSync(FFMPEG)) {
  console.error(
    `[extract-frames] ffmpeg-static binary not found. Reinstall with: bun install`,
  );
  process.exit(1);
}
if (!FFPROBE || !existsSync(FFPROBE)) {
  console.error(
    `[extract-frames] ffprobe-static binary not found. Reinstall with: bun install`,
  );
  process.exit(1);
}
if (!existsSync(SOURCE_VIDEO)) {
  console.error(`[extract-frames] Source video not found at: ${SOURCE_VIDEO}`);
  process.exit(1);
}

console.log(`[extract-frames] ffmpeg:  ${FFMPEG}`);
console.log(`[extract-frames] ffprobe: ${FFPROBE}`);
console.log(`[extract-frames] source:  ${SOURCE_VIDEO}`);
console.log(
  `[extract-frames] target:  ${FRAMES_DIR}/{0001..${String(TARGET_FRAME_COUNT).padStart(4, "0")}}.webp`,
);
console.log(`[extract-frames] also:    ${END_FRAME}\n`);

// ---------------------------------------------------------------------------
// Step 1 — Probe the source video for resolution, duration, frame rate.
// ---------------------------------------------------------------------------

const probe = spawnSync(
  FFPROBE,
  [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,r_frame_rate,nb_frames,duration",
    "-show_entries", "format=duration",
    "-of", "json",
    SOURCE_VIDEO,
  ],
  { encoding: "utf-8" },
);

if (probe.status !== 0) {
  console.error("[extract-frames] ffprobe failed:");
  console.error(probe.stderr || probe.stdout);
  process.exit(1);
}

let probeData;
try {
  probeData = JSON.parse(probe.stdout);
} catch (e) {
  console.error("[extract-frames] ffprobe output not valid JSON:");
  console.error(probe.stdout);
  process.exit(1);
}

const stream = probeData.streams?.[0];
if (!stream) {
  console.error("[extract-frames] ffprobe found no video stream in source.");
  process.exit(1);
}

const width = Number(stream.width);
const height = Number(stream.height);

// r_frame_rate is a string fraction like "24/1" or "30000/1001"
const [rfrNum, rfrDen] = String(stream.r_frame_rate).split("/").map(Number);
const sourceFps = rfrDen > 0 ? rfrNum / rfrDen : Number(stream.r_frame_rate);

// Duration: prefer stream.duration, fall back to format.duration
const durationSec =
  Number(stream.duration) ||
  Number(probeData.format?.duration) ||
  0;

if (!Number.isFinite(width) || width <= 0) {
  console.error(`[extract-frames] Invalid width from ffprobe: ${width}`);
  process.exit(1);
}
if (!Number.isFinite(height) || height <= 0) {
  console.error(`[extract-frames] Invalid height from ffprobe: ${height}`);
  process.exit(1);
}
if (!Number.isFinite(sourceFps) || sourceFps <= 0) {
  console.error(`[extract-frames] Invalid frame rate from ffprobe: ${sourceFps}`);
  process.exit(1);
}
if (!Number.isFinite(durationSec) || durationSec <= 0) {
  console.error(`[extract-frames] Invalid duration from ffprobe: ${durationSec}`);
  process.exit(1);
}

console.log(`[extract-frames] resolution: ${width}x${height}`);
console.log(`[extract-frames] frame rate: ${sourceFps.toFixed(3)} fps`);
console.log(`[extract-frames] duration:   ${durationSec.toFixed(3)} s`);

// Compute the output frame rate that yields exactly TARGET_FRAME_COUNT frames
// across the full duration. ffmpeg's -vf "fps=X" + -frames:v N drops/duplicates
// frames as needed; we use the fps filter form so the spacing is uniform.
const outputFps = TARGET_FRAME_COUNT / durationSec;
console.log(
  `[extract-frames] downsampling to ${TARGET_FRAME_COUNT} frames (about ${outputFps.toFixed(3)} fps output)\n`,
);

// ---------------------------------------------------------------------------
// Step 2 — Clear and recreate the output frames directory.
// ---------------------------------------------------------------------------

if (existsSync(FRAMES_DIR)) {
  console.log(`[extract-frames] clearing existing ${FRAMES_DIR}`);
  rmSync(FRAMES_DIR, { recursive: true, force: true });
}
mkdirSync(FRAMES_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Step 3 — Extract the TARGET_FRAME_COUNT-frame sequence at quality 82.
// ---------------------------------------------------------------------------

const sequenceOut = join(FRAMES_DIR, "%04d.webp");

const seqArgs = [
  "-y",                                  // overwrite
  "-i", SOURCE_VIDEO,
  "-vf", `fps=${outputFps},format=yuv420p`,
  "-frames:v", String(TARGET_FRAME_COUNT),
  "-c:v", "libwebp",
  "-quality", String(FRAME_QUALITY),
  "-preset", "default",
  "-an",                                 // strip audio
  sequenceOut,
];

console.log(`[extract-frames] running ffmpeg for sequence...`);
const seqRun = spawnSync(FFMPEG, seqArgs, { encoding: "utf-8" });
if (seqRun.status !== 0) {
  console.error("[extract-frames] ffmpeg sequence extraction failed:");
  console.error(seqRun.stderr || seqRun.stdout);
  process.exit(1);
}

// Validate output count + size
const written = readdirSync(FRAMES_DIR)
  .filter((f) => /^\d{4}\.webp$/.test(f))
  .sort();

if (written.length !== TARGET_FRAME_COUNT) {
  console.error(
    `[extract-frames] expected ${TARGET_FRAME_COUNT} frames, got ${written.length}`,
  );
  process.exit(1);
}

let totalBytes = 0;
for (const f of written) {
  totalBytes += statSync(join(FRAMES_DIR, f)).size;
}

console.log(
  `[extract-frames] wrote ${written.length} frames, total ${(totalBytes / 1024 / 1024).toFixed(2)} MB ` +
    `(avg ${(totalBytes / written.length / 1024).toFixed(1)} KB/frame)\n`,
);

// ---------------------------------------------------------------------------
// Step 4 — Extract the LAST frame as the static end-frame at END_FRAME_QUALITY.
// ---------------------------------------------------------------------------

const endArgs = [
  "-y",
  "-sseof", "-0.1",                      // seek to ~0.1s before end of file
  "-i", SOURCE_VIDEO,
  "-vsync", "0",
  "-update", "1",
  "-frames:v", "1",
  "-c:v", "libwebp",
  "-quality", String(END_FRAME_QUALITY),
  "-preset", "default",
  "-an",
  END_FRAME,
];

console.log(`[extract-frames] running ffmpeg for end-frame...`);
const endRun = spawnSync(FFMPEG, endArgs, { encoding: "utf-8" });
if (endRun.status !== 0) {
  console.error("[extract-frames] ffmpeg end-frame extraction failed:");
  console.error(endRun.stderr || endRun.stdout);
  process.exit(1);
}

if (!existsSync(END_FRAME)) {
  console.error(`[extract-frames] end-frame missing at: ${END_FRAME}`);
  process.exit(1);
}

const endBytes = statSync(END_FRAME).size;
console.log(
  `[extract-frames] wrote end-frame, ${(endBytes / 1024).toFixed(1)} KB\n`,
);

console.log(`[extract-frames] DONE.`);
