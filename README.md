# XeaCode

> Premium portfolio + services site for a senior independent software studio.
> Single-page-scroll, English-only, dark default. Linear / Vercel / Stripe — quiet authority.

## Status

**Phase 5 — Sticky Scroll-Locked Hero with Progressive Text Reveal** shipped 2026-05-12. The Hero now pins to the viewport for 300vh of scroll budget on desktop / fine-pointer / no-reduced-motion clients; the Phase 4 canvas animation scrubs across that budget while four text elements (eyebrow, lead, trust strip, CTAs) reveal at staged scroll-progress thresholds. The headline anchors immediately. Mobile + reduced-motion users keep the Phase 4-equivalent static layout. Site is local-quality-complete. Next queued work: **Sub-phase 1.5 — Vercel deploy + production env wiring**. Active board state at [`.claude/docs/STATE.md`](.claude/docs/STATE.md); reverse-chronological log at [`.claude/docs/COMPLETED.md`](.claude/docs/COMPLETED.md).

| Phase | Title | Status |
|---|---|---|
| 1.1 | Foundation + Hero | Done (2026-05-11) |
| 1.2 | Content sections (Services, Process, Tech Stack) | Done (2026-05-11) |
| 1.3 | Contact (mocked) + Footer | Done (2026-05-12) |
| 1.4 | SEO + perf + a11y (local-only — deploy deferred) | Done (2026-05-12) |
| 2.1 | Copy expansion to existing sections | Done (2026-05-12) |
| 2.2 + 2.3 | Selected Work + Team + FAQ + Romanian removal + URL flatten | Done (2026-05-12) |
| 3 | Design Handoff Recreation (100% match to `design_handoff_xeacode/` bundle) | Done (2026-05-12) |
| 4 | Hero Scroll Scene (AI-sourced scroll-scrubbed canvas) | Done (2026-05-12) |
| 5 | Sticky Scroll-Locked Hero with Progressive Text Reveal | Done (2026-05-12) |
| 1.5 (future) | Vercel deploy + production env wiring | Queued |

Long-term: a .NET 10 Web API replaces the mock contact submission. See [PROJECT.md](PROJECT.md).

## Quick start

```sh
bun install
bun dev
```

Open `http://localhost:3000`. Single English locale at the root path (Romanian and locale routing removed in Phase 2.2+2.3).

Other commands:

```sh
bun run build            # production build (Turbopack)
bun run lint             # ESLint
bun start                # serve the production build
```

**Prerequisites**: Bun 1.3+ (`npm i -g bun` if missing). Node 20.10+ underneath.

## System inventory

### Sections (single-page-scroll)

| Anchor | Component | Eyebrow |
|---|---|---|
| `#hero` | [`src/components/sections/Hero.tsx`](src/components/sections/Hero.tsx) | SENIOR INDEPENDENT STUDIO · EST. 2019 |
| `#services` | [`src/components/sections/Services.tsx`](src/components/sections/Services.tsx) | 01 — WHAT WE DO |
| `#process` | [`src/components/sections/Process.tsx`](src/components/sections/Process.tsx) | 02 — HOW WE WORK |
| `#work` | [`src/components/sections/SelectedWork.tsx`](src/components/sections/SelectedWork.tsx) | 03 — SELECTED WORK |
| `#stack` | [`src/components/sections/TechStack.tsx`](src/components/sections/TechStack.tsx) | 04 — TOOLS WE REACH FOR |
| `#team` | [`src/components/sections/Team.tsx`](src/components/sections/Team.tsx) | 05 — WHO WE ARE |
| `#faq` | [`src/components/sections/Faq.tsx`](src/components/sections/Faq.tsx) | 06 — COMMON QUESTIONS |
| `#contact` | [`src/components/sections/Contact.tsx`](src/components/sections/Contact.tsx) | 07 — START A PROJECT |
| (footer) | [`src/components/layout/Footer.tsx`](src/components/layout/Footer.tsx) | — |

### Hero composition (Phase 5)

```
Hero (RSC, thin shell) — <section id="hero" className="relative">
└── HeroContent (Client) — mounted-gate decides static vs scroll-locked
    ├── if (!mounted || useStatic) →
    │   HeroStatic (Client) — Phase 4-equivalent layout:
    │     min-h-[100dvh] pt-28 pb-20 md:pt-36 md:pb-28 flex flex-col justify-center
    │     ├── HeroBackdrop (no scrollYProgress) → static <img> end-frame
    │     └── grid 58%/1fr: eyebrow + HeroHeadline | lead + trust + CTAs
    │
    └── if (mounted && !useStatic) →
        HeroScrollLocked (Client) — owns useScroll + scrollYProgress + 4× useScrollReveal:
          <div ref={containerRef} className="relative min-h-[300vh]">
            └── <div className="sticky top-0 h-[100dvh] overflow-hidden">
                ├── HeroBackdrop (scrollYProgress passed) → scroll-scrubbed canvas
                │   └── HeroCanvasScene (uses useFrameSequence with scrollYProgress)
                │       ├── 120-frame WebP sequence in public/hero-frames/
                │       ├── ResizeObserver-driven DPR-correct bitmap sizing
                │       └── Inward radial mask + light:opacity-40
                ├── dot-grid pattern — z=10 (same inward mask)
                ├── bottom fade — z=20
                └── grid 58%/1fr (h-[100dvh]):
                    ├── Left col: motion.span eyebrow (reveal 0.05-0.15) + HeroHeadline (anchor)
                    └── Right col (with bg-bg/55 blur-2xl reading-shelf scrim):
                        ├── motion.p lead (reveal 0.40-0.55)
                        ├── motion.p trust (reveal 0.65-0.78)
                        └── motion.div CTAs (reveal 0.82-0.95, pointerEvents gated)
```

**Architecture key idea**: `useScroll` lives in `HeroScrollLocked`, returns a single `scrollYProgress` MotionValue, which threads down to (a) `HeroBackdrop` → `HeroCanvasScene` → `useFrameSequence` (drives canvas frame index) and (b) four `useScrollReveal` calls (each derives `{opacity, y}` MotionValues for one text element). Framer MotionValues bypass React's render cycle — no per-tick re-renders.

The 120 WebP frames live at `public/hero-frames/0001.webp` … `0120.webp` (~3.5 MB total, avg 30 KB/frame). The static fallback is at `public/hero-end-frame.webp` (~79 KB). Extraction is a one-shot `bun run extract-frames` (script: `scripts/extract-hero-frames.mjs`) that reads `motions/*.mp4` via `ffmpeg-static` + `ffprobe-static` (cross-platform devDeps; no system ffmpeg required).

### Layout / chrome

- [`src/components/layout/Header.tsx`](src/components/layout/Header.tsx) — sticky, glass-blur intensifies after `scrollY > 8` (Framer `useScroll`). 7 nav entries: Services, Process, Work, **Stack** (anchor `#stack`), Team, FAQ, Contact.
- [`src/components/layout/MobileMenu.tsx`](src/components/layout/MobileMenu.tsx) — hamburger → spring slide-in panel, ESC + scroll-lock. Inherits the same 7-section nav via `navSections` prop.
- [`src/components/layout/Footer.tsx`](src/components/layout/Footer.tsx) — RSC (Phase 3 demotion). 3-col block (brand + tagline / STUDIO links / ELSEWHERE socials + email) + bottom row with static `© 2019–2026 XEACODE SRL / BUCHAREST, ROMANIA` + `INDEPENDENT SINCE 2019`.

### Theming + motion utilities

- [`src/components/theme/ThemeProvider.tsx`](src/components/theme/ThemeProvider.tsx) — custom cookie-backed provider, dark default, class strategy, zero-flash SSR (the original `next-themes` was replaced in Phase 1 to avoid the React 19 inline-script warning — see `lessons.md`).
- [`src/components/theme/ThemeToggle.tsx`](src/components/theme/ThemeToggle.tsx) — Sun/Moon swap with spring transition.
- [`src/lib/motion.ts`](src/lib/motion.ts) — shared `spring` config, `usePrefersReducedMotion`, `useCoarsePointer` (both via `useSyncExternalStore`).
- [`src/lib/cn.ts`](src/lib/cn.ts) — `clsx` + `tailwind-merge`.

### i18n

Phase 2 removed Romanian and flattened the locale routing. The site is now English-only at the root path (`/`), no `/en/` prefix. `next-intl` stays for the `useTranslations` API surface so component code didn't need to be rewritten.

- [`src/i18n/request.ts`](src/i18n/request.ts) — message loader, locale hardcoded to `"en"`.
- [`messages/en.json`](messages/en.json) — all visible strings across the homepage's 8 sections.
- _Removed in Phase 2:_ `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`, `src/components/layout/LocaleSwitcher.tsx`, `messages/ro.json`, and the entire `src/app/[locale]/` directory.

### Tokens

Defined in [`src/app/globals.css`](src/app/globals.css) under `@theme inline`. Semantic names: `bg`, `bg-elevated`, `fg`, `fg-muted`, `fg-subtle`, `border`, `border-strong`, `accent`, `accent-soft`, `accent-strong`. Dark values on `:root`, light overrides on `.light`. Tuned taste-skill dials: `DESIGN_VARIANCE=6`, `MOTION_INTENSITY=7`, `VISUAL_DENSITY=3` (see [`.claude/docs/taste-skill-rules.md`](.claude/docs/taste-skill-rules.md)).

## Architecture summary

- **Routes**: single English route at `/`. `next-intl` runs in single-locale mode (Phase 2.2+2.3 removed Romanian and flattened `/en/...` → `/...`). Page is server-rendered on demand (`ƒ /` per `bun run build`) because the theme cookie is read in `layout.tsx`.
- **RSC by default**: every section shell, `Footer`, `ContactDetails`, `ProcessStep`, `ContactSuccess` (Phase 3 demoted Footer + ProcessStep + ContactDetails to RSC after their client behaviors went away). Client only where state/effects/motion-values are needed (Hero leaves, `ServicesGrid`, `ProcessTimeline`/`ProcessProgress`, `WorkRows`, `Marquee`, `ContactForm`, `Header`, `MobileMenu`, `ThemeToggle`).
- **Theme**: CSS-first dark default (no JS needed for correct first paint). Custom cookie-backed `ThemeProvider` swaps `.light`/`.dark` class on `<html>` for runtime toggling (replaced `next-themes` in Phase 1 to avoid the React 19 inline-script warning).
- **Motion**: Framer Motion for component-level animation; CSS transitions for trivial color/border. Spring physics (`stiffness: 100, damping: 20`) — no linear easing. `prefers-reduced-motion` clamps animation/transition durations to 0.001ms globally.
- **Performance**: animate `transform` + `opacity` only, never layout properties. Magnetic CTAs gated off on coarse pointers + reduced motion. Backdrop blobs use `will-change: transform`. Marquee uses CSS keyframes (no JS frame ticks). Lighthouse baseline (Phase 1.4): desktop 100/100/100/100, mobile 95/100/100/100.

## Phase Completion Status

| Phase | Title | Plan | Date shipped |
|---|---|---|---|
| 1.1 | Foundation + Hero | `~/.claude/plans/phase-1-1-foundation-hero.md` | 2026-05-11 |
| 1.2 | Content sections (Services, Process, Tech Stack) | `~/.claude/plans/phase-1-2-content-sections.md` | 2026-05-11 |
| 1.3 | Contact (mocked) + Footer | `~/.claude/plans/phase-1-3-contact-footer.md` | 2026-05-12 |
| 1.4 | SEO + perf + a11y (local-only) | `~/.claude/plans/phase-1-4-seo-perf-a11y.md` | 2026-05-12 |
| 2.1 | Copy expansion to existing sections | `~/.claude/plans/phase-2-1-copy-expansion.md` | 2026-05-12 |
| 2.2 + 2.3 | Selected Work + Team + FAQ + Romanian removal + URL flatten | `~/.claude/plans/phase-2-2-2-3-combined.md` | 2026-05-12 |
| 3 | Design Handoff Recreation (100% match to `design_handoff_xeacode/`) | `~/.claude/plans/phase-3-design-handoff-recreation.md` | 2026-05-12 |
| 4 | Hero Scroll Scene (AI-sourced 120-frame canvas scrub) | `~/.claude/plans/phase-4-hero-scroll-scene.md` | 2026-05-12 |
| 5 | Sticky Scroll-Locked Hero with Progressive Text Reveal | `~/.claude/plans/phase-5-sticky-scroll-hero.md` | 2026-05-12 |

(No automated test suite yet — verification by lint + build + manual visual diff + Lighthouse + axe-core. See [`.claude/docs/COMPLETED.md`](.claude/docs/COMPLETED.md) for one-line summaries.)

## Project documents

- [CLAUDE.md](CLAUDE.md) — portable workflow rules (plan-mode, subagents, lessons-capture).
- [PROJECT.md](PROJECT.md) — project-specific stack, architecture rules, gotchas.
- [AGENTS.md](AGENTS.md) — Next 16 reminder: read `node_modules/next/dist/docs/` before assuming an API.
- [`.claude/docs/`](.claude/docs/) — STATE.md (active board), COMPLETED.md (shipped log), lessons.md (corrections), todo.md (granular tasks), taste-skill-rules.md (distilled design constraints).

## Replacing placeholders

All visible strings live in [`messages/en.json`](messages/en.json). After Phase 3, the file ships design-handoff copy verbatim (no `[NEEDS USER INPUT]` tokens remain). Section structure: `hero`, `services.{1..4}` + eyebrow/title/subtitle, `process.{1..4}` + eyebrow/title, `work.{1..3}` + eyebrow/title/subtitle, `tech` + breadcrumb + scopeNote, `team.{stats,body.{1..3},principles.{1..4}}` + eyebrow/title, `faq.{1..5}` + eyebrow/title, `contact.{subtitle,preformNote,form,details}` + eyebrow/title, `footer.{tagline,studioLabel,elsewhereLabel,emailValue,copyright,location,independentSince}`. Replace values in place — no code change needed.

## License

Proprietary. © 2026 XeaCode.
