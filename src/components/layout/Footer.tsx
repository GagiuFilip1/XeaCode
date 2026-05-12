"use client";

import { useTranslations } from "next-intl";
import { GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Paw } from "@/components/icons/Paw";
import { cn } from "@/lib/cn";

/**
 * Footer — sits below </main>. Uses `<footer>` (NOT `<section>`), no id.
 *
 * Client Component because:
 * - `useTheme()` for the theme-indicator caption.
 * - `new Date().getFullYear()` rendered at render time (dynamic, not in messages).
 *
 * Three-column layout at lg+ (brand / quick links / socials), stacked on mobile.
 * Bottom row separated by a top border, holds dynamic year + theme indicator.
 * Easter egg line is the last full-width row, centered, holds paw SVG #2.
 */

const QUICK_LINKS = ["services", "process", "tech", "contact"] as const;

const SOCIALS = [
  { Icon: GithubLogo, label: "GitHub" },
  { Icon: LinkedinLogo, label: "LinkedIn" },
  { Icon: XLogo, label: "X" },
] as const;

export function Footer() {
  const tFooter = useTranslations("footer");
  const tHeader = useTranslations("header");
  const { theme } = useTheme();

  const year = new Date().getFullYear();
  const themeLabel =
    theme === "light"
      ? tFooter("themeIndicatorLight")
      : tFooter("themeIndicatorDark");

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* 3-col block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-12 md:mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-sm">
            <Link
              href="/"
              className="font-display text-base font-medium tracking-tight text-fg hover:text-accent transition-colors w-fit"
            >
              XeaCode
            </Link>
            <p className="text-sm text-fg-muted leading-relaxed">
              {tFooter("tagline")}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="footer-quick-links" className="flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
              {tFooter("quickLinksLabel")}
            </span>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((key) => (
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

          {/* Socials */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
              {tFooter("socialsLabel")}
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
          </div>
        </div>

        {/* Bottom row — copyright + theme indicator */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs font-mono text-fg-subtle">
            <span>© {year}</span>
            <span aria-hidden className="mx-2 opacity-50">·</span>
            <span>{tFooter("copyright")}</span>
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
            {themeLabel}
          </p>
        </div>

        {/* Easter-egg line — centered, paw SVG #2 sits inline at the end */}
        <p className="mt-8 text-center text-xs font-mono text-fg-subtle">
          {tFooter("easterEgg")}
          <Paw
            className="inline-block ml-1.5 align-[-3px] text-fg-subtle/80"
            size={12}
          />
        </p>
      </div>
    </footer>
  );
}
