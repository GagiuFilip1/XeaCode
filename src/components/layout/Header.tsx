"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/cn";

type NavSection =
  | "services"
  | "process"
  | "work"
  | "stack"
  | "team"
  | "faq"
  | "contact";
const NAV_SECTIONS: readonly NavSection[] = [
  "services",
  "process",
  "work",
  "stack",
  "team",
  "faq",
  "contact",
];

export function Header() {
  const t = useTranslations("header");
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full",
        "transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "bg-bg/85 backdrop-blur-lg border-b border-border"
          : "bg-bg/40 backdrop-blur-sm border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-base font-medium tracking-tight text-fg hover:text-accent transition-colors"
        >
          XeaCode
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Primary navigation"
        >
          {NAV_SECTIONS.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="text-sm text-fg-muted hover:text-fg transition-colors"
            >
              {t(`nav.${section}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu navSections={NAV_SECTIONS} />
        </div>
      </div>
    </motion.header>
  );
}
