import { useTranslations } from "next-intl";

/**
 * Who we are — anonymous-team section.
 *
 * Pure RSC. No client interactivity. The section is intentionally still —
 * no scroll-driven motion, no stagger, no hover. The credibility comes from
 * the content (stats + principles), not the animation.
 *
 * Layout: single column, max-w-3xl, left-aligned (asymmetric per taste-skill).
 * Three vertical blocks:
 *   A. Stats row — small mono, like Hero eyebrow / Tech category breadcrumb.
 *   B. Three short paragraphs — origin shape, what we don't do, what we hold to.
 *   C. Four principles — mono label + 1-line body, hairline-separated.
 */
const PRINCIPLES = ["1", "2", "3", "4"] as const;
const BODY_PARAS = ["1", "2", "3"] as const;

export function Team() {
  const t = useTranslations("team");

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="scroll-mt-20 py-[clamp(72px,11vw,128px)] bg-bg-elevated"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 md:mb-16 max-w-[56ch]">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent mb-4">
            {t("eyebrow")}
          </p>
          <h2
            id="team-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg whitespace-pre-line"
          >
            {t("title")}
          </h2>
        </header>

        <div className="max-w-3xl">
          {/* Block A — stats row */}
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-fg-subtle mb-12 md:mb-16 max-w-[60ch]">
            {t("stats")}
          </p>

          {/* Block B — three short paragraphs */}
          <div className="flex flex-col gap-6 md:gap-8 mb-16 md:mb-20">
            {BODY_PARAS.map((key) => (
              <p
                key={`body-${key}`}
                className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[60ch]"
              >
                {t(`body.${key}`)}
              </p>
            ))}
          </div>

          {/* Block C — principles, hairline-separated */}
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {PRINCIPLES.map((key) => (
              <li
                key={`principle-${key}`}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,18rem)_1fr] gap-2 md:gap-8 py-6 md:py-7"
              >
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
                  {t(`principles.${key}.label`)}
                </span>
                <span className="text-base text-fg-muted leading-relaxed max-w-[55ch]">
                  {t(`principles.${key}.body`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
