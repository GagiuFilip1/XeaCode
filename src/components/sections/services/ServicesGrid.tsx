"use client";

import { motion } from "framer-motion";
import { Cube, Code, Compass, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { spring, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * 4 service cards in a 2×2 grid. Stagger reveal on scroll-into-view.
 *
 * Icons are taste-skill-defaulted: Cube / Code / Compass / Sparkle. Swappable
 * by changing the array below in a future content pass — the same kind of
 * swap that happens for the `[SERVICE_N_TITLE]` placeholders in messages/.
 *
 * Parent variants + child variants live in this single Client Component so
 * stagger orchestration works (taste-skill rule: same tree).
 */
const SERVICES = [
  { key: "1", Icon: Cube },
  { key: "2", Icon: Code },
  { key: "3", Icon: Compass },
  { key: "4", Icon: Sparkle },
] as const;

export function ServicesGrid() {
  const t = useTranslations("services");
  const reduced = usePrefersReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {SERVICES.map(({ key, Icon }) => (
        <motion.article
          key={key}
          variants={cardVariants}
          transition={{ ...spring, mass: 0.8 }}
          whileHover={reduced ? undefined : { y: -6, transition: spring }}
          className={cn(
            "group relative",
            "p-8 md:p-10 rounded-2xl",
            "bg-bg-elevated border border-border",
            "shadow-soft",
            "transition-shadow duration-300",
            "hover:shadow-card hover:border-border-strong",
            "will-change-transform",
          )}
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent mb-6">
            <Icon weight="light" size={24} />
          </div>
          <h3 className="text-2xl md:text-[1.6rem] font-display tracking-tight text-fg mb-3">
            {t(`${key}.title`)}
          </h3>
          <p className="text-base text-fg-muted leading-relaxed max-w-[40ch]">
            {t(`${key}.description`)}
          </p>
          <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.18em] text-fg-subtle">
            {t(`${key}.engagement`)}
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
