# Project State

> The ONE active board story. Completed work moves to COMPLETED.md.

## Phase status

| Phase | Title | Status |
|---|---|---|
| 1.1 | Foundation + Hero | Done (2026-05-11) |
| 1.2 | Content sections (Services, Process, Tech Stack) | Done (2026-05-11) |
| 1.3 | Contact (mocked) + Footer + paw easter egg #2 | Done (2026-05-12) |
| 1.4 | SEO + perf + a11y (local-only — deploy deferred) | Done (2026-05-12) |
| 1.5 (future) | Vercel deploy + production env wiring | Queued — when user is ready to ship |
| 2.1 | Copy expansion to existing sections | Done (2026-05-12) |
| 2.2 + 2.3 | Selected Work + Team + FAQ + Romanian removal + URL flatten | **Done (2026-05-12)** |

## Active board story

_**Phase 2 is complete.** All three new sections (Selected Work, Who we are, FAQ) live. Romanian removed entirely; URLs flattened from `/en/...` to `/...`. Site is now English-only, single-locale at the root path._

_**Single open content blocker:** the 3 Selected Work cards in `messages/en.json` ship as `[NEEDS USER INPUT]` tokens (per Q2=B during the combined-plan brainstorm). Cards render those literal tokens to the DOM until the user fills them with real anonymized work shapes. Not a blocker for development — blocker for public deploy._

### What's next

**Content fill — Selected Work cards** (user-driven, anytime):
- `work.{1,2,3}.{title,body,stack,meta,outcome}` in `messages/en.json`. Five tokens per card × 3 cards = 15 tokens.
- Shape per spec §6: industry/sector + tech stack + duration + role + outcome line.
- Plus 2 FAQ pricing tokens (`faq.1.a` — `[NEEDS USER INPUT — embedded retainer band]` and `[NEEDS USER INPUT — fixed-bid start]`).

**Sub-phase 1.5 — Vercel deploy + production env** (whenever ready):
- Vercel project setup + DNS + custom domain.
- Production env vars (real `siteUrl` swap in `src/lib/seo/site-config.ts`).
- Real OG image art.
- Google Search Console submission + Rich Results live validation.
- Senior Project Manager will author the 1.5 board story on "start 1.5".

**Future — .NET 10 Web API**:
- Build the real backend; swap one line in `src/lib/api/contact.ts` from `./contact.mock` to `./contact.live`.

## Recently shipped

### Sub-phases 2.2 + 2.3 (combined) + Romanian removal — 2026-05-12

- Full plan: `~/.claude/plans/phase-2-2-2-3-combined.md`
- **Combined sub-phase execution** — user redirected scope after 2.1: "do phases 2.2 and 2.3 at once" + "completely remove the Romanian section keep only the english."
- **3 new sections shipped**:
  - `src/components/sections/SelectedWork.tsx` (RSC shell) + `src/components/sections/work/WorkRows.tsx` (Client leaf — stagger reveal, pipe-separated stack tag parsing).
  - `src/components/sections/Team.tsx` (pure RSC, fully static — stats row + 3 body paragraphs + 4 hairline-separated principles).
  - `src/components/sections/Faq.tsx` (pure RSC, static `<dl>` — 7 Q/A pairs, no accordion, no JS, no hydration cost).
- **Romanian removal + URL flatten** — entire i18n routing collapsed to single-locale mode:
  - Deleted: `messages/ro.json`, `src/components/layout/LocaleSwitcher.tsx`, `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`, the entire `src/app/[locale]/` directory.
  - Moved: `src/app/[locale]/{layout,page}.tsx` → `src/app/{layout,page}.tsx`.
  - Simplified: `src/i18n/request.ts` (locale hardcoded "en"), `src/lib/seo/{site-config,jsonld}.ts` (single-locale), `src/app/sitemap.ts` (single URL).
  - URLs now at `/` (no `/en/` prefix). Build output: `ƒ /` (one dynamic route).
- **Header nav** updated to 7 entries: Services, Process, Work, Stack, Team, FAQ, Contact. LocaleSwitcher gone. `Link` import swapped from `@/i18n/navigation` → `next/link` in Header + Footer.
- **24 new message keys** added to `messages/en.json` (Team: 14; FAQ: 16; Work: 15 placeholders; nav: 3 — paths consolidated). 3 RO-only keys removed (`header.localeSwitcherAria`, `common.languageEnglish`, `common.languageRomanian`).
- **Content drafting**: Content Creator agent drafted Team + FAQ EN copy in one pass (30 keys). Selected Work intentionally ships as `[NEEDS USER INPUT]` tokens per Q2=B.
- **Pre-merge sign-off**: Brand Guardian PASS (zero flags) + Code Reviewer APPROVED (1 MINOR — stale `[locale]` doc references in `theme-config.ts`, `ThemeProvider.tsx`, `README.md` — all fixed inline before closeout).
- `bun run lint` + `bun run build` both clean. No new dependencies.

### Sub-phase 2.1 — Copy expansion to existing sections — 2026-05-12

- Full long-form plan: `~/.claude/plans/phase-2-1-copy-expansion.md`
- Parent spec: `~/.claude/plans/phase-2-content-credibility.md`
- 5 existing sections rewritten + 11 new credibility-detail keys added in bilingual EN + RO at parity. Total tokens drafted by Content Creator: 24 keys.
- **Velocity positioning landed**: aggressive duration bands (4–8wk / 3–6wk / 2–4wk / 1–2 eng × 4–12wk) reflecting Claude Code velocity edge. Hero subtitle includes "First working code in week one. Most products in production within two months."
- **Trust strip lead-with-number**: `60+ years of senior engineering · NDA-only client list · One working day reply · EU + RO` — rendered ABOVE the CTA row (Growth Hacker Wave 2 placement move).
- **Process deliverable position**: rendered ABOVE the step title (after `01/04` step number row).
- **Preform note rendered TWICE**: in Contact section header AND adjacent to submit button. NDA segment swapped for "walk away with the written plan."
- **AI-tooling hybrid mention**: ONE quiet line in `tech.subtitle` only (Q4(c) strict).
- 11 agents used across 4 waves. 1 pre-merge fix: RO metadata title calque.

### Sub-phase 1.4 — SEO + perf + a11y (local-only) — 2026-05-12

- Full long-form plan: `~/.claude/plans/phase-1-4-seo-perf-a11y.md`
- Audit summary: [`.claude/docs/audits/lighthouse-summary.md`](audits/lighthouse-summary.md)
- **Final Lighthouse (production build)**: desktop /en + /ro = **100 / 100 / 100 / 100**; mobile /en = **95 / 100 / 100 / 100**. LCP 0.6s desktop, CLS 0.

### Sub-phase 1.3 — Contact (mocked) + Footer + paw easter egg #2 — 2026-05-12

Typed-contract mock submit, 2-col Contact section with 5-state form machine, Footer with dynamic year + paw easter egg #2. Plan: `~/.claude/plans/phase-1-3-contact-footer.md`.

### Sub-phase 1.2 — Content sections — 2026-05-11

Services 2×2 stagger-reveal grid; Process sticky-scroll narrative; Tech Stack twin marquees. Plan: `~/.claude/plans/phase-1-2-content-sections.md`.

### Sub-phase 1.1 — Foundation + Hero — 2026-05-11

Next.js 16 + Bun + Tailwind v4 + EN/RO i18n + dark-default theming + Hero with magnetic CTAs + paw easter egg #1. Plan: `~/.claude/plans/phase-1-1-foundation-hero.md`.

## Hotfix history (mid-execution corrections)

- **Cookie-backed theme** (2026-05-12, between 1.2 and 1.3) — replaced `next-themes` + inline scripts with request-cookie persistence read by the server.
- **Client References from "use client" exports** (2026-05-12) — moved constants to a plain module so server consumers don't get opaque stubs.
- **ProcessStep `useScroll` target needed `relative`** (2026-05-12) — Framer warning fix.
- **Process opacity fade broke a11y contrast** (2026-05-12, during 1.4) — dropped opacity transform, scale-only depth.
- **Wordmark `aria-label` mismatched visible text** (2026-05-12, during 1.4) — dropped aria-label, visible text is the accessible name.
- **RO metadata title calque** (2026-05-12, during 2.1 pre-merge) — "Studio Premium de Dezvoltare Software" → "Studio independent de inginerie software".
- **Romanian removal + URL flatten** (2026-05-12, during 2.2+2.3 combined) — user redirect mid-phase. RO content + locale routing collapsed in one pass alongside the new sections. Documented as part of the 2.2+2.3 ship rather than a standalone hotfix because it was scoped + planned + reviewed end-to-end.
- **Stale `[locale]` doc references** (2026-05-12, during 2.2+2.3 pre-merge) — Code Reviewer flagged comment-only references in `theme-config.ts`, `ThemeProvider.tsx`, and `README.md` after the directory move. Fixed inline.
