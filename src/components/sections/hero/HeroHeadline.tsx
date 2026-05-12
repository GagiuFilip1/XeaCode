"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Split-text headline reveal. Each word fades + slides + un-blurs in turn.
 *
 * Reduced-motion: renders the plain text instantly. No motion components mount
 * in that path, so there's nothing to "instantly finish".
 */
export function HeroHeadline({ text }: { text: string }) {
  const reduced = usePrefersReducedMotion();

  const words = useMemo(() => text.split(/(\s+)/), [text]);

  if (reduced) {
    return (
      <h1
        id="hero-headline"
        className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] text-fg"
      >
        {text}
      </h1>
    );
  }

  return (
    <h1
      id="hero-headline"
      className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] text-fg"
    >
      <motion.span
        className="inline-block"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05, delayChildren: 0.15 },
          },
        }}
      >
        {words.map((word, i) =>
          /^\s+$/.test(word) ? (
            <span key={i}>{word}</span>
          ) : (
            <motion.span
              key={i}
              className="inline-block will-change-[transform,opacity,filter]"
              variants={{
                hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 22,
                mass: 0.7,
              }}
            >
              {word}
            </motion.span>
          ),
        )}
      </motion.span>
    </h1>
  );
}
