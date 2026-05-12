# XeaCode Design System

A reference design system for **XeaCode** — a small, senior, independent software studio that builds bespoke web, mobile, and .NET API products for B2B teams in Europe. Their flagship surface is a single-page-scroll portfolio + services site with a quiet, gallery-tier finish (Linear / Vercel / Stripe lineage), dark by default, emerald accent.

This system extracts the visual + content fundamentals of that site into reusable tokens, components, and rules, so future agents and humans can produce on-brand artifacts (slides, mocks, prototypes, production code) without re-reading the codebase from scratch.

---

## Index

| File | Purpose |
|---|---|
| `README.md` | This document — context, content + visual foundations, iconography. |
| `SKILL.md` | Agent-Skill front-matter for downstream tooling (Claude Code, etc). |
| `colors_and_type.css` | Drop-in CSS variables for color, type, spacing, radius, shadow, easing. |
| `assets/` | Logos, wordmarks, placeholder backdrops. |
| `fonts/` | Google Fonts link reference (Geist Sans + Geist Mono). |
| `preview/` | Card-sized HTML specimens that populate the Design System tab. |
| `ui_kits/marketing/` | High-fidelity recreation of the XeaCode marketing site as a clickable HTML prototype with extracted JSX components. |

## Sources consulted

- **GitHub repo** — [`GagiuFilip1/XeaCode`](https://github.com/GagiuFilip1/XeaCode) (branch `main`).
  - `README.md`, `PROJECT.md` — stack, architecture rules, scope.
  - `src/app/globals.css` — design tokens (`@theme inline` with the locked palette + shadows).
  - `messages/en.json` — every visible string on the site; the canonical voice + copy reference.
  - `src/components/sections/**` — Hero, Services, Process, SelectedWork, TechStack, Team, FAQ, Contact, Footer.
  - `src/components/layout/Header.tsx`, `MobileMenu.tsx`.

No Figma file was provided. All visual decisions are derived from code + token definitions.

---

## What XeaCode is

A premium portfolio + services website for a senior independent software studio. Single-page scroll: **Hero → Services → Process → Work → Stack → Team → FAQ → Contact → Footer**. Dark default, optional light theme. The mock contact submit is the only stateful surface; everything else is static reading.

**Voice**: senior engineer talking peer-to-peer with a buyer. Quiet authority — no marketing slop, no exclamation marks, no emoji, no hero-glow gradients. Specificity over adjectives.

**Stack** (reference only — this design system is framework-agnostic): Next.js 16 App Router, React 19, Tailwind v4 (CSS-first `@theme inline`), Framer Motion, next-themes, Phosphor icons.

---

## Content fundamentals

### Tone

Calm, direct, technically literate. The reader is a **founder, head of engineering, or operator** who can tell a fluffy pitch from a real one in two sentences. Copy assumes that and respects it.

- **Voice**: first-person plural ("we") for the studio. Second-person ("you") for the reader. Never third-person about themselves.
- **No marketing slang**. Bans on: *synergy, leverage, unlock, supercharge, journey, solutions, world-class, cutting-edge, transformative*. The site uses *ship, harden, scope, demo, runbook, audit, codebase* instead.
- **No exclamation marks anywhere**. Periods do the work.
- **No emoji codepoints — ever**. Documented as an explicit anti-emoji policy in `PROJECT.md`. Anything that would be an icon is rendered as an inline SVG (Phosphor) or the paw mark.
- **Specific over vague**. *"p95 down from 1.4s to 180ms"* beats *"dramatic performance improvements"*. *"seven weeks, two engineers, weekly demos on Friday"* beats *"fast turnaround"*. Numbers and named artifacts are doing all of the proof work.
- **Risk-reversal patter**. Repeated motif: "Discovery is free." "Walk away with the plan." "Reply within one working day, from a real engineer, not a sales funnel." Soft but persistent.
- **NDA framing**. The studio cannot show logos or case studies — they say so plainly and turn that constraint into a credibility signal ("Our entire client list is under NDA").

### Casing

| Surface | Casing | Example |
|---|---|---|
| Display H1 / H2 | Sentence case | "A small studio. Built by senior engineers." |
| Eyebrows, labels, mono captions | UPPERCASE with `letter-spacing: 0.20em–0.28em` | "INDEPENDENT STUDIO" · "01 / 04" |
| Body | Sentence case | "We build production software for B2B teams in Europe." |
| Buttons | Sentence case, no period | "Start a conversation" · "See how we work" |
| Footer column titles | UPPERCASE mono | "QUICK LINKS" · "ELSEWHERE" |
| Service / step deliverables | Sentence case mono | "Written architecture brief, ~10 pages" |
| Stat strips | Sentence case with mid-dot separators | "60+ years of senior engineering · NDA-only client list · One working day reply · EU + RO" |

### Punctuation

- **Mid-dot** (`·`) is the canonical separator across stat strips, breadcrumbs, stack tags, footer copyright.
- **En-dash** (`–`) for ranges (*"4–8 weeks"*, *"1–2 engineers"*).
- **Em-dashes** (`—`) for thought breaks. Used freely in body copy.
- **No Oxford-comma rule enforced**; flow over consistency.
- **Numbers below ten** are spelled out in body copy (*"seven weeks", "two engineers"*) but kept as digits in stat strips and meta lines.

### Example copy fragments

- Hero subtitle: *"We build production software for B2B teams in Europe — from a founder shipping a first product, to a small operator company hiring a build out, to a platform team that needs senior reinforcement. Next.js front-ends, .NET back-ends, and the architecture work that rarely fits in a plan. First working code in week one. Most products in production within two months."*
- Services subtitle: *"Four shapes of work for a small senior development team. Every engagement is owned end-to-end by the engineer who writes the code — no juniors delegated, no offshore handoff, no agency sales layer in front of the people doing the work."*
- Principle: *"01 · Seniors only. Every line of code written by the engineer who will defend it in review six months later."*
- Easter-egg footer line: *"Built with quiet supervision."* (paw mark inline after the period.)

---

## Visual foundations

### Colors

A **3-axis palette**: dark neutrals + warm light neutrals + a single desaturated emerald accent.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `oklch(0.16 0.005 250)` (cool off-black) | `oklch(0.985 0.003 85)` (warm off-white) |
| `--bg-elevated` | `oklch(0.20 0.005 250)` | `oklch(1 0 0)` |
| `--fg` | `oklch(0.96 0.005 250)` | `oklch(0.18 0.01 250)` |
| `--fg-muted` | `oklch(0.74 0.01 250)` | `oklch(0.38 0.01 250)` |
| `--fg-subtle` | `oklch(0.62 0.008 250)` | `oklch(0.48 0.008 250)` |
| `--border` | `oklch(0.26 0.01 250)` | `oklch(0.88 0.005 250)` |
| `--border-strong` | `oklch(0.36 0.01 250)` | `oklch(0.78 0.005 250)` |
| `--accent` | `oklch(0.66 0.13 165)` (emerald) | `oklch(0.55 0.13 165)` |
| `--accent-soft` | accent @ 18% alpha | accent @ 12% alpha |
| `--accent-strong` | `oklch(0.72 0.14 165)` | `oklch(0.48 0.14 165)` |

**Rules**
- **Never pure `#000` or `#fff`.** Off-black with a cool 250-hue undertone; warm off-white with an 85-hue undertone.
- **One accent only.** Desaturated emerald. Chroma < 0.15. No purple, no AI-glow blue, no second accent.
- **Saturation cap** under ~80%. The accent has just enough chroma to read as colored, not as a tech-y neon.
- **`fg-subtle` is the WCAG floor** — it's tuned to ≥ 4.5:1 on `bg`. Below that we don't go.
- **Selection wash** uses `accent-soft` (18% on dark, 12% on light).
- A semantic **rose-500 family** appears only in form-error states (border `rose-500/50`, text `rose-300`, panel `rose-500/06`). No other red usage in the brand.

### Typography

- **Display + Body**: Geist Sans (Google Fonts). One family across the whole site. Brand-display variant uses the same family with `letter-spacing: -0.02em` and `line-height: 1`.
- **Mono**: Geist Mono. Used for eyebrows, captions, labels, stat strips, footer copyright, code.
- **No serif anywhere.** No second display face.
- **Headings**: `font-display`, `letter-spacing: -0.02em`, `line-height: 1` (`leading-[0.95]` in the codebase). Sizes: H1 `4xl → 6xl → 7xl` responsive; H2 `4xl → 5xl`; H3 `2xl–3xl` or `3xl → 4xl → 5xl` for Process steps. `tracking-tighter` consistently.
- **Body**: `text-base md:text-lg`, `leading-relaxed`, `max-w-[55ch–60ch]`. Body is `fg-muted`, never full `fg`, so headings carry contrast.
- **Eyebrows / labels / meta**: `text-[10px]–text-[11px]` `font-mono` `uppercase` `tracking-[0.18em–0.28em]`. Color shifts among `accent` (eyebrow), `fg-subtle` (label), `fg-muted` (note).
- **Numbered captions**: `01 / 04`, `02 / 04` — accent number + subtle total, mono.
- **Italic** is used sparingly — only for the *outcome line* under a work entry. It is the brand's single use of italic.

### Spacing & layout

- Container: `max-w-7xl` (1280px), horizontal padding `px-4 sm:px-6 lg:px-8`.
- Section vertical rhythm: `py-24 md:py-32`. Section header margin-bottom `mb-12 md:mb-20`.
- Body reading column caps: `max-w-[55ch]` for paragraphs, `max-w-[60ch]` for stat strips, `max-w-[40ch]` for card body.
- Grid sizes: Hero `lg:grid-cols-[minmax(0,58%)_1fr]` (asymmetric, never centered). Services `md:grid-cols-2` (2×2, never 3). Contact `lg:grid-cols-[55fr_45fr]`.
- Sticky chrome offset: header is `h-16` sticky; section anchors use `scroll-mt-20`.
- Asymmetry is enforced — taste-skill rule explicitly bans centered Hero.
- Negative space is generous (`VISUAL_DENSITY = 3`), gallery-tier.

### Borders, radii, shadows

- **Hairline rules** (`divide-y border-y border-border`) are preferred over card chrome for grouping (Work entries, FAQ, Team principles, Contact details). Cards exist where the metaphor demands a container; otherwise it's lines + space.
- **Radii**: `rounded-lg` (form fields), `rounded-2xl` (cards), `rounded-full` (CTAs, social pills, icon badges).
- **Shadow system**, three levels — each combines an **inner highlight** with a tinted drop shadow. Drop tint matches background hue (dark uses pure black; light uses transparent black). No neon glow, ever.
  - `shadow-soft`: cards at rest.
  - `shadow-card`: cards on hover / primary CTA.
  - `shadow-elevated`: not in current use, reserved for modals/popovers.

### Backgrounds

- **Solid `--bg`** under every section. No section-banded background colors.
- **Hero backdrop only** layers: three slow-drifting radial-gradient blobs (emerald + cool gray-blue + emerald), a masked dot-grid pattern at 32px pitch, and a bottom-fade gradient to `--bg`.
- **No imagery, no photography**, no illustration on the site. The brand intentionally omits visual case studies (NDA constraint) and leans on typography + space.
- **No full-bleed images**, **no repeating textures**, **no grain**.

### Motion

`MOTION_INTENSITY = 7` — present, but disciplined.

- **Spring physics, never linear easing.** Standard shape: `{ type: "spring", stiffness: 100, damping: 20 }` (some leaves stiffer, e.g. magnetic CTAs at 220/22, mass 0.6).
- **CSS easings**: `--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)` and `--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)` for non-Framer transitions.
- **Color transitions** (hover, focus, theme toggle): linear `transition-colors duration-200`. Color animations are the only place linear is allowed.
- **Hero headline**: per-word fade + slide-up + un-blur stagger (0.05s stagger, 0.15s delayed). Spring 120/22, mass 0.7.
- **Scroll reveal**: `whileInView` once-only, `margin: -80px`. Stagger 0.08–0.12s. Children fade+rise from `y: 24–32`.
- **Magnetic CTAs**: 22% cursor pull, spring-smoothed via `useMotionValue` + `useSpring` — never via React state. Gated off on coarse pointers and `prefers-reduced-motion`.
- **Marquee**: 50s linear loop, transforms-only.
- **Reduced-motion**: a global CSS rule clamps animation/transition durations to 0.001ms. Every component reads `usePrefersReducedMotion()` and renders an instant path.

### Hover, press, focus states

- **Text links**: color shift from `fg-muted` → `fg` (or `fg` → `accent` for brand links). `transition-colors duration-200`. No underline, no opacity change.
- **Primary CTA**: `bg-accent` → `bg-accent-strong` on hover. Inline arrow translates `0.5px` right (`group-hover:translate-x-0.5`). `whileTap` scale `0.98`.
- **Secondary CTA**: border `border-strong` → `fg/40` on hover, plus a faint `bg-elevated/40` fill. Same arrow shift + tap scale.
- **Cards**: lift `y: -6` (spring) + shadow rise from `soft` to `card`, border `border` → `border-strong`. No background change.
- **Social pills**: text + border darken; no background fill.
- **Focus ring**: 2px solid `accent`, `outline-offset: 3px`, `border-radius: 2px`. Generous and visible.

### Transparency & blur

- **Header** uses translucent `bg-bg/40 backdrop-blur-sm` at the top, intensifying to `bg-bg/85 backdrop-blur-lg` after `scrollY > 8`. Hairline border appears on scroll. Spring eased.
- **Form inputs** sit on `bg-bg-elevated/60`. On focus they snap to `bg-bg-elevated` and the border becomes `accent`.
- **Accent at low alpha** (`accent-soft` 12–18%) is the only non-monochrome surface fill used. Icon badges in cards, selection wash.
- **Blur is for glass chrome only.** Never for content cards.

### Component contracts

- **Cards**: `p-8 md:p-10`, `rounded-2xl`, `bg-bg-elevated`, `border-border`, `shadow-soft`, hover lift + shadow-card. A 12×12 round icon badge in `bg-accent-soft text-accent` sits at the top of each card.
- **Primary CTA**: `h-12 px-6 rounded-full bg-accent text-bg`. Includes an inline Phosphor `ArrowRight` at `weight="light"`, `size={14}`. Drop shadow `shadow-card`.
- **Secondary CTA**: same shape, transparent fill, border + body text.
- **Form field**: `rounded-lg`, label is `text-xs font-mono uppercase tracking-[0.18em] text-fg-subtle` above the input, input is `bg-bg-elevated/60` with hairline border. Error: rose tones, helper text `text-xs text-rose-300`.
- **Hairline group**: `divide-y divide-border border-y border-border` on a `<dl>` or `<ul>`, each row `py-8 md:py-10`.

---

## Iconography

- **Primary system**: [Phosphor Icons](https://phosphoricons.com/) via `@phosphor-icons/react`. Always `weight="light"` (or `"regular"` for emphasis). Stroke width `1.5` globally. Lucide is explicitly **banned** in the codebase.
- **No emoji**, ever. Anti-emoji policy documented in `PROJECT.md`.
- **The paw mark** is a custom inline SVG (`assets/paw.svg`) — five filled ellipses, one main pad plus four toes. It is the studio's mascot (founder's cat) and appears (1) in the hero backdrop dot-grid at a faint `fg/40`, and (2) inline at the end of the footer easter-egg sentence at `fg-subtle/80`. Never used as a primary brand mark.
- **Icon usage in this design system**: we recreate the Phosphor icons used in the live site as inline SVGs in `preview/icons.html` (and reference them by name elsewhere). The full Phosphor library can also be loaded via CDN: `<script src="https://unpkg.com/@phosphor-icons/web"></script>`.
- **Icons in the live site**:
  - `ArrowRight` (light, 14px) — every CTA.
  - `Cube`, `Code`, `Compass`, `Sparkle` (light, 24px) — Service cards.
  - `EnvelopeSimple`, `Link`, `Calendar` (light, 18px) — Contact details.
  - `GithubLogo`, `LinkedinLogo`, `XLogo` (light, 16px) — Footer socials.
  - `Sun`/`Moon` — Theme toggle.
  - `List`/`X` — Mobile menu.
- **No unicode glyphs as icons.** Mid-dot `·` is the one exception (used as a separator, not an icon).

---

## Font substitution note

The XeaCode codebase loads Geist Sans + Geist Mono via `next/font/google`. Geist is open-source and available on Google Fonts directly. We link the Google Fonts CDN URL from `colors_and_type.css`. **No local `.ttf`/`.woff2` files are vendored**; if offline use is required, download from <https://vercel.com/font> or <https://fonts.google.com/specimen/Geist> and place under `fonts/` — the CSS already declares the families by name.

---

## How to use this system

- **Designing a new artifact for XeaCode** (slide deck, mock, prototype): copy `colors_and_type.css` and `assets/` into the artifact's folder, link the fonts (Google Fonts), and follow the rules above. The `ui_kits/marketing/` folder has ready-to-extract JSX components for hero, cards, CTAs, form fields, FAQ rows, etc.
- **Production code**: prefer the rules in this README to a direct port of the codebase. The codebase is the canonical implementation; this design system is a portable reference.
- **One-shot Q from an agent**: read `SKILL.md`, then this README. Most answers live here.
