"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

export function MobileMenu({
  navSections,
}: {
  navSections: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("header");

  // ESC-to-close + scroll lock while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("mobileMenuOpen")}
        aria-expanded={open}
        className={cn(
          "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full",
          "text-fg-muted hover:text-fg",
          "border border-border hover:border-border-strong transition-colors",
        )}
      >
        <List weight="light" size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("mobileMenuOpen")}
              className={cn(
                "md:hidden fixed inset-y-0 right-0 z-[70]",
                "w-[80vw] max-w-sm",
                "bg-bg border-l border-border shadow-elevated",
                "p-6 flex flex-col",
              )}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={spring}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-fg-subtle font-mono">
                  XeaCode
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("mobileMenuClose")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-border-strong text-fg-muted hover:text-fg transition-colors"
                >
                  <X weight="light" size={18} />
                </button>
              </div>
              <nav
                className="flex flex-col"
                aria-label="Mobile primary navigation"
              >
                {navSections.map((section, idx) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "py-4 text-2xl font-display tracking-tight",
                      "text-fg hover:text-accent transition-colors",
                      idx > 0 && "border-t border-border",
                    )}
                  >
                    {t(`nav.${section}`)}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
