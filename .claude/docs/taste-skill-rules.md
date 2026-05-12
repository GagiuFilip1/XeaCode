# Taste-skill rules (distilled for XeaCode)

The full source-of-truth is `.taste-skill/skills/taste-skill/SKILL.md` (gitignored — recloned per developer from `https://github.com/Leonxlnx/taste-skill`). This file is a project-tuned distillation. **When this file conflicts with the brief, this file (and by extension the skill) wins** — per the brief's explicit precedence rule.

## Skill dials — tuned for XeaCode

The skill defaults are `DESIGN_VARIANCE=8, MOTION_INTENSITY=6, VISUAL_DENSITY=4`. The brief positions XeaCode as "Linear / Vercel / Stripe — quiet authority", which is more restrained than the skill's default expressive mode (DESIGN_VARIANCE=8 is Awwwards-tier asymmetric chaos). Tuned values for this project:

| Dial | Skill default | XeaCode | Reason |
|---|---|---|---|
| DESIGN_VARIANCE | 8 | **6** | Asymmetric and offset but controlled — not full masonry chaos. Maps to brief's Linear/Vercel/Stripe aesthetic. |
| MOTION_INTENSITY | 6 | **7** | Brief explicitly demands "scroll-driven animations everywhere" + cinematic feel. One notch up from default. |
| VISUAL_DENSITY | 4 | **3** | Brief: "Generous negative space. Premium sites breathe." Airy/gallery side of the spectrum. |

## Architectural rules (load-bearing)

1. **React Server Components are the default.** Mark interactive leaf components `"use client"` and keep them small. Static layouts stay on the server.
2. **Tailwind v4 PostCSS gotcha** — use `@tailwindcss/postcss` in `postcss.config.js`, NOT bare `tailwindcss`. Easy to miss; will silently break styling.
3. **Viewport stability** — for full-height sections (Hero), use `min-h-[100dvh]`, NEVER `h-screen`. iOS Safari catastrophic layout jumping otherwise.
4. **Grid over flex math** — use CSS Grid for column structures. No `w-[calc(33%-1rem)]` percentage math.
5. **Container** — page wraps in `max-w-7xl mx-auto` (or `max-w-[1400px]`) with `px-4` on mobile.
6. **Dependency verification** — before importing anything, check `package.json`. Output the install command if missing.

## Typography

- **Display headlines**: `text-4xl md:text-6xl tracking-tighter leading-none`. Control hierarchy via weight + color, NOT just scale — no screaming H1s.
- **Body**: `text-base text-gray-600 leading-relaxed max-w-[65ch]`.
- **Font stack — Geist Sans + Geist Mono** via `next/font` (allowed by skill, matches brief). **Banned**: Inter, generic system stacks, serifs.

## Color

- **Single accent**, saturation < 80%. No purple/blue "AI glow" aesthetic. No oversaturated neons.
- **Backgrounds**: Off-black / Zinc-950 / Charcoal — never `#000000`. Light theme: warm off-white, never pure white.
- **Shadows**: tinted to background hue. No default `box-shadow` glows.
- **Stick to one palette** across the whole site — don't drift between warm and cool grays.

## Layout (DESIGN_VARIANCE=6 specific)

- **Centered Hero/H1 is BANNED.** Use left-aligned text with right-side asset, split screen, or asymmetric whitespace.
  - Brief's "Large display headline" is overridden to mean **left-aligned, asymmetric**, not centered.
- **3-column card rows are BANNED** for feature sections. Use 2-column zigzag, asymmetric grid, or Bento layouts.
  - Services (4 cards) in 2×2 is allowed (not 3-col).
  - Process (4 steps) is a sequential timeline, not a column row — also fine.
- **Cards** are used only when elevation communicates hierarchy. Prefer `border-t`, `divide-y`, or pure whitespace for grouping.
- **Mobile collapse** is mandatory: at `< md` everything becomes `w-full px-4` single column.

## Motion (MOTION_INTENSITY=7 specific)

- **Spring physics for all interactions**: `type: "spring", stiffness: 100, damping: 20`. No linear easing.
- **Stagger orchestration**: lists/grids reveal with `staggerChildren` (Framer) — parent variants + children MUST live in the same Client Component tree.
- **Magnetic buttons** (CTA pull toward cursor): use Framer's `useMotionValue` + `useTransform` — **NEVER `useState`** for continuous motion. Mobile performance dies otherwise.
- **Scroll reveals**: Framer Motion hooks. Never `window.addEventListener('scroll')`.
- **Hardware acceleration**: animate `transform` and `opacity` only. Never `top/left/width/height`.
- **Reduced motion**: full-fallback (no-motion) variant for every animation per the brief's accessibility mandate.
- **GSAP** only for full-page scrolltelling/canvas — never mix with Framer Motion in the same component tree.

## Icon library — OVERRIDE

- **Brief says Lucide; skill says `@phosphor-icons/react` OR `@radix-ui/react-icons`. Skill wins.**
- Decision: **`@phosphor-icons/react`** (richer icon set, better suits premium positioning than the more austere Radix set).
- Standardize `strokeWidth={1.5}` globally.

## Anti-emoji policy — OVERRIDE for footer paw easter egg

- **Skill bans emojis everywhere — including the footer paw the brief specs.**
- Resolution: the paw is a **custom inline SVG**, not an emoji codepoint. Place it as a `<svg>` next to the easter-egg footer copy. Same applies to the paw shape hidden in the hero background grid.

## Forbidden AI tells (apply across every section)

- No neon glows / outer box-shadow glows. Use inner borders + tinted shadows.
- No gradient text on large headers.
- No custom mouse cursors (the OS pointer stays as-is — magnetic buttons are fine, that's the BUTTON moving, not the cursor visual).
- No Inter, no serif on technical UI.
- No oversized H1s.
- No "John Doe" / "Sarah Chan" / "Acme" / "Nexus" placeholder names. (Our placeholders use `[KEY]` form anyway — safe.)
- No fake round numbers (`50%`, `99.99%`) — use organic data (`47.2%`).
- No filler-word copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen".
- No Unsplash. If we ever need stock-style placeholder imagery, use `https://picsum.photos/seed/{string}/800/600` or generated SVG.

## Hero paradigm (skill section 8)

> Stop doing centered text over a dark image. Try asymmetric Hero sections: Text cleanly aligned to the left or right. The background should feature a high-quality, relevant image with a subtle stylistic fade.

**XeaCode hero application**:
- **Layout**: Text block left-aligned, occupying ~55% column. Right side is the animated background's "asset zone" — either a mesh gradient blob anchored top-right OR the dot-grid focal area.
- **Background**: subtle animated mesh gradient (skill section 8's "Mesh Gradient Background"). Anchored top-right, fades into the page background bottom-left. This gives the asymmetric "asset" feel without using an image.
- **Paw easter egg**: hidden as one of the SVG dots in the mesh's complementary dot-grid overlay (one dot is a tiny paw silhouette, others are plain circles). Subtle.

## Pre-flight checklist (skill section 10) — applied before each section ships

- [ ] Global state used only to avoid prop-drilling, not arbitrarily?
- [ ] Mobile layout collapses to `w-full px-4 max-w-7xl mx-auto` at `< md`?
- [ ] Full-height sections use `min-h-[100dvh]`, never `h-screen`?
- [ ] `useEffect` animations have cleanup functions?
- [ ] Loading, empty, error states all provided (where applicable)?
- [ ] Cards used only when elevation communicates hierarchy?
- [ ] Perpetual animations isolated in their own memoized Client Components?

## Companion skills for later phases

Available in `.taste-skill/skills/` but not the primary driver:

- **`soft-skill`** (`high-end-visual-design`) — calm/expensive look. Skim for Sub-phase 1.2 Tech Stack marquee styling if needed.
- **`minimalist-skill`** (`minimalist-ui`) — Linear/Notion vibe. Relevant for nav + footer treatment.
- **`imagegen-frontend-web`** — image-generation, not code. Optional if we want comp art direction for review.
