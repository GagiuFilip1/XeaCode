/**
 * Placeholder logo data for the Tech Stack marquee.
 *
 * Serializable plain-data only (string fields) so the data passes cleanly
 * across the RSC → Client Component boundary into `<Marquee />`. The actual
 * SVG rendering lives in the Client Component (`Marquee.tsx`'s `TextTile`).
 *
 * Real brand logos arrive in a later content pass — at that point, replace
 * the `TextTile` mapping in `Marquee.tsx` with a name→component registry
 * (or load real SVG files from `public/logos/`).
 *
 * `category` references `messages/{en,ro}.json` keys `tech.categories.{1,2,3}`.
 */

export type LogoCategory = "1" | "2" | "3";

export type TechLogo = {
  name: string; // accessible name, also used for hash-based lookup on future swap
  label: string; // visible text inside the placeholder tile
  category: LogoCategory;
};

/** Row 1 — top marquee, scrolls left. Mixed categories. */
export const ROW_1: readonly TechLogo[] = [
  { name: "Next.js", label: "NEXT.JS", category: "1" },
  { name: ".NET", label: ".NET", category: "2" },
  { name: "React", label: "REACT", category: "1" },
  { name: "Vercel", label: "VERCEL", category: "3" },
  { name: "TypeScript", label: "TYPESCRIPT", category: "1" },
  { name: "PostgreSQL", label: "POSTGRES", category: "2" },
  { name: "Tailwind", label: "TAILWIND", category: "1" },
  { name: "Git", label: "GIT", category: "3" },
];

/** Row 2 — bottom marquee, scrolls right. Mixed categories. */
export const ROW_2: readonly TechLogo[] = [
  { name: "Framer Motion", label: "FRAMER", category: "1" },
  { name: "Bun", label: "BUN", category: "2" },
  { name: "Docker", label: "DOCKER", category: "3" },
  { name: "Phosphor", label: "PHOSPHOR", category: "1" },
  { name: "Node.js", label: "NODE", category: "2" },
  { name: "GitHub Actions", label: "ACTIONS", category: "3" },
  { name: "Redis", label: "REDIS", category: "2" },
  { name: "Cloudflare", label: "CLOUDFLARE", category: "3" },
];
