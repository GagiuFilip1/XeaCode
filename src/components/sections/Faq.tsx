import { useTranslations } from "next-intl";

/**
 * FAQ — 7 Q/A pairs, static.
 *
 * Pure RSC, no JS, no accordion. Both Q and A are always visible.
 * Rationale: more scannable, accessible by default, no hydration cost, no
 * `useState`. The visitor is at the bottom of the page already — making
 * them click-to-reveal is friction we don't need.
 *
 * Layout: single column, max-w-3xl, semantic `<dl>` with `<dt>` + `<dd>`
 * pairs. Hairline rule between entries. Display type for the question,
 * body sans for the answer.
 */
const ITEMS = ["1", "2", "3", "4", "5", "6", "7"] as const;

export function Faq() {
  const t = useTranslations("faq");

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <h2
            id="faq-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
            {t("subtitle")}
          </p>
        </header>

        <dl className="max-w-3xl flex flex-col divide-y divide-border border-y border-border">
          {ITEMS.map((key) => (
            <div
              key={`faq-${key}`}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,22rem)_1fr] gap-4 md:gap-12 py-8 md:py-10"
            >
              <dt className="font-display text-lg md:text-xl tracking-tight text-fg leading-snug">
                {t(`${key}.q`)}
              </dt>
              <dd className="text-base text-fg-muted leading-relaxed max-w-[60ch]">
                {t(`${key}.a`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
