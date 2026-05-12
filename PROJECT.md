# PROJECT.md — XeaCode project specifics

Project-specific context for [CLAUDE.md](CLAUDE.md). Read this before answering any architecture, file-placement, command, or convention question.

For canonical inventory, see [README.md](README.md). For active phase state, see [`.claude/docs/STATE.md`](.claude/docs/STATE.md).

---

## What XeaCode is

A premium portfolio + services website for a senior independent software studio. Single-page-scroll: Hero → Services → Process → Tech Stack → Contact → Footer. Bilingual EN+RO, dark-default theme, Linear / Vercel / Stripe "quiet authority" finish bar.

**Backend posture**: explicitly deferred to a future iteration as a **.NET 10 Web API**. The current site uses a typed-contract mock submit function (added in Sub-phase 1.3) so the eventual swap is one re-export.

## Tech stack (locked)

| Layer | Choice | Version (pinned in `package.json`) | Notes |
|---|---|---|---|
| Framework | Next.js | **16.2.6** (App Router, TS, src/, `@/*` alias) | Brief said 15; latest stable at scaffold time was 16. See `AGENTS.md` — Next 16 has breaking changes from training data. |
| UI runtime | React | 19.2.4 | |
| Styling | Tailwind | v4.3 (CSS-first `@theme inline` in `globals.css`) | NO `tailwind.config.ts`. PostCSS plugin is `@tailwindcss/postcss` (NOT bare `tailwindcss`). |
| Motion | framer-motion | 12.38 | GSAP deferred — only install if a scroll-locked sequence justifies it (likely Sub-phase 1.2 Process). |
| i18n | next-intl | 4.11 | EN default + RO secondary, `/[locale]/...` routing, `localePrefix: "always"`. |
| Theming | next-themes | 0.4.6 | class strategy, dark default, `enableSystem={false}`, no FOUC. |
| Icons | `@phosphor-icons/react` | 2.1.10 | **Overrides brief's Lucide spec** per taste-skill. Standardize `strokeWidth={1.5}`. |
| Utilities | clsx + tailwind-merge | 2.1 / 3.6 | Combined via `cn()` in `src/lib/cn.ts`. |
| Fonts | Geist Sans + Geist Mono | via `next/font/google` | Loaded once in `src/app/[locale]/layout.tsx`. |
| Package manager | **Bun** | 1.3.13 | User pivoted mid-plan from pnpm/npm to Bun. Lockfile: `bun.lockb`. |
| Lint | ESLint 9 flat config | `eslint-config-next` | Strict — fail the build on errors. |

**Deferred** (do NOT install until justified): `gsap`, any email lib (Resend/SendGrid/etc — contact form is mocked through Sub-phase 1.3 then served by the future .NET API).

## Commands

```sh
bun install                # restore deps (after fresh clone)
bun dev                    # dev server (Turbopack), http://localhost:3000
bun run build              # production build (verifies SSR/SSG/types)
bun run lint               # ESLint flat config
bun start                  # serve the production build
```

**No `test` script yet.** Sub-phases 1.1–1.3 ship without an automated test suite; Sub-phase 1.4 adds Lighthouse + axe-clean a11y audit, and a small Playwright smoke test on the contact form mock. Unit tests would add coverage without proportionate value at the current scope.

## Folder structure

```
E:\Projects\Personal\XeaCode\
├── .claude/
│   └── docs/
│       ├── STATE.md                  # ONE active board story (1.1 → 1.2 etc.)
│       ├── COMPLETED.md              # one-liner log of shipped sub-phases
│       ├── lessons.md                # captured corrections (e.g. Next 16 proxy rename)
│       ├── todo.md                   # granular checklist of active phase
│       ├── taste-skill-rules.md      # distilled design constraints (load-bearing)
│       └── screenshots/phase-N-M/    # visual gates per sub-phase
├── .taste-skill/                     # gitignored — recloned per dev from Leon Lin's repo
├── AGENTS.md                         # Next 16 convention: "read docs/ before writing code"
├── CLAUDE.md                         # portable workflow rules
├── PROJECT.md                        # THIS FILE — project-specific layer
├── README.md                         # public-facing inventory + quick start
├── messages/{en,ro}.json             # placeholder-keyed translations for ALL sections
├── public/                           # static assets (favicon, og-image, logos, etc.)
├── src/
│   ├── app/
│   │   ├── [locale]/                 # locale-segmented routes; owns html + body
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # single page; renders Header + Hero + section anchors
│   │   ├── favicon.ico
│   │   └── globals.css               # Tailwind v4 @import + @theme inline + tokens
│   ├── components/
│   │   ├── layout/                   # Header, LocaleSwitcher, MobileMenu
│   │   ├── sections/                 # Hero (1.1); Services/Process/Tech (1.2); Contact (1.3); Footer (1.3)
│   │   │   └── hero/                 # Hero's client leaves: Backdrop, CTA, Headline, PawDot
│   │   └── theme/                    # ThemeProvider, ThemeToggle
│   ├── i18n/
│   │   ├── routing.ts                # defineRouting (locales: ['en','ro'])
│   │   ├── navigation.ts             # typed Link, useRouter, usePathname
│   │   └── request.ts                # message loader for next-intl
│   ├── lib/
│   │   ├── cn.ts                     # clsx + tailwind-merge composer
│   │   └── motion.ts                 # spring config, usePrefersReducedMotion, useCoarsePointer
│   └── proxy.ts                      # Next 16 "proxy" (renamed from middleware.ts) — next-intl
├── next.config.ts                    # wraps with createNextIntlPlugin
├── postcss.config.mjs                # @tailwindcss/postcss plugin
├── tsconfig.json                     # path alias @/* → ./src/*
├── eslint.config.mjs                 # flat config, strict
├── package.json
└── bun.lockb
```

## Architecture rules — load-bearing

These are NOT preferences — they are enforced. If you violate one, the lint or build catches it, OR a future agent reading this file will revert your change.

1. **RSC by default.** Server Components for layouts and static content. Client Components ONLY when you need state, effects, motion values, or events. `"use client"` on the smallest leaf that needs it. Currently client: every file in `src/components/layout/`, every file in `src/components/sections/hero/` except `PawDot.tsx`, both files in `src/components/theme/`, and `src/lib/motion.ts`.

2. **Tailwind v4 CSS-first.** Tokens live in `@theme inline` inside `src/app/globals.css`. NO `tailwind.config.ts`. PostCSS plugin name is `@tailwindcss/postcss`, NOT bare `tailwindcss`.

3. **Dark is the default, in CSS itself.** `:root` carries the dark token values; `.light` overrides. The page is dark even if JS is disabled or next-themes' script delays. next-themes uses class strategy + `defaultTheme="dark"` + `enableSystem={false}`.

4. **Asymmetric Hero, never centered.** Taste-skill bans centered Hero at the tuned `DESIGN_VARIANCE=6`. `src/components/sections/Hero.tsx` uses `grid grid-cols-1 lg:grid-cols-[minmax(0,58%)_1fr]`.

5. **`min-h-[100dvh]`, NEVER `h-screen`.** iOS Safari trap. Enforced by lint + grep gate in verification.

6. **Magnetic effects use Framer `useMotionValue`/`useSpring`, NEVER `useState`.** Continuous motion in React state cascades re-renders and kills mobile perf. See `src/components/sections/hero/HeroCTA.tsx` for the canonical pattern.

7. **Reduced motion is a first-class concern.** Every animated component reads `usePrefersReducedMotion()` from `src/lib/motion.ts` and renders a no-motion path. A global CSS fallback in `globals.css` clamps animation/transition durations on `prefers-reduced-motion: reduce`.

8. **No emoji codepoints anywhere in code or content.** Taste-skill anti-emoji policy. The paw easter egg is an inline SVG (`src/components/sections/hero/PawDot.tsx`).

9. **Phosphor icons only.** Lucide is BANNED. `@phosphor-icons/react` with `weight="light"` (or `"regular"` for emphasis), `strokeWidth={1.5}` standardized globally.

10. **Single accent color, desaturated.** `oklch(0.66 0.13 165)` (emerald) on dark; `oklch(0.55 0.13 165)` on light. Saturation < 80%. No purple/blue AI glow.

11. **Off-black / warm off-white, NEVER pure `#000` / `#fff`.** Token values in `globals.css`.

12. **Proxy, not middleware.** Next 16 renamed the file convention. `src/proxy.ts`. See [`.claude/docs/lessons.md`](.claude/docs/lessons.md).

## Gotchas (read before touching the listed area)

| Area | Gotcha |
|---|---|
| Tailwind v4 PostCSS | Plugin name MUST be `@tailwindcss/postcss` in `postcss.config.mjs`. Bare `tailwindcss` silently fails — styles don't apply. |
| Next 16 proxy file | `src/proxy.ts`, NOT `src/middleware.ts`. Functionality identical, name changed. |
| `useTheme()` SSR | Returns `theme: undefined` and `resolvedTheme: undefined` during SSR + first client render before hydration. Default to `"dark"` if undefined. Use `suppressHydrationWarning` on `<html>` (already set in `[locale]/layout.tsx`). |
| `useSyncExternalStore` for media queries | React 19 lint rule `react-hooks/set-state-in-effect` flags the older `useState + useEffect` pattern. Use `useSyncExternalStore` (see `src/lib/motion.ts`). Exception: the one-time mount-detection in `ThemeToggle.tsx` has a justified `eslint-disable-next-line`. |
| Windows PowerShell | `cmd1 && cmd2` doesn't work in PS 5.1. Use `cmd1; if ($?) { cmd2 }` or use Git Bash for command chaining. Documented one-per-line in `README.md`. |
| `create-next-app` and capital-letter dirs | npm package names disallow capitals; `XeaCode` dir name caused scaffold refusal. Workaround: scaffold to lowercase `xeacode/` subdir, then merge contents up. Already done; recurs only if rescaffolding. |
| next-intl message keys | Every section across ALL sub-phases is keyed in `messages/{en,ro}.json` with placeholders. Future sub-phases ONLY fill copy — they don't add new keys (unless a new section is added). |
| Bun postinstall blocks | Bun blocks postinstall scripts for untrusted deps by default. `sharp` and `unrs-resolver` are listed in `trustedDependencies` in package.json. Run `bun pm trust <pkg>` if new ones surface. |

## Sub-phase recommendations (subagent strategy)

| Sub-phase | Recommended subagents |
|---|---|
| 1.1 Foundation + Hero (DONE) | `Senior Project Manager` (STATE.md), `Plan` (long-form plan), `Code Reviewer` (pre-merge review) |
| 1.2 Content sections | `UI Designer` (layout exploration for Services / Process / Tech), `Frontend Developer` (component impl), `Code Reviewer` |
| 1.3 Contact + Footer + paw | `Frontend Developer`, `Code Reviewer`. The mock contact contract is small enough not to need a Backend Architect. |
| 1.4 SEO + perf + a11y + deploy | `SEO Specialist`, `Accessibility Auditor`, `Performance Benchmarker`, `DevOps Automator` (Vercel config) |
| Future iteration: .NET 10 Web API | `Backend Architect`, `Software Architect`, `API Tester` |

## Scope

**In scope (this iteration)**:
- Single-page-scroll site (sections 1–6).
- EN + RO localization with placeholder-keyed messages — real copy supplied later in a content pass.
- Dark/light theming.
- Mock contact submit (Sub-phase 1.3).
- Vercel-ready deploy config (Sub-phase 1.4).

**Out of scope (future iteration)**:
- The .NET 10 Web API.
- Blog / case studies (might land Sub-phase 2 if requested).
- CMS integration.
- Analytics / cookie banner (might land Sub-phase 1.4 if a minimal compliant notice is requested).
- Multi-page navigation (this is strictly single-page-scroll).
