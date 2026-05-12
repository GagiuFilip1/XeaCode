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
 * The truncated UUID (`Ref: 7f3c…`) is shown as a mono caption — fits the
 * project's premium-quiet voice while reassuring the user that the
 * submission was acknowledged.
 */
export function ContactSuccess({ id }: { id: string }) {
  const t = useTranslations("contact.form");
  const reduced = usePrefersReducedMotion();

  const shortId = id.slice(0, 8);

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
      <h3 className="text-2xl md:text-[1.6rem] font-display tracking-tight text-fg mb-3">
        {t("successTitle")}
      </h3>
      <p className="text-base text-fg-muted leading-relaxed max-w-[45ch] mb-6">
        {t("successMessage")}
      </p>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
        Ref: {shortId}
      </p>
    </motion.div>
  );
}
