"use client";

import { useMemo, Fragment } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Split-text headline reveal. Each word fades + slides + un-blurs in turn.
 * Supports `\n` in the input string (rendered as <br/>); the stagger index
 * is continuous across lines for a single, fluent reveal.
 *
 * Reduced-motion: renders plain text with the same <br/> insertions. No
 * motion components mount on that path.
 */
export function HeroHeadline({ text }: { text: string }) {
  const reduced = usePrefersReducedMotion();

  const lines = useMemo(() => text.split("\n"), [text]);

  if (reduced) {
    return (
      <h1
        id="hero-headline"
        className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-tighter leading-[0.95] text-fg"
      >
        {lines.map((line, idx) => (
          <Fragment key={idx}>
            {line}
            {idx < lines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </h1>
    );
  }

  let runningIndex = 0;

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
        {lines.map((line, lineIdx) => {
          const words = line.split(/(\s+)/);
          return (
            <Fragment key={lineIdx}>
              {words.map((word) => {
                const key = runningIndex++;
                if (/^\s+$/.test(word)) {
                  return <span key={key}>{word}</span>;
                }
                return (
                  <motion.span
                    key={key}
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
                );
              })}
              {lineIdx < lines.length - 1 ? <br /> : null}
            </Fragment>
          );
        })}
      </motion.span>
    </h1>
  );
}
