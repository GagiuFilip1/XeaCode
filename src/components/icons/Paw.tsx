import { cn } from "@/lib/cn";

/**
 * Shared paw icon — the Xea easter egg (founder's cat).
 *
 * Position-agnostic. Caller passes `className` to position + color it for
 * its context:
 * - Hero backdrop dot-grid: `absolute top-[32%] right-[18%] text-fg/40`
 * - Footer easter-egg line: `inline-block ml-1 align-[-2px] text-fg-subtle`
 *
 * SVG (NEVER an emoji — taste-skill anti-emoji policy). Five ellipses:
 * one main pad + four toes, slightly varied so it feels organic.
 */
export function Paw({
  className,
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden
      className={cn(className)}
    >
      <ellipse cx="16" cy="22" rx="6.5" ry="5.2" fill="currentColor" />
      <ellipse cx="7.5" cy="13" rx="2.1" ry="2.7" fill="currentColor" />
      <ellipse cx="13" cy="8.5" rx="2" ry="2.6" fill="currentColor" />
      <ellipse cx="19" cy="8.5" rx="2" ry="2.6" fill="currentColor" />
      <ellipse cx="24.5" cy="13" rx="2.1" ry="2.7" fill="currentColor" />
    </svg>
  );
}
