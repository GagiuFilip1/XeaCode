import { useTranslations } from "next-intl";

/**
 * One step of the Process timeline.
 *
 * Plain stacked `<li>` per design handoff. No sticky-scroll, no min-h-[80vh],
 * no scroll-driven scale. Hairline border between siblings is provided by
 * the parent's `divide-y divide-border` — this component renders no border.
 *
 * Content: mono `0N / 0M` number row (accent `cur` + subtle `tot`),
 * mono deliverable caption, h3 title, body paragraph.
 *
 * RSC. No client interactivity required.
 */
export function ProcessStep({
  stepKey,
  index,
  total,
}: {
  stepKey: string;
  index: number;
  total: number;
}) {
  const t = useTranslations("process");

  const stepNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(total).padStart(2, "0");

  return (
    <li className="list-none py-8 max-w-[720px]">
      <div className="flex items-baseline gap-2 mb-2">
        {/* Visually-hidden accessible name for the numeric step indicator.
            We use sr-only text instead of `aria-label` on the wrapping <div>
            because ARIA 1.2 prohibits `aria-label` on the generic role
            (Lighthouse `aria-prohibited-attr`). The two visible <span>s stay
            aria-hidden so SR reads "Step N of M" exactly once. */}
        <span className="sr-only">Step {index + 1} of {total}</span>
        <span aria-hidden className="text-xs font-mono uppercase tracking-[0.2em] text-accent">
          {stepNumber}
        </span>
        <span aria-hidden className="text-xs font-mono uppercase tracking-[0.2em] text-fg-subtle">
          / {totalNumber}
        </span>
      </div>

      <p className="text-xs font-mono uppercase tracking-[0.2em] text-fg-subtle max-w-[55ch] mb-6">
        {t(`${stepKey}.deliverable`)}
      </p>

      <h3 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.025em] leading-[0.95] text-fg mb-6">
        {t(`${stepKey}.title`)}
      </h3>

      <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
        {t(`${stepKey}.description`)}
      </p>
    </li>
  );
}
