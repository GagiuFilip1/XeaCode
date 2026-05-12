"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  THEME_COOKIE_KEY,
  THEME_COOKIE_MAX_AGE,
  type Theme,
} from "@/lib/theme-config";

/**
 * XeaCode theme provider — cookie-backed (replaced localStorage + inline-script
 * approach that tripped React 19's "script in render tree" warning).
 *
 * Architecture:
 * - Server: `src/app/layout.tsx` reads the `xeacode-theme` cookie via
 *   `next/headers`, applies the class directly to `<html>` during SSR, and
 *   passes the value down as `initialTheme` to this provider.
 * - Client: `setTheme` writes the cookie + updates `<html>` classList. On next
 *   navigation, the server reads the updated cookie and renders consistently.
 * - Result: zero FOUC, zero inline scripts, no React 19 warnings.
 * - Trade-off: pages opt into dynamic rendering via `cookies()` (no longer
 *   statically prerendered). TTFB cost ~50ms on Vercel; acceptable for a
 *   portfolio site.
 *
 * Cross-tab sync: cookies don't fire change events. Two open tabs can drift
 * until next navigation. Acceptable limitation for a theme toggle.
 *
 * Constants live in `src/lib/theme-config.ts` (a non-"use client" file) so the
 * server layout can import them as plain values rather than Client References.
 */

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function writeCookie(theme: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function applyToDom(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    writeCookie(t);
    applyToDom(t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      "useTheme must be used within a ThemeProvider (mounted in src/app/layout.tsx)",
    );
  }
  return ctx;
}

// Re-export the type for convenience (Theme is also exported from theme-config).
export type { Theme } from "@/lib/theme-config";
