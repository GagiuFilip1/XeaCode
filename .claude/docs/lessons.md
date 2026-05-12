# Lessons Learned

Patterns and corrections captured during development. Review at session start.

## next-intl single-locale mode after dropping locale routing (2026-05-12)

**Discovery during Phase 2.2+2.3 combined ship**: When the user removed Romanian and asked for URL flattening (`/en/...` → `/...`), the question was whether to strip `next-intl` entirely or keep it for the `useTranslations` API. Keeping it was the right call — `next-intl` works cleanly in single-locale, no-routing mode without any rewrite of component code. The recipe:

1. **Delete the routing layer**: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/proxy.ts` (the next-intl middleware/proxy). No locale routing means none of these are needed.
2. **Simplify `src/i18n/request.ts`** to hardcode the locale:
   ```ts
   import { getRequestConfig } from "next-intl/server";
   export default getRequestConfig(async () => {
     const locale = "en";
     return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
   });
   ```
3. **Move `src/app/[locale]/{layout,page}.tsx` → `src/app/{layout,page}.tsx`** and drop the `params: { locale }` prop everywhere. The root layout sets `<html lang="en">` hardcoded.
4. **Set `<NextIntlClientProvider locale="en" messages={messages}>`** in the root layout. `getMessages()` still works server-side because `request.ts` returns the right locale.
5. **`next.config.ts` keeps `createNextIntlPlugin("./src/i18n/request.ts")`** — needed for the `useTranslations` API in client components.
6. **Swap `Link` imports** from `@/i18n/navigation` to plain `next/link` everywhere they were used (Header, Footer, any other component).
7. **Watch for `.next/dev/types/` cache** — Next.js generates type validators per route. If you don't `rm -rf .next` between the directory move and rebuild, you get `Type 'Route' does not satisfy the constraint '"/"'. Type '"/[locale]"' is not assignable to type '"/"'`. Solution: kill any running dev server, `rm -rf .next`, rebuild.

**Why keep next-intl at all in single-locale mode?** Because `useTranslations` is the right abstraction even with one language — it keeps every visible string in a single JSON file, ready for future re-localization, and avoids hardcoded strings scattered across components. The cost is one dependency you'd otherwise drop, but the component code stays unchanged.

**Symptom signature** when someone breaks this in a future change: build fails with `Type '"[locale]"' is not assignable to type '"/"'` from a stale type validator, OR `useTranslations` throws at runtime because `NextIntlClientProvider` isn't wrapping the tree, OR pages 404 because the `[locale]` segment was deleted but `request.ts` still expects a routed locale.

**Related cleanup**: comment-only `[locale]` path references survive the directory move because nothing breaks them — `src/lib/theme-config.ts`, `src/components/theme/ThemeProvider.tsx`, `README.md` all had stale `src/app/[locale]/layout.tsx` references after Phase 2.2+2.3 that the build couldn't catch. Grep `[locale]` after any locale-routing change.

## Next.js 16: smooth-scroll on `<html>` needs `data-scroll-behavior="smooth"` attribute (2026-05-12)

**Discovery during Sub-phase 1.4**: the project's `globals.css` had `html { scroll-behavior: smooth; }`. Next.js 16's router emits a runtime warning ("Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, add `data-scroll-behavior=\"smooth\"` to your `<html>` element.") The framework needs the data attribute to opt OUT of smooth scrolling during route transitions while keeping it ON for in-page anchor jumps.

**Fix**: add `data-scroll-behavior="smooth"` to the `<html>` element in `src/app/[locale]/layout.tsx`. CSS rule stays; the attribute tells Next's router to skip smooth-scroll for navigation. Anchor smooth-scroll within the same page still works.

**Reference**: `https://nextjs.org/docs/messages/missing-data-scroll-behavior` (Next 16+).

## Notably NOT a problem: inline JSON-LD scripts in React 19 (2026-05-12)

**Pleasant surprise** while implementing structured data in Sub-phase 1.4: rendering `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />` inside the layout JSX does NOT trigger React 19's "script in render tree" warning. The earlier `next-themes` and `next/script beforeInteractive` issues fired specifically because those scripts were **executable** inline scripts. `type="application/ld+json"` is a data block — the browser doesn't execute it — and React 19's warning doesn't apply.

**Rule of thumb**: React 19 warns about EXECUTABLE inline scripts in render output. Non-executable script-type-data (`application/ld+json`, `application/json`, etc.) is safe to render directly.

## "use client" exports become Client References — constants need a plain module (2026-05-12)

**Discovery during the cookie-based theme refactor**: a Server Component (`src/app/[locale]/layout.tsx`) imported `DEFAULT_THEME` and `THEME_COOKIE_KEY` directly from `src/components/theme/ThemeProvider.tsx`, which had `"use client"`. Next.js turned those imports into **Client References** — opaque stubs that work as props passed to Client Components but error when invoked or stringified server-side. The fallback in `readThemeFromCookie` returned the stub, which got interpolated into the `<html>` className, rendering an error string as a class attribute value.

**Rule**: a `"use client"` file's exports are all Client References from the server's perspective. **Constants, types, and pure data should live in a plain (non-"use client") module** so both server and client can consume them as regular JavaScript values.

**Application**: created `src/lib/theme-config.ts` (no directive) for `THEME_COOKIE_KEY`, `THEME_COOKIE_MAX_AGE`, `DEFAULT_THEME`, and the `Theme` type. Both `src/app/[locale]/layout.tsx` (server) and `src/components/theme/ThemeProvider.tsx` (client) now import from there.

**Symptom signature**: an error message string appears as a className, an attribute value, or in a `toString()` context — and the message itself reads *"Attempted to call X() from the server but X is on the client"*. If you see that, look for a constant being imported from a `"use client"` file by a server component.

## Inline script in React 19 / Next 16 — even via `next/script` (2026-05-12)

**Continuation of the next-themes incompat lesson**. The first fix moved the FOUC-prevention inline script to `<Script id=... strategy="beforeInteractive" dangerouslySetInnerHTML={{__html: NO_FLASH_SCRIPT}} />`. This worked initially but the React 19 "script in render tree" warning **fired again on locale switches**: the `LocaleLayout` re-renders when the `[locale]` segment changes, and `<Script>` rendered with `dangerouslySetInnerHTML` is still a `<script>` element in the React tree — Next.js can inline it during SSR but can't make React stop warning during client re-renders.

**Final fix**: dropped the inline script entirely and switched theme persistence from `localStorage` to a **request cookie**. Server reads cookie via `next/headers` `cookies()`, applies the theme class directly to `<html>` during SSR, passes the value to the client `ThemeProvider` as an `initialTheme` prop. Result: zero FOUC, zero scripts, no warnings ever.

**Trade-off**: pages opt into dynamic rendering (`cookies()` is dynamic). Routes go from `○ (Static)` to `ƒ (Dynamic) server-rendered on demand`. TTFB cost is ~50ms on Vercel — acceptable for a portfolio site. If static SSG is ever required (e.g., for a future blog index), use a different rendering strategy for that route.

**Pattern for other "needs to read storage/cookie/header on first paint" cases**: cookies (server-readable) beat localStorage (client-only) every time when the value needs to land in SSR HTML.

## RSC → Client Component boundary: function refs can't cross (2026-05-11)

**Discovery during Sub-phase 1.2** (Tech Stack section): the build crashed with `Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"`. Root cause: `src/components/sections/tech/logos.tsx` exported an array of objects each with an `Svg: () => ReactNode` function field. A Server Component (`TechStack.tsx`) imported that array and passed it as a `tiles` prop to a Client Component (`Marquee.tsx`). React Server Components must serialize props across the RSC → Client boundary, and function references aren't serializable.

**Rule**: only pass JSON-serializable data (strings, numbers, booleans, plain arrays/objects of the same) from RSC to Client Components. For dynamic rendering needs, either:
1. Pass identifiers (strings) across the boundary and let the Client Component resolve them to functions/components internally — that's what we did (refactored `TechLogo` to `{ name, label, category }` plain data, moved the `TextTile` SVG renderer into the Marquee Client Component).
2. Pre-render the dynamic JSX inside the Server Component and pass the resulting `ReactNode` as a prop or `children`.
3. Move the boundary so the dynamic data never crosses it (make the consuming wrapper a Client Component).

**How to spot this early**: if a TypeScript type passed across the RSC/Client boundary has a `() => ...`, `: Function`, `: ReactNode` (when it's not via `children`), or a `Date`/`Map`/`Set`, the build will reject it. Type-level guard: use `Serializable<T>` patterns or just keep cross-boundary types primitive.

**Why this matters for the project**: every section in Sub-phases 1.2–1.3 follows the RSC shell + Client leaf pattern (taste-skill rule §1). Whenever the shell passes data into the leaf, that data is crossing the boundary. Plain strings/numbers/category enums are safe; component constructors are not.

## `next-themes` 0.4.6 incompatible with React 19 strict script rules (2026-05-11)

**Discovery**: `next-themes` (v0.4.6, latest on npm) renders an inline `<script>` tag inside its `ThemeProvider` React component for FOUC prevention. React 19 / Next.js 16 emits a console error: *"Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client."* The library hasn't shipped a React 19-compat fix.

**Resolution**: replaced `next-themes` with a custom ~80-line `ThemeProvider` in `src/components/theme/ThemeProvider.tsx`. The custom implementation:
- Uses `useSyncExternalStore` (canonical React 19 pattern) to subscribe to localStorage.
- Exposes the same API surface (`useTheme()` returns `{ theme, setTheme, toggle }`).
- Exports a `NO_FLASH_SCRIPT` string constant.
- The pre-hydration script is injected via `next/script` with `strategy="beforeInteractive"` from `src/app/[locale]/layout.tsx` — Next.js handles it outside React's render tree, no warning.

**Why this matters**: any library that renders a `<script>` inline (third-party analytics SDKs, theme libraries, A/B testing snippets) will hit this same warning on React 19. The fix pattern is consistent: extract the script string and inject via `next/script beforeInteractive` (or `afterInteractive` for non-critical), keep the rest of the library's React tree.

**Net cost**: removed one external dep (`next-themes`); +1 lesson; ~80 lines of well-typed custom code that we fully own.

## Next.js 16: `middleware.ts` → `proxy.ts` rename (2026-05-11)

**Discovery**: Starting Next.js 16, the framework renamed the `middleware.ts` convention to `proxy.ts`. The functionality is identical — same `default` export pattern, same `config.matcher`, same `NextResponse` API — but the file MUST be named `proxy.ts` to avoid a deprecation warning at build time. The runtime still accepts `middleware.ts` (backwards-compat), but it warns.

**Authoritative reference**: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`. Quote: "Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same."

**Application**: For this project (`next-intl` integration), `createMiddleware(routing)` still returns the right function — only the FILE name needs to change. `src/middleware.ts` → `src/proxy.ts`. Build output now labels it `ƒ Proxy (Middleware)`.

**Why this matters across sessions**: AGENTS.md (created by `create-next-app` for Next 16) explicitly warns: "This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code." This rename is one of those changes — most training data (Next 14/15) still references `middleware.ts`. When in doubt on a Next.js convention, **`node_modules/next/dist/docs/` is the source of truth for this version**.

