import { useTranslations } from "next-intl";
import {
  EnvelopeSimple,
  MapPin,
  Clock,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Contact details column — right side of the Contact 2-col grid.
 *
 * Three rows per design:
 *   1. EMAIL          → mailto:hello@xeacode.com (real link, hover state)
 *   2. BASED IN       → Bucharest, Romania (CET / CEST) (non-link <div>)
 *   3. TYPICAL REPLY  → One business day, written personally (non-link <div>)
 *
 * Rows 2 and 3 are non-interactive — rendered as <div>, not <a> without href,
 * because design's `<a>` without `href` is invalid HTML (Code Reviewer flag).
 * Visual outcome identical.
 *
 * RSC. Imports from `@phosphor-icons/react/dist/ssr` so icons render server-
 * side without forcing this file to "use client".
 */
export function ContactDetails() {
  const t = useTranslations("contact.details");

  return (
    <div className="flex flex-col divide-y divide-border border-y border-border">
      <Row
        icon={<EnvelopeSimple weight="light" size={18} />}
        label={t("emailLabel")}
        text={t("emailValue")}
        href={`mailto:${t("emailValue")}`}
      />
      <Row
        icon={<MapPin weight="light" size={18} />}
        label={t("locationLabel")}
        text={t("locationValue")}
      />
      <Row
        icon={<Clock weight="light" size={18} />}
        label={t("replyLabel")}
        text={t("replyValue")}
      />
    </div>
  );
}

function Row({
  icon,
  label,
  href,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  text: string;
}) {
  const inner = (
    <>
      <span
        className={
          href
            ? "text-fg-muted group-hover:text-accent transition-colors"
            : "text-fg-muted"
        }
      >
        {icon}
      </span>
      <span>{text}</span>
    </>
  );

  return (
    <div className="flex flex-col gap-2 py-6">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          className="group inline-flex items-center gap-3 text-base text-fg hover:text-accent transition-colors w-fit"
        >
          {inner}
        </a>
      ) : (
        <div className="inline-flex items-center gap-3 text-base text-fg w-fit">
          {inner}
        </div>
      )}
    </div>
  );
}
