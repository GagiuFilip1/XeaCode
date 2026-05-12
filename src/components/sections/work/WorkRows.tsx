"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { spring, usePrefersReducedMotion } from "@/lib/motion";

/**
 * Three anonymized work rows with stagger reveal on scroll-into-view.
 *
 * Visual: large display-type title + small mono meta row + body paragraph +
 * stack tags + outcome line. Hairline rules between entries (not card chrome).
 * Reads like a reading list, not a gallery — deliberate contrast with the
 * Services card grid above.
 *
 * Stack is stored pipe-separated in `messages/en.json` (e.g.,
 * "Next.js|.NET 8|PostgreSQL|Azure") and rendered with `·` separators here
 * so the JSON-to-render delimiter contract stays explicit.
 *
 * Parent variants + child variants live in this single Client Component so
 * stagger orchestration works (taste-skill rule: same tree).
 */
const ENTRIES = ["1", "2", "3"] as const;

export function WorkRows() {
  const t = useTranslations("work");
  const reduced = usePrefersReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.ol
      className="flex flex-col divide-y divide-border border-y border-border"
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {ENTRIES.map((key) => {
        const stackRaw = t(`${key}.stack`);
        const stackTags = stackRaw.split("|").map((s) => s.trim()).filter(Boolean);

        return (
          <motion.li
            key={key}
            variants={rowVariants}
            transition={{ ...spring, mass: 0.9 }}
            className="py-12 md:py-16"
          >
            <h3 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-[1.05] text-fg mb-5 max-w-[40ch]">
              {t(`${key}.title`)}
            </h3>

            <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[60ch] mb-6">
              {t(`${key}.body`)}
            </p>

            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-[0.18em] text-fg-subtle mb-3">
              {stackTags.map((tag, idx) => (
                <li key={`${key}-stack-${idx}`} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span aria-hidden className="opacity-50">·</span>
                  )}
                  <span>{tag}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-fg-subtle mb-5">
              {t(`${key}.meta`)}
            </p>

            <p className="text-sm md:text-base italic text-fg leading-relaxed max-w-[55ch]">
              {t(`${key}.outcome`)}
            </p>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
