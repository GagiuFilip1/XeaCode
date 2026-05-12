"use client";

import { Sun, Moon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const t = useTranslations("header");

  // The Context's `theme` is reconciled from localStorage on every render via
  // useSyncExternalStore — no mount-detection state needed. SSR snapshot
  // returns "dark" (matches our `:root` CSS defaults).

  const next = theme === "light" ? "dark" : "light";
  const ariaLabel =
    next === "light" ? t("themeToggleAriaLight") : t("themeToggleAriaDark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      suppressHydrationWarning
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        "text-fg-muted hover:text-fg",
        "border border-border hover:border-border-strong",
        "transition-colors duration-200",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -75, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 75, scale: 0.7 }}
          transition={spring}
          className="inline-flex"
        >
          {theme === "light" ? (
            <Sun weight="light" size={18} />
          ) : (
            <Moon weight="light" size={18} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
