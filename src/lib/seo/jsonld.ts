import {
  SITE_NAME,
  SITE_URL,
  OG_IMAGE_PATH,
  absoluteUrl,
} from "./site-config";

/**
 * JSON-LD structured-data builders.
 *
 * `ProfessionalService` schema is the canonical type for a studio/agency.
 *
 * Returned shape is a plain JS object — serialize via `JSON.stringify(obj)` at
 * the render site (`app/layout.tsx`) and inject into a
 * `<script type="application/ld+json">` element.
 *
 * Single-locale (English-only) after Phase 2's RO removal.
 */

export type ProfessionalServiceLd = {
  "@context": "https://schema.org";
  "@type": "ProfessionalService";
  name: string;
  description: string;
  url: string;
  image: string;
  areaServed: string;
  serviceType: string[];
  inLanguage: string[];
};

export function professionalServiceJsonLd(): ProfessionalServiceLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    description:
      "Senior independent software studio in Europe building production software for B2B teams. Next.js, React, TypeScript, and .NET engineering with direct senior-engineer collaboration and no junior hand-offs.",
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE_PATH),
    areaServed: "European Union",
    serviceType: [
      "Product Engineering",
      "Platform Engineering",
      "Software Architecture Consulting",
      "Embedded Senior Engineering",
      "Next.js and .NET Development",
    ],
    inLanguage: ["en"],
  };
}
