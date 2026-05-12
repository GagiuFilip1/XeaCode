import { useTranslations } from "next-intl";
import { GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Footer — sits below </main>. Uses `<footer>` (NOT `<section>`), no id.
 *
 * RSC per Phase 3 design handoff: no dynamic year, no theme indicator,
 * no easter-egg paw, no client state. Static copy from messages.footer.*.
 *
 * Three-column layout at md+ (brand+tagline / STUDIO links / ELSEWHERE socials+email),
 * stacked on mobile. Bottom row separated by a top border, holds the
 * static "© 2019–2026 XEACODE SRL · BUCHAREST, ROMANIA" copy on the left
 * and "INDEPENDENT SINCE 2019" on the right.
 *
 * Phosphor icons imported from `/dist/ssr` so the file stays RSC.
 */

const STUDIO_LINKS = ["services", "process", "work", "team"] as const;

const SOCIALS = [
  { Icon: GithubLogo, label: "GitHub" },
  { Icon: LinkedinLogo, label: "LinkedIn" },
  { Icon: XLogo, label: "X" },
] as const;

export function Footer() {
  const tFooter = useTranslations("footer");
  const tHeader = useTranslations("header");

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[clamp(64px,10vw,96px)] pb-16">
        {/* 3-col block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-14">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="font-display text-base font-medium tracking-tight text-fg hover:text-accent transition-colors w-fit"
            >
              XeaCode
            </Link>
            <p className="text-sm text-fg-muted leading-relaxed max-w-[32ch]">
              {tFooter("tagline")}
            </p>
          </div>

          {/* STUDIO links */}
          <nav
            aria-label="Footer studio links"
            className="flex flex-col gap-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
              {tFooter("studioLabel")}
            </span>
            <ul className="flex flex-col gap-2">
              {STUDIO_LINKS.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    {tHeader(`nav.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ELSEWHERE — socials + email */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
              {tFooter("elsewhereLabel")}
            </span>
            <ul className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={label}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full",
                      "border border-border text-fg-muted",
                      "hover:text-fg hover:border-border-strong transition-colors",
                    )}
                  >
                    <Icon weight="light" size={16} />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${tFooter("emailValue")}`}
              className="text-sm text-fg hover:text-accent transition-colors w-fit"
            >
              {tFooter("emailValue")}
            </a>
          </div>
        </div>

        {/* Bottom row — copyright + independent-since meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs font-mono text-fg-subtle">
            <span>{tFooter("copyright")}</span>
            <span aria-hidden className="mx-2 opacity-50">/</span>
            <span>{tFooter("location")}</span>
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
            {tFooter("independentSince")}
          </p>
        </div>
      </div>
    </footer>
  );
}
