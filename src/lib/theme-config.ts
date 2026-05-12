/**
 * Theme configuration constants. Plain module (NO "use client" directive) so
 * both Server Components (`src/app/layout.tsx` for cookie reads) and
 * Client Components (`src/components/theme/ThemeProvider.tsx`) can import the
 * same values as regular JS literals.
 *
 * Why this file exists: Next.js's "use client" directive turns every export
 * from that file into a "Client Reference" — a stub that errors when invoked
 * or stringified server-side. Constants must live OUTSIDE a client file to be
 * safely consumed by both sides.
 *
 * See `.claude/docs/lessons.md` for the full incident notes.
 */

export type Theme = "dark" | "light";

export const THEME_COOKIE_KEY = "xeacode-theme";
export const DEFAULT_THEME: Theme = "dark";

/** Days the theme cookie persists. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
