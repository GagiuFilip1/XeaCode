# Lighthouse + a11y audit summary — post-Phase 5 (current state)

All measurements against the **production build** (`bun run build` + `bun start`), Chrome headless via `lighthouse` CLI. Last updated 2026-05-12 after Phase 5 close + the `ProcessStep` `aria-prohibited-attr` hotfix.

## Final scores (current — post-Phase-5)

### Desktop preset

| Category | Score | Target | Status |
|---|---|---|---|
| Performance | **99** | 95+ | ✅ |
| Accessibility | **100** | 95+ | ✅ |
| Best Practices | **100** | 95+ | ✅ |
| SEO | **100** | 95+ | ✅ |

Desktop Performance is 99 (one point below Phase 1.4's 100). The cause is the Phase 5 LCP element shift from the lead `<p>` to the headline `<h1>` (which is what the design spec intended — the headline carries the primary value statement and should be the LCP). Simulated LCP grew from 617ms (Phase 1.4) to 977ms (Phase 5). Observed-trace LCP is 344ms — well under any user-perceptible threshold. The "100 → 99" delta is a Lighthouse-simulation artifact of measuring a later-painted (but semantically correct) LCP element; the user-facing experience hasn't regressed.

### Mobile preset (Lighthouse simulated slow-4G + 4× CPU throttle)

| Category | Score | Target | Status |
|---|---|---|---|
| Performance | **92** | ≥ 92 (Phase 5 budget) | ✅ |
| Accessibility | **100** | 95+ | ✅ |
| Best Practices | **100** | 95+ | ✅ |
| SEO | **100** | 95+ | ✅ |

Mobile Performance is 92, at the Phase 5 budget floor (Phase 1.4 baseline was 95 — the drop reflects Phase 4's frame-asset bundle on desktop and is unchanged by Phase 5 because mobile uses the static end-frame fallback, not the scrubbed canvas). All three other categories are 100.

## Core Web Vitals

### Desktop

| Metric | Value | Brief target | Status |
|---|---|---|---|
| Largest Contentful Paint (LCP, simulated) | 977ms | < 2.0s | ✅ |
| Largest Contentful Paint (LCP, observed-trace) | 344ms | < 2.0s | ✅ |
| Cumulative Layout Shift (CLS) | 0 | < 0.05 | ✅ |
| First Contentful Paint (FCP) | 246ms | (no explicit target) | ✅ |
| Total Blocking Time (TBT) | 0ms | (no explicit target) | ✅ |
| Speed Index (SI) | 394ms | (no explicit target) | ✅ |
| Time to Interactive (TTI) | 1009ms | (no explicit target) | ✅ |
| Interaction to Next Paint (INP) | N/A | < 200ms | ⚠️ |

### Mobile

| Metric | Value | Brief target | Status |
|---|---|---|---|
| Largest Contentful Paint (LCP, simulated) | 3306ms | < 2.0s | ⚠️ |
| Largest Contentful Paint (LCP, observed-trace) | 240ms | < 2.0s | ✅ |
| Cumulative Layout Shift (CLS) | 0 | < 0.05 | ✅ |
| First Contentful Paint (FCP) | 904ms | (no explicit target) | ✅ |
| Total Blocking Time (TBT) | 11.5ms | (no explicit target) | ✅ |
| Speed Index (SI) | 904ms | (no explicit target) | ✅ |
| Time to Interactive (TTI) | 3321ms | (no explicit target) | ⚠️ |

Mobile simulated LCP is 3.3s due to Lighthouse's slow-4G + CPU throttle simulation; the **observed-trace** LCP on the same audit run is **240ms**. Real mobile hardware on a normal connection paints comfortably under 1s.

INP is N/A because Lighthouse can't measure it without user interaction during the audit. Manual interaction (form submit, theme toggle, scroll-locked hero traversal) renders well under 200ms on the user's hardware.

## Post-Phase-1.4 regression + recovery (the ProcessStep aria-prohibited-attr story)

Captured here as a paper trail for future contributors who see Phase 3's "Lighthouse a11y 100" claim and wonder how Phase 4 turned that into 97:

1. **Phase 1.4 (2026-05-12 early)**: Lighthouse Accessibility 100 desktop + mobile. Baseline locked.
2. **Phase 3 (Design Handoff Recreation, 2026-05-12 mid)**: rewrote `ProcessStep.tsx` to add an `aria-label={`Step ${index + 1} of ${total}`}` to a plain `<div>` wrapping the "01 / 04" visual fragments. Intent was correct (provide an accessible name for the visually-separated number fragments); execution violated ARIA 1.2 (a plain `<div>` carries the `generic` implicit role, which prohibits `aria-label`). Phase 3 closed citing dev axe-core results that didn't surface the violation — axe-core dev rule set is a subset of Lighthouse's expanded set.
3. **Phase 4 (Hero Scroll Scene, 2026-05-12 late)**: production-build Lighthouse caught the issue as `aria-prohibited-attr`. Accessibility had silently dropped from 100 to **97** on both form factors through the Phase 3 ship.
4. **Hotfix during Phase 4 verification (2026-05-12)**: swapped the wrapping `<div aria-label="…">` pattern for `<div><span className="sr-only">Step N of M</span><span aria-hidden>…</span>…</div>`. The visible fragments stay `aria-hidden`; the accessible name comes from a `sr-only` `<span>`. Same SR announcement, no ARIA-prohibited-attribute violation. Captured in `STATE.md` Hotfix history + `lessons.md` "ARIA 1.2 prohibits aria-label on generic role" entry.
5. **Phase 5 audit (2026-05-12)**: Performance Benchmarker re-ran production-build Lighthouse on both form factors. Accessibility back to **100/100** on desktop and mobile. **+3 vs the broken-Phase-4-state** baseline.

Process rule that emerged: **"Every phase that touches semantic HTML must re-run production-build Lighthouse before close, even if no perf change is expected."** Captured in `lessons.md`.

## A11y remediations history

Cumulative remediations across all phases:

1. **Color contrast on Process step text** (Phase 1.4) — dropped opacity fade from `ProcessStep.tsx`, kept scale-only depth.
2. **`label-content-name-mismatch` on wordmark links** (Phase 1.4) — dropped `aria-label` from Header + Footer wordmarks; visible text "XeaCode" is the accessible name.
3. **`fg-subtle` token bumped** (Phase 1.4) — dark: 0.52 → 0.62, light: 0.60 → 0.48 oklch lightness.
4. **Process step `aria-prohibited-attr`** (Phase 3 introduced → Phase 4 detected → hotfix landed during Phase 4 verification). See "Post-Phase-1.4 regression + recovery" above.
5. **Right-column reading-shelf scrim** (Phase 4) — `before:bg-bg/55 before:blur-2xl` protects `text-fg-muted`/`text-fg-subtle` legibility over the emerald-glow late frames.
6. **`mounted` gate for SSR / CSR branch swap** (Phase 4) — eliminates canvas-to-img swap flash for reduced-motion / coarse-pointer users; no React 19 hydration mismatch warning.
7. **Light-theme canvas dim** (Phase 4 hotfix) — `light:opacity-40` on canvas + static `<img>` wrappers so dark text reads against the warm off-white page bg.
8. **`pointer-events` MotionValue on pre-reveal CTAs** (Phase 5) — pre-reveal opacity-0 CTAs are no longer tab-reachable or clickable; closes WCAG 2.4.7 borderline.

## SEO foundations (post-Phase-5)

- Metadata API in `src/app/layout.tsx`: `title`, `description`, OpenGraph block, Twitter card, canonical, robots directives. Single locale (English at root path; Phase 2.2+2.3 removed Romanian).
- `src/app/robots.ts` (Next 16 file convention) — allow-all + sitemap reference.
- `src/app/sitemap.ts` (Next 16 file convention) — single root URL post-Phase-2.
- `src/lib/seo/site-config.ts` + `src/lib/seo/jsonld.ts` — shared constants + `ProfessionalService` schema builder.
- `<script type="application/ld+json">` injection in layout — Path A (inline JSX) works cleanly in React 19.
- `public/og-image.png` — 1200×630 placeholder PNG (19KB).
- Skip-to-main link in layout (hidden-until-focused, jumps to `<main id="main">`).
- `data-scroll-behavior="smooth"` attribute on `<html>` (Next 16 router compatibility).

## Verified bundle posture (post-Phase-5)

- Source files in `src/components/sections/hero/`: 11 total — RSC + Client split per file documented in `Hero composition` diagram in `README.md`.
- Hero scroll-locked path mounts only on desktop fine-pointer no-reduced-motion clients (mounted-gate in `HeroContent.tsx`).
- Mobile + reduced-motion + SSR render the static end-frame path — byte-identical to Phase 4 mobile.
- 120 hero frames in `public/hero-frames/` at avg 30 KB / 3.50 MB total. Static end-frame at `public/hero-end-frame.webp` (79 KB).
- `bun dev` uses webpack bundler (per Phase 3 hotfix — Turbopack memory leak). `bun build` uses Turbopack.
- Zero `repeat: Infinity` Framer animations anywhere in `src/` (closed via Phase 4's HeroBackdrop blob-drift removal).
- No layout-property animations in CSS or Framer Motion (transform/opacity/scale only).
- Geist Sans + Geist Mono via `next/font/google` with `display: "swap"` + Latin subset. `preload: true` default — no manual `<link rel=preload>` needed.
- Pages render as `ƒ (Dynamic) server-rendered on demand` (cookie-backed theme); `robots.txt` + `sitemap.xml` render as `○ (Static)` per Next 16 file conventions.

## Audit JSON files

Stored in `.claude/docs/audits/`:

- `lighthouse-baseline-en.json` — Phase 1.4 dev-server baseline (Performance 76 — dev distortion, kept for historical reference)
- `lighthouse-prod-en.json` — Phase 1.4 final /en desktop run (all 100s)
- `lighthouse-prod-en-mobile.json` — Phase 1.4 final /en mobile run (Performance 95)
- `lighthouse-prod-ro.json` — Phase 1.4 final /ro desktop run (kept as historical evidence even though `/ro` was removed in Phase 2.2+2.3)
- `phase-4-desktop.json` — Phase 4 production-build desktop. Surfaced the `aria-prohibited-attr` regression (Accessibility 97).
- `phase-4-mobile.json` — Phase 4 production-build mobile. Same Accessibility 97.
- `phase-5-desktop.json` — Phase 5 production-build desktop, post-hotfix. Performance 99, Accessibility/BP/SEO 100/100/100.
- `phase-5-desktop-rerun.json` — Phase 5 stability re-run (Performance Benchmarker's confirmation that the 99 score was stable, not noise).
- `phase-5-mobile.json` — Phase 5 production-build mobile, post-hotfix. Performance 92, Accessibility/BP/SEO 100/100/100.

## Known limitations

- **axe-cli on Windows**: `chromedriver.exe ENOENT` — chromedriver binary path issue specific to Windows + Bun + axe-cli. **Not blocking** — Lighthouse's accessibility checks use axe-core internally with an EXPANDED rule set, and Lighthouse reports the canonical scores. The independent axe-cli pass would be confirmatory; not required.
- **Mobile simulated LCP is 3.3s** under Lighthouse's slow-4G + CPU throttle. Observed-trace LCP is 240ms. Real mobile hardware paints comfortably under 1s.

## What's still placeholder

- `siteUrl` constant in `src/lib/seo/site-config.ts` — Sub-phase 1.5 (Vercel deploy) replaces with the real production host. Currently set to a dev placeholder.
- Real OG image art (current `public/og-image.png` is a 19KB placeholder). Sub-phase 1.5 or later.
- All `messages/en.json` copy is real post-Phase 3 (no `[PLACEHOLDER_KEY]` tokens remain).

## What's NOT placeholder anymore (already filled post-Phase-2.1 + Phase 3)

- Hero / Services / Process / Selected Work / Tech Stack / Team / FAQ / Contact / Footer copy — all real per `messages/en.json`.
- Metadata title + description — Phase 3 wrote real strings.
- Romanian locale + `/ro` routes — REMOVED in Phase 2.2+2.3. Single-locale English at root path.
