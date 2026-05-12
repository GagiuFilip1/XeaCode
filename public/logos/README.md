# /public/logos/

Reserved for **real brand SVG logos** during the content pass.

## Current state

Sub-phase 1.2 ships the Tech Stack section with **inline text-style placeholder tiles** defined in `src/components/sections/tech/logos.tsx`. No SVG files live here yet — this directory is the swap target.

## How to swap to real logos (later)

1. Drop the real brand SVG file into this directory (e.g. `react.svg`, `nextjs.svg`, `dotnet.svg`). Use `currentColor` fill so the logo respects the active theme.
2. Open `src/components/sections/tech/logos.tsx`.
3. For each entry in `ROW_1` / `ROW_2`, replace the inline `TextTile` SVG with an `Image` (or inline SVG) pointing to the new file. Keep the `name` and `category` fields unchanged.
4. Verify the marquee rhythm still feels balanced — tiles should be roughly the same width.

## File size budget

Each placeholder is < 1KB inline. Real logos: target **< 2KB per SVG** to keep the marquee cheap. The marquee duplicates the tile sequence at runtime, so 16 tiles × 2KB × 2 duplications = 64KB max — fine.

## Why files instead of inline?

The brief explicitly requested `/public/logos/` as a swap point. Inline placeholder SVGs ship first (faster iteration), files arrive with the real logos.
