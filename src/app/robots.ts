import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site-config";

/**
 * /robots.txt — Next 16 file convention.
 *
 * Local-only: allow all crawlers, point sitemap at the local site URL. When
 * the site is deployed (Sub-phase 1.5), update `SITE_URL` in `site-config.ts`
 * and this file will automatically emit the production sitemap reference.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
