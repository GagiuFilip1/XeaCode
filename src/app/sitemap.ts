import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site-config";

/**
 * /sitemap.xml — Next 16 file convention.
 *
 * Single URL (the root) after Phase 2's RO removal + URL flatten. The site
 * is single-locale (English), no `/en/` prefix, no `alternates.languages`
 * needed because there are no locale variants.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
