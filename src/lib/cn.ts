import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose Tailwind class strings with conflict resolution.
 * Example: cn("p-4", condition && "p-8") → "p-8" when condition is true.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
