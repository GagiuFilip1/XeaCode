/**
 * Site-wide SEO configuration.
 *
 * Plain module (no "use client") — both server (layout.tsx, robots.ts,
 * sitemap.ts) and client (any future component that links externally) can
 * consume these constants as regular JS values. Same constraint as
 * `theme-config.ts`.
 *
 * `siteUrl` is hardcoded to `http://localhost:3000` for this local-only
 * iteration. Sub-phase 1.5 (deploy) replaces this — either by editing this
 * constant or wiring `process.env.NEXT_PUBLIC_SITE_URL` here as an override.
 *
 * The site is single-locale (English) after Phase 2's RO removal + URL flatten.
 * Multi-locale exports (`SUPPORTED_LOCALES`, `OG_LOCALE_MAP`, `localeUrl`)
 * were removed in that pass — re-add them only if a second locale is reintroduced.
 */

export const SITE_URL = "http://localhost:3000";

/** Default site identity. Real values arrive in the content pass. */
export const SITE_NAME = "XeaCode";

/** Path to the OG/Twitter card image, relative to `public/`. */
export const OG_IMAGE_PATH = "/og-image.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Absolute URL builder for a path. */
export function absoluteUrl(path: string = "/"): string {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${trimmed}`;
}
