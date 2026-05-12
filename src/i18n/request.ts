import { getRequestConfig } from "next-intl/server";

/**
 * next-intl request config — single-locale mode (English only).
 *
 * The site dropped Romanian + locale routing during Phase 2 (combined RO
 * removal + sub-phases 2.2/2.3). next-intl is kept for the `useTranslations`
 * API surface so component code didn't need to be rewritten. Locale is
 * hardcoded to "en" and messages always load from `messages/en.json`.
 */
export default getRequestConfig(async () => {
  const locale = "en";
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
