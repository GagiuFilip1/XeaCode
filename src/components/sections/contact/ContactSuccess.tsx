"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { spring, usePrefersReducedMotion } from "@/lib/motion";

/**
 * Replaces the form once the mock returns `{ ok: true }`. Slide-up + fade-in
 * enters via Framer. Reduced-motion path renders the same JSX at identity
 * transform with no enter animation.
 *
 * Per design: no Ref caption. Card chrome (rounded-2xl border bg-elevated)
 * stays; the check-circle badge stays.
 */
export function ContactSuccess() {
  const t = useTranslations("contact.form");
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="rounded-2xl border border-border bg-bg-elevated p-8 md:p-10 shadow-soft"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent mb-6">
        <CheckCircle weight="light" size={24} />
      </div>
      <h3 className="text-2xl md:text-[1.65rem] font-display tracking-tight text-fg mb-3">
        {t("successTitle")}
      </h3>
      <p className="text-base text-fg-muted leading-relaxed max-w-[45ch]">
        {t("successMessage")}
      </p>
    </motion.div>
  );
}
