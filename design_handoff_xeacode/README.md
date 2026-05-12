# Handoff: XeaCode design system

## Overview

This bundle contains the **XeaCode design system** — visual + content foundations, tokens, reusable components, and a clickable recreation of the full marketing site. The destination is a senior independent software studio's single-page portfolio + services site (`xeacode.com`), built on Next.js / React in production.

## About the design files

The files in this bundle are **design references created in HTML/React+Babel** — prototypes that show the intended look, behaviour, copy, and interactions. They are **not production code to ship as-is**.

The task is to **recreate these HTML designs in the target codebase's environment** (`GagiuFilip1/XeaCode` — Next.js 15 + Tailwind v4 + TypeScript) using its established patterns, file structure, and `next-intl` message system. The CSS tokens in `colors_and_type.css` already mirror `src/app/globals.css` in that repo, so most values should already match.

## Fidelity

**High-fidelity.** Pixel-perfect mockups with final colours, typography, spacing, animations, and interaction states. Recreate the UI exactly using the codebase's existing libraries (Tailwind, `framer-motion`, `next-intl`) and component patterns (`src/components/sections/**`, `src/components/layout/**`).

## What's in this bundle

| File | Purpose |
|---|---|
| `DESIGN_SYSTEM_README.md` | Full system reference: brand context, content fundamentals, visual foundations, iconography. **Read first.** |
| `SKILL.md` | Agent-Skill front-matter — same content surfaced for Claude Code's skill loader. |
| `colors_and_type.css` | Drop-in CSS variables for colour, type, spacing, radius, shadow, easing. Dark default; `.light` class flips. |
| `assets/` | `wordmark.svg`, `monogram.svg`. |
| `ui_kits/marketing/` | Clickable single-page-scroll recreation: `index.html`, `kit.css`, `app.jsx`, `README.md`. |

## Screens

### Marketing home (single-page scroll)

Order: **Header → Hero → Services → Process → Work → Stack → Team → FAQ → Contact → Footer.**

Each section has an `eyebrow` ("01 — WHAT WE DO" pattern), `h2`, and `lead` paragraph; section padding is `clamp(72px, 11vw, 128px)` top + bottom. Section-head max-width is `56ch`.

### Theme

Dark default; light variant via `.light` on `<html>`. Toggle lives in the header's right cluster, swaps a `Sun` / `Moon` icon.

## Components

Lifted directly from `ui_kits/marketing/app.jsx`:

- **`Header`** — sticky, transparent at top, glass-blur (`backdrop-filter: blur(14px)`) on scroll. 7-link nav, theme toggle.
- **`Hero`** — asymmetric grid (58% / 1fr ≥980px). Three drifting radial-gradient blobs (`drift1`/`2`/`3` keyframes, 14–22s) + masked dot grid + bottom fade. Two CTAs: primary "Start a project", secondary "See selected work".
- **`ServiceCard`** — `rounded-2xl`, 40px padding, accent-soft icon badge (48×48 pill), h3, body, mono engagement footer. Hover: `translateY(-6px)` + `--shadow-card`.
- **`ProcessStep`** — numbered `01 / 04`, accent mono `cur`, subtle mono `tot`. Deliverable label + display h3 + body. Rows separated by hairline.
- **`WorkRow`** — large display h3, body, stack tags (mono · separated), meta, italic outcome. Hairline group.
- **`Marquee`** — twin counter-scrolling tile rows, edge-masked, 50s linear infinite.
- **`Principle`** — mono accent label + body, hairline row.
- **`FaqRow`** — `<dt>` / `<dd>` always-visible, 2-col grid ≥768px.
- **`Field`** — mono uppercase label + input/textarea. Default / focus (`--accent` border) / error (`aria-invalid`) states.
- **`Footer`** — 3-col + bottom row.

## Design tokens

Source of truth is `colors_and_type.css`. Key values:

**Colour (dark):**
- `--bg` `oklch(0.16 0.005 250)` · `--bg-elevated` `oklch(0.20 0.005 250)`
- `--fg` `oklch(0.96 0.005 250)` · `--fg-muted` `oklch(0.74 0.01 250)` · `--fg-subtle` `oklch(0.62 0.008 250)`
- `--border` `oklch(0.26 0.01 250)` · `--border-strong` `oklch(0.36 0.01 250)`
- `--accent` `oklch(0.66 0.13 165)` (desaturated emerald) · `--accent-soft` 18% · `--accent-strong` lighter
- `--error` `oklch(0.65 0.22 25)` — form fields only

**Type:**
- Display + body: **Geist Sans** (300/400/500/600/700). All headings `font-weight: 500`, `letter-spacing: -0.025em → -0.01em`, `line-height: 0.95–1.15`.
- Eyebrow / label / meta: **Geist Mono** (400/500), `text-transform: uppercase`, `letter-spacing: 0.18em–0.28em`, 10–12px.
- Scale: `h1 clamp(2.5rem, 5.5vw, 4.5rem)` → `h4 1.25rem`. Body `1rem / 1.65`. Lead `1.125rem / 1.6`.

**Spacing:** Tailwind-aligned 4px scale, `--s-1` (4px) → `--s-32` (128px). Section rhythm `clamp(96px, 14vw, 128px)`.

**Radii:** `--r-sm 4px` · `--r-md 8px` (form fields) · `--r-lg 16px` (cards) · `--r-full 9999px` (pills/buttons).

**Shadows (dark):** inner highlight + tinted drop, 3 levels (`--shadow-soft / -card / -elevated`).

**Easing:** `--ease-spring cubic-bezier(0.16, 1, 0.3, 1)` for nearly everything. Reveal transitions 0.7s spring.

## Interactions & behaviour

- **Magnetic CTAs** — primary/secondary buttons translate ~15% of cursor offset on hover.
- **Scroll reveal** — `IntersectionObserver` (threshold 0.12) flips `.reveal` → `.reveal.in`, 24px translateY + opacity, staggered 60–80ms per sibling.
- **Header glass blur** — kicks in at `scrollY > 32`.
- **Form validation** — required: name, email, message. Email regex `/^\S+@\S+\.\S+$/`. Success replaces form with confirmation card.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` clamps all transitions to 0.001ms.

## Voice & copy rules

Critical — the studio explicitly does **not** use words like "bespoke", "crafted", "delight", "supercharge", "by senior hands", or marketing-speak. Plain, slightly formal, sentence-case. No exclamation marks. No emoji. Specificity over adjectives ("14 weeks · delivered Q1 2025", not "lightning-fast turnaround").

Use the exact copy in `app.jsx` as the source of truth for the eight sections — it has already been reviewed.

## Iconography

Hand-rolled Phosphor-style strokes inline in `app.jsx`: 1.5 stroke width, `stroke-linecap: round`, `stroke-linejoin: round`, no fill, 18–24px. **Substitution note:** in production the codebase can swap these for `phosphor-react` (light weight) — match stroke weight 1.5. No emoji anywhere.

## State management

The marketing site is mostly static. Stateful surfaces:
- `theme` (dark/light) — local component state in the prototype; production should sync to `localStorage` + `prefers-color-scheme`.
- Contact form — `{ name, email, company, message }`, error object, submitted flag. Production wires to whatever endpoint the team picks (currently mocked).
- Scroll-driven progress fill in the Process section — listen to scroll, drive `--height` on `.progress-fill` against section bounds.

## Assets

- `assets/wordmark.svg` — XeaCode wordmark
- `assets/monogram.svg` — square monogram for favicon / social
- Geist Sans + Geist Mono loaded via Google Fonts (`@import` in `colors_and_type.css`). Production already uses `next/font/google` — keep that, don't switch.

## Implementation notes for Claude Code

1. The CSS tokens here mirror `src/app/globals.css` — diff and reconcile rather than wholesale-replacing.
2. Use **Tailwind v4 `@theme`** to expose these tokens; don't introduce a separate CSS-vars layer.
3. Sections are already split as `src/components/sections/{Hero,Services,Process,SelectedWork,TechStack,Team,FAQ,Contact}.tsx`. Match the file/component names there.
4. Copy strings go into `messages/en.json` (plus any other locales). The prototype copy in `app.jsx` is the canonical English source.
5. Animations should use **`framer-motion`** (already a dependency) — port the Reveal/magnetic/marquee patterns to motion primitives rather than the bare CSS used in the prototype.
6. The prototype's `kit.css` is reference-only — do **not** ship it. Re-express everything via Tailwind utilities + `@theme` tokens.

## Open questions for the implementer

- Should the contact form post to a real endpoint, or stay mock until the studio picks an inbox provider?
- Light theme is implemented but currently de-prioritised — confirm whether to ship the toggle in v1.
