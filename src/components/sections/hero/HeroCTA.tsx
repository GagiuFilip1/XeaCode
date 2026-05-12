"use client";

import { memo, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion, useCoarsePointer } from "@/lib/motion";

type Variant = "primary" | "secondary";

/**
 * Magnetic CTA — pulls toward the cursor on desktop, static on touch + reduced-motion.
 *
 * CRITICAL: uses Framer's useMotionValue/useSpring — NEVER useState for the
 * cursor coords (taste-skill motion rule, mobile-perf killer).
 *
 * Memoized to prevent parent re-render cascades from disrupting the spring.
 */
function HeroCTAImpl({
  href,
  variant,
  children,
}: {
  href: string;
  variant: Variant;
  children: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const magneticOff = reduced || coarse;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 22, mass: 0.6 });

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (magneticOff) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    // 22% pull — enough to feel without distorting label legibility
    mx.set(px * 0.22);
    my.set(py * 0.22);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const isPrimary = variant === "primary";

  return (
    <motion.a
      href={href}
      style={magneticOff ? undefined : { x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileTap={magneticOff ? undefined : { scale: 0.98 }}
      className={cn(
        "group inline-flex items-center justify-center gap-2",
        "h-12 px-6 rounded-full",
        "text-sm font-medium tracking-tight",
        "transition-colors duration-200",
        "will-change-transform",
        isPrimary
          ? "bg-accent text-bg hover:bg-accent-strong shadow-card"
          : "bg-transparent text-fg border border-border-strong hover:border-fg/40 hover:bg-bg-elevated/40",
      )}
    >
      <span>{children}</span>
      <ArrowRight
        weight="light"
        size={14}
        className={cn(
          "transition-transform duration-200",
          "group-hover:translate-x-0.5",
          isPrimary ? "opacity-80" : "opacity-60",
        )}
      />
    </motion.a>
  );
}

export const HeroCTA = memo(HeroCTAImpl);
