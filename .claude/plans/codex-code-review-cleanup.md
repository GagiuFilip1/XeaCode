# Codex code-review cleanup — XeaCode hero refactor

## Context

The user asked for a code-quality / maintainability review of the most recent commit (`356ef86 "Update 1"`, +1818 / -549 LOC across 33 files). The commit was authored with ChatGPT Codex and shipped a major Hero refactor: scroll-locked hero with 180-frame WebP canvas scrub, 7-checkpoint state machine, progressive text reveals, mobile/reduced-motion fallback. **The application works correctly and Lighthouse scores stay at 100/100/100/100 desktop, 95/100/100/100 mobile** — the user wants only code-quality, reuse, and efficiency improvements with **zero behavioral or visual change**.

Three parallel review agents (Frontend Developer / Code Reviewer / Performance Benchmarker) audited the diff. Combined findings: ~40 issues. After cross-checking against the actual source (some findings were stale or based on wrong assumptions), this plan executes only the **behavior-neutral** cleanups with the highest leverage on readability, maintainability, and efficiency.

**Out of scope** (deferred — riskier or behavior-adjacent):
- Mount-gate migration to `useSyncExternalStore` (could shift SSR/CSR pre-paint behavior)
- Replacing `HeroDiscoverButton`'s rAF scroll-tween with `scrollIntoView` (different easing/timing)
- Lowering `EAGER_COUNT` for hero frames (changes network fan-out characteristics)
- Canvas-to-video handoff (unmount canvas after loop video starts) — lifecycle complexity
- `IntersectionObserver` wheel-handler refactor (current `getBoundingClientRect()` works)
- Extracting a global `<SectionEyebrow>` component (touches 8+ files, larger refactor scope)
- Extracting a `<HeroLayoutShell>` (layouts differ in padding/sizing — not a clean extraction)
- Auditing orphan i18n keys in `messages/en.json` (separate cleanup task)

**Important non-finding**: the dual `checkpointRef` + `checkpoint` state in `HeroScrollLocked.tsx` is **load-bearing, not redundant**. The wheel handler runs inside a `useEffect` and reads `checkpointRef.current` to avoid stale closures (putting `checkpoint` in the dep array would re-bind the listener on every checkpoint advance). The state mirror drives the reveal booleans. The Code Reviewer agent flagged this as redundant — they were wrong; keep as-is. Same applies to `firstAnimationCompleteRef` + `firstAnimationComplete`.

## Recommended subagent

Single **Frontend Developer** subagent executes the file-by-file edits below in one pass (the changes are surgical and inter-related — splitting across agents risks duplicate import paths and merge conflicts). Followed by a **Code Reviewer** pass on the diff before commit. Both run in the main repo (no worktree — diff is contained to the hero folder + 2 small files).

## File-by-file changes

### 1. `src/components/sections/hero/HeroDiscoverButton.tsx` — remove dead `hidden` prop

The JSDoc literally documents `hidden` as dead ("no longer used by either caller"). Neither [HeroStatic.tsx:53](src/components/sections/hero/HeroStatic.tsx:53) (`<HeroDiscoverButton />`) nor [HeroScrollLocked.tsx:242](src/components/sections/hero/HeroScrollLocked.tsx:242) (`<HeroDiscoverButton onSkipToEnd={…} revealTransition={…} />`) passes it. ~30 lines of `isHidden` branching exist for it.

- Remove `hidden?: boolean` from props
- Remove `const isHidden = hidden === true`
- Simplify `pulseAnimate` → `reduced ? undefined : { scale: [1, 1.06, 1] as const }`
- Simplify `pulseTransition` → `reduced ? transition : { scale: { duration: 1.6, repeat: 2, ease: "easeInOut" } }`
- Simplify the `<motion.button>` `animate` prop: replace the `reduced ? {opacity:…,y:…} : pulseAnimate` ternary with the cleaner `{ opacity: 1, y: 0, ...(reduced ? {} : { scale: [1, 1.06, 1] }) }` shape (or just `animate={{ opacity: 1, y: 0 }}` with the scale pulse on the transition layer when not reduced).
- Remove `style={{ pointerEvents: isHidden ? "none" : "auto" }}` entirely (auto is the default).
- Drop `will-change-transform` from the inner `discoverButtonClasses` ([line 177](src/components/sections/hero/HeroDiscoverButton.tsx:177)) — the outer wrapper at [line 141](src/components/sections/hero/HeroDiscoverButton.tsx:141) already has it; two layers compose unnecessarily.
- Rename local `t` inside `tick` ([line 94](src/components/sections/hero/HeroDiscoverButton.tsx:94)) to `progress` to stop shadowing the i18n `t` from [line 47](src/components/sections/hero/HeroDiscoverButton.tsx:47).
- Trim the outer JSDoc — drop the "retained for backwards compatibility" paragraph.

### 2. `src/components/sections/hero/use-frame-sequence.ts` — drop unused state + tighten hot path

`loadedCount` is returned but never consumed anywhere outside the hook itself (verified by grep). It triggers a React render for every one of the 180 image-load events.

- Remove `loadedCount` state, `setLoadedCount(n => n + 1)`, and `loadedCount` from the return type.
- Remove the separate `ready` state; derive `ready = frameImage !== null` in the return shape (or convert `ready` to a `useRef`-backed boolean reset only by the frame-0 load path — both work). Recommended: keep one `useState<HTMLImageElement | null>` (frameImage); compute `ready` from it on the way out.
- **Add change-detection guard** in the `useMotionValueEvent` callback ([line 206](src/components/sections/hero/use-frame-sequence.ts:206)):
  ```ts
  const lastIndexRef = useRef(-1);
  …
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!loadedRef.current.length) return;
    const clamped = Math.min(1, Math.max(0, progress));
    const desired = Math.round(clamped * (totalFrames - 1));
    if (desired === lastIndexRef.current) return;  // ← no-op guard
    const idx = findNearestLoaded(desired);
    if (idx === null) return;
    lastIndexRef.current = idx;
    const img = imagesRef.current[idx];
    if (img) setFrameImage(img);
  });
  ```
  Cuts the hottest path's wasted work (~60% of MotionValue emits land on the same frame index).
- Replace stringly-typed `framePath: string` with `"{{index}}"` placeholder with a typed `buildSrc: (oneBasedIndex: number) => string` callback prop. Caller becomes responsible for the format. Drop the existing `buildSrc = useMemo(...)` block.
- Hoist `schedule` and `cancel` polyfills above `queueBatch` ([lines 154–169](src/components/sections/hero/use-frame-sequence.ts:154)) — they're identical per invocation; build them once per effect, not once per batch.
- Drop `cleanupSchedule: ((handle: number) => void) | null = null` — use the hoisted `cancel` directly in the unmount cleanup.
- Replace `as unknown as number` ([line 165](src/components/sections/hero/use-frame-sequence.ts:165)) with a clean type — `window.setTimeout` returns `number` in DOM (`@types/dom`); the polyfill closure can be typed `(cb: IdleRequestCallback) => number` from the start.
- Trim the 51-line JSDoc to ~10 lines of essentials (purpose + behavior + SSR-safety). Drop Phase 4/5/6 history.

### 3. `src/components/sections/hero/HeroCanvasScene.tsx` — split ResizeObserver effect + drop `alpha:true`

The effect at [lines 98–138](src/components/sections/hero/HeroCanvasScene.tsx:98) declares `[seq.frameImage]` as its dep — so the `ResizeObserver` tears down and rebuilds 180 times during one play. The RO doesn't need to depend on `frameImage`; only the redraw inside its callback does.

- Add a `frameImageRef = useRef<HTMLImageElement | null>(null)` updated alongside the existing draw effect at [line 141](src/components/sections/hero/HeroCanvasScene.tsx:141).
- Split the resize effect into two:
  - **Effect 1** (empty deps `[]`): set `ctxRef`, create the `ResizeObserver`, call `applyDimensions()`. The RO callback reads `frameImageRef.current` for its redraw (so resize-during-scrub still works without re-binding).
  - **Effect 2** (deps `[seq.frameImage]`): set `frameImageRef.current = seq.frameImage`, then clear+redraw.
- Drop the `{ alpha: true }` option from `getContext("2d", { alpha: true })` ([line 105](src/components/sections/hero/HeroCanvasScene.tsx:105)) — `alpha: true` is the default. Cosmetic, but the comment-justified option is misleading.
- Move `INWARD_MASK` constant ([lines 12–13](src/components/sections/hero/HeroCanvasScene.tsx:12)) to a new shared module (see file #6 below) and import it here.
- Build the frame path with a typed builder function and pass it as `buildSrc` to `useFrameSequence` (per file #2 above). Replace `FRAME_PATH = "/hero-frames/{{index}}.webp"` with a local helper:
  ```ts
  const buildFramePath = (i: number) => `/hero-frames/${String(i).padStart(4, "0")}.webp`;
  ```
- Trim the JSDoc — drop phase-history narration (Phase 5/6 changes are in git, not the file).

### 4. `src/components/sections/hero/HeroScrollLocked.tsx` — extract `<Reveal>` + hoist motion constants

Six near-identical `motion.span / motion.p / motion.div` blocks ([lines 231–314](src/components/sections/hero/HeroScrollLocked.tsx:231)) stamp out `initial={{ opacity:0, y:20 }}` / `animate={ X ? {opacity:1,y:0} : {opacity:0,y:20} }` / `transition={revealTransition}`. Per-render they re-allocate the constant objects.

- Hoist module-level:
  ```ts
  const REVEAL_HIDDEN = { opacity: 0, y: 20 } as const;
  const REVEAL_VISIBLE = { opacity: 1, y: 0 } as const;
  const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
  const REVEAL_DURATION = 0.45;
  ```
- Build `revealTransition` per-render (still needs `reduced` branch — one ternary) using the constants above.
- Extract a small local `Reveal` component inside the same file:
  ```tsx
  function Reveal({
    as: Component = motion.div,
    show,
    transition,
    className,
    style,
    children,
  }: { … }) {
    return (
      <Component
        initial={REVEAL_HIDDEN}
        animate={show ? REVEAL_VISIBLE : REVEAL_HIDDEN}
        transition={transition}
        className={className}
        style={style}
      >
        {children}
      </Component>
    );
  }
  ```
  Then map the 5 text rows + the CTAs `motion.div` to `<Reveal as={motion.span} …>` / `<Reveal as={motion.p} …>` / `<Reveal as={motion.div} …>` calls. The CTAs row keeps its `style={{ pointerEvents: … }}`.
- Trim the 55-line JSDoc ([lines 12–66](src/components/sections/hero/HeroScrollLocked.tsx:12)) to ~10 lines: what the component does, the checkpoint contract, the lock-release rule at checkpoint 0 and `LAST_CHECKPOINT`, reduced-motion path. Drop "Previous iterations…", "Phase 6 v3", "v2 deprecated".

### 5. `src/components/sections/hero/HeroBackdrop.tsx` — absorb HeroScrollScene + dedup mask string

`HeroScrollScene` is a 2-line pass-through with one local helper (`HeroStaticBackdrop`). Inline it.

- Move the `HeroStaticBackdrop` function from `HeroScrollScene.tsx` into this file (or keep it as a tiny local helper here).
- Replace the `<HeroScrollScene scrollYProgress={…} firstAnimationComplete={…} />` call with direct conditional rendering: `scrollYProgress ? <HeroCanvasScene … /> : <HeroStaticBackdrop />`.
- Replace the two inline `radial-gradient(ellipse 80% 55% at 60% 45%, black 30%, transparent 85%)` strings in the dot-grid `<div>` ([lines 60–63](src/components/sections/hero/HeroBackdrop.tsx:60)) with the shared `INWARD_MASK` import (file #6).
- Drop the now-unused `import { HeroScrollScene } from "./HeroScrollScene";`.
- Trim JSDoc — drop the "Phase 4 history" paragraph.

### 6. NEW: `src/components/sections/hero/hero-mask.ts` — shared mask constant

```ts
// Hero backdrop inward radial mask. Applied to the canvas/static layer, the
// dot-grid overlay, and any future layer painted into the Hero backdrop —
// keeps all layers fading at the same ellipse boundary.
export const INWARD_MASK =
  "radial-gradient(ellipse 80% 55% at 60% 45%, black 30%, transparent 85%)";
```

Imported by `HeroBackdrop.tsx` and `HeroCanvasScene.tsx` (and by `HeroScrollScene.tsx` if it survives — but per file #7 it gets deleted).

### 7. DELETE: `src/components/sections/hero/HeroScrollScene.tsx`

Its content (`HeroScrollScene` switch + `HeroStaticBackdrop` helper) merges into `HeroBackdrop.tsx` per file #5. Grep confirmed the only external import is from `HeroBackdrop.tsx:4`.

### 8. `src/components/sections/hero/HeroContent.tsx` — trim JSDoc

Drop the "Pattern identical to the Phase 4 mounted gate inside HeroScrollScene" paragraph (HeroScrollScene is being deleted; the reference would dangle). Keep the SSR-safety rationale — it's load-bearing context. **Do not** touch the `useState + useEffect` mount gate itself — switching to `useSyncExternalStore` is in the deferred-out-of-scope list.

### 9. `src/components/sections/Hero.tsx` — trim JSDoc

Drop the "Phase 4 surface … is GONE" paragraph. Keep the structural notes (id, aria-labelledby, why `className="relative"`).

### 10. `src/components/sections/contact/ContactSuccess.tsx` — fix `void id;` discard

Replace `{ id }: { id: string }` destructure + `void id;` + 6-line comment with one of:
- **Option A** (minimal): rename destructure to `{ id: _id }: { id: string }` (TS convention for "deliberately unused"). Delete the comment + `void id;` line.
- **Option B** (cleaner): change prop type to no longer expose `id` and update the call site. Need to grep call sites first.

Pick **Option A** for behavior-neutral minimum-diff.

### 11. `src/components/sections/contact/ContactDetails.tsx` — drop redundant ternary

[Lines 62–66](src/components/sections/contact/ContactDetails.tsx:62) conditionally toggle `group-hover:text-accent transition-colors` based on whether `href` is set. But the `group` class is on the `<a>` ancestor only ([line 82](src/components/sections/contact/ContactDetails.tsx:82)) — the non-link `<div>` path has no `group` ancestor, so `group-hover` is **inert** there. Tailwind compiles it; the browser ignores it.

Simplify to one className:
```tsx
<span className="text-fg-muted group-hover:text-accent transition-colors">
  {icon}
</span>
```

### 12. `src/components/sections/tech/Marquee.tsx` — move aria-labels to i18n (OPTIONAL)

[Lines 35–38](src/components/sections/tech/Marquee.tsx:35) hard-code English strings `"Tools we use, primary row"` / `"Tools we use, secondary row"`. The rest of the file's user-visible content comes from next-intl. Adding two i18n keys (`tech.marqueePrimaryRowLabel` / `tech.marqueeSecondaryRowLabel`) and reading them via `useTranslations("tech")` brings parity. **Touches `messages/en.json`.**

Mark **OPTIONAL** — the rest of the plan stands on its own if the user prefers to defer this to a separate i18n-audit pass.

## Out of scope — explicitly skipped

- HeroHeadline word-reveal spring config (`{ stiffness: 120, damping: 22, mass: 0.7 }` at [lines 71–76](src/components/sections/hero/HeroHeadline.tsx:71)) is intentionally distinct from `spring` / `springSnap` in `src/lib/motion.ts`. Keep as-is.
- `goToCheckpoint`'s dual ref+state write in `HeroScrollLocked.tsx` is intentional and load-bearing. Keep as-is.
- Per-render allocation of `revealTransition` in `HeroScrollLocked.tsx` — still allocated per-render because of the `reduced` branch. The hoisted constants reduce inner-object churn; the wrapper object is single per render of the parent (6 reveals consuming it). Acceptable.
- All JSDoc comments are kept where they add load-bearing context; only phase-history narration is trimmed.

## Verification

1. **Lint** — `bun run lint` (must pass with zero errors / zero new warnings).
2. **Build** — `bun run build` (must succeed; Next 16 / Turbopack will catch typed-prop regressions and import cycles).
3. **Type-check** — covered implicitly by the build, but `tsc --noEmit` if any plan step touches type signatures.
4. **Visual / behavioral** — `bun dev` then verify in browser:
   - Hero scroll-locks normally on desktop; wheel advances through the 6 reveal segments + lock release at the last checkpoint.
   - Discover button visible immediately, pulses, click tweens to `#services`.
   - Resize the window during a scrub — canvas redraws cleanly (split-effect #3 must keep this working).
   - Mobile / coarse-pointer view (DevTools device emulation): static Hero renders, no scroll lock, no canvas mounted.
   - DevTools "Emulate CSS prefers-reduced-motion: reduce": text appears immediately, no scroll lock animation, Discover button instant-jumps to `#services`.
   - Contact form's success state still renders (no Ref id, intentional).
   - Contact details icons still hover-color on the email row, no hover state on the others.
   - Tech-stack marquee still scrolls (unless reduced-motion).
5. **Lighthouse** — re-run desktop + mobile audits, confirm scores held at 100/100/100/100 desktop and 95/100/100/100 mobile (or improved).
6. **Smoke** — open the site, scroll through the full page once, verify nothing rendered differently than before the diff.

## Cleanup

Per CLAUDE.md §1, after merge + verification: **delete this plan file** (`.claude/plans/codex-code-review-cleanup.md` once it's moved to project-local) — the code + commit message become the source of truth.
