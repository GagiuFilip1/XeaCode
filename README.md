# XeaCode

> Premium portfolio + services site for a senior independent software studio.
> Single-page-scroll, EN + RO, dark default. Linear / Vercel / Stripe — quiet authority.

## Status

**Sub-phase 1.1 — Foundation + Hero**: in progress (active board story at [`.claude/docs/STATE.md`](.claude/docs/STATE.md)).

| Sub-phase | Title | Status |
|---|---|---|
| 1.1 | Foundation + Hero (scaffold, tokens, theme, i18n, Header, Hero) | In progress |
| 1.2 | Content sections (Services, Process, Tech Stack) | Queued |
| 1.3 | Contact (mocked) + Footer + paw easter egg | Queued |
| 1.4 | SEO + perf + a11y + Vercel deploy | Queued |

Long-term: a .NET 10 Web API replaces the mock contact submission. See [PROJECT.md](PROJECT.md).

## Quick start

```sh
bun install
bun dev
```

Open `http://localhost:3000` — it'll redirect to `/en`. The Romanian locale is at `/ro`.

Other commands:

```sh
bun run build            # production build (Turbopack)
bun run lint             # ESLint
bun start                # serve the production build
```

**Prerequisites**: Bun 1.3+ (`npm i -g bun` if missing). Node 20.10+ underneath.

## System inventory

### Sections (single-page-scroll)

| Anchor | Component | Owner sub-phase |
|---|---|---|
| `#hero` | [`src/components/sections/Hero.tsx`](src/components/sections/Hero.tsx) | 1.1 (live) |
| `#services` | placeholder anchor | 1.2 |
| `#process` | placeholder anchor | 1.2 |
| `#tech` | placeholder anchor | 1.2 |
| `#contact` | placeholder anchor | 1.3 |
| (footer) | placeholder | 1.3 |

### Hero composition (client leaves)

```
Hero (RSC)
└── HeroBackdrop (Client, memoized)
    ├── 3 drifting gradient blobs (Framer transforms)
    ├── dot-grid pattern (CSS background)
    ├── PawDot (RSC, inline SVG) ← easter egg #1
    └── bottom fade
└── HeroHeadline (Client) — split-text word reveal
└── HeroCTA × 2 (Client, memoized) — magnetic cursor pull
```

### Layout / chrome

- [`src/components/layout/Header.tsx`](src/components/layout/Header.tsx) — sticky, glass-blur intensifies after `scrollY > 8` (Framer `useScroll`). 7 nav entries: Services, Process, Work, Stack, Team, FAQ, Contact.
- [`src/components/layout/MobileMenu.tsx`](src/components/layout/MobileMenu.tsx) — hamburger → spring slide-in panel, ESC + scroll-lock. Inherits the same 7-section nav via `navSections` prop.

### Theming + motion utilities

- [`src/components/theme/ThemeProvider.tsx`](src/components/theme/ThemeProvider.tsx) — `next-themes`, dark default, class strategy, zero-flash.
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

- **Routes**: `/[locale]/page.tsx` is the single canonical route. `localePrefix: 'always'` means `/` redirects to `/en`. Both `/en` and `/ro` are statically generated (SSG via `generateStaticParams`).
- **RSC by default**: layout, Hero shell, PawDot. Client only where state/effects/motion-values are needed.
- **Theme**: CSS-first dark default (no JS needed for correct first paint). `next-themes` swaps `.light`/`.dark` class on `<html>` for runtime toggling.
- **Motion**: Framer Motion for component-level animation; CSS transitions for trivial color/border. Spring physics (`stiffness: 100, damping: 20`) — no linear easing.
- **Performance**: animate `transform` + `opacity` only, never layout properties. Magnetic CTAs gated off on coarse pointers + reduced motion. Backdrop blobs use `will-change: transform`.

## Phase Completion Status

| Phase | Title | Test count | Plan | Date shipped |
|---|---|---|---|---|
| 1.1 | Foundation + Hero | (no automated tests this sub-phase) | `~/.claude/plans/phase-1-1-foundation-hero.md` | _in progress_ |

(Table will gain rows as sub-phases ship — see [`.claude/docs/COMPLETED.md`](.claude/docs/COMPLETED.md) for one-line summaries.)

## Project documents

- [CLAUDE.md](CLAUDE.md) — portable workflow rules (plan-mode, subagents, lessons-capture).
- [PROJECT.md](PROJECT.md) — project-specific stack, architecture rules, gotchas.
- [AGENTS.md](AGENTS.md) — Next 16 reminder: read `node_modules/next/dist/docs/` before assuming an API.
- [`.claude/docs/`](.claude/docs/) — STATE.md (active board), COMPLETED.md (shipped log), lessons.md (corrections), todo.md (granular tasks), taste-skill-rules.md (distilled design constraints).

## Replacing placeholders

All visible strings live in [`messages/en.json`](messages/en.json) and [`messages/ro.json`](messages/ro.json) as i18n keys with `[PLACEHOLDER_NAME]` values. Replace those values to add real copy — no code change needed. Future content pass can be a single search-and-replace per locale.

## License

Proprietary. © 2026 XeaCode.
