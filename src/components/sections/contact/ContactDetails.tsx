import { useTranslations } from "next-intl";
import { EnvelopeSimple, Link as LinkIcon, Calendar } from "@phosphor-icons/react/dist/ssr";

/**
 * Contact details column — the right side of the Contact section's 2-col grid.
 *
 * RSC: pure presentational, no client state. Three labeled blocks (email,
 * socials, calendar) using placeholder hrefs that the content pass replaces
 * with real values. Mono-caption labels match the eyebrow style used across
 * the site (Hero eyebrow, Tech category breadcrumb, form field labels).
 *
 * `divide-y border-border` groups the rows without resorting to elevated
 * cards — taste-skill §4 prefers logic-grouping over container overuse.
 *
 * Imports from `@phosphor-icons/react/dist/ssr` so the icons render in the
 * Server Component without forcing this file to "use client".
 */
export function ContactDetails() {
  const t = useTranslations("contact.details");

  return (
    <div className="flex flex-col divide-y divide-border border-y border-border">
      <Row
        icon={<EnvelopeSimple weight="light" size={18} />}
        label={t("emailLabel")}
        href="mailto:hello@xeacode.dev"
        text="hello@xeacode.dev"
      />
      <Row
        icon={<LinkIcon weight="light" size={18} />}
        label={t("socialsLabel")}
        text="@xeacode"
        href="#"
      />
      <Row
        icon={<Calendar weight="light" size={18} />}
        label={t("calendarLabel")}
        text="cal.xeacode.dev"
        href="#"
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
  href: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 py-6">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
        {label}
      </span>
      <a
        href={href}
        className="group inline-flex items-center gap-3 text-base text-fg hover:text-accent transition-colors w-fit"
      >
        <span className="text-fg-muted group-hover:text-accent transition-colors">
          {icon}
        </span>
        <span>{text}</span>
      </a>
    </div>
  );
}
