import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import {
  THEME_COOKIE_KEY,
  DEFAULT_THEME,
  type Theme,
} from "@/lib/theme-config";
import {
  SITE_URL,
  SITE_NAME,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
} from "@/lib/seo/site-config";
import { professionalServiceJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: SITE_URL,
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE_PATH,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function readThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const v = cookieStore.get(THEME_COOKIE_KEY)?.value;
  return v === "light" || v === "dark" ? v : DEFAULT_THEME;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const tCommon = await getTranslations("common");
  const theme = await readThemeFromCookie();

  const jsonLd = professionalServiceJsonLd();

  return (
    <html
      lang="en"
      className={`${theme} ${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ colorScheme: theme }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-bg text-fg flex flex-col">
        {/*
          JSON-LD structured data for `ProfessionalService` schema.
          `type="application/ld+json"` doesn't execute — React 19's
          script-in-render-tree concern is primarily about executable
          inline scripts. Validate the absence of the warning during
          verification; fall back to next/script if it fires.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/*
          Skip-to-main link — first focusable element on the page.
          Visible only when keyboard-focused. Standard a11y pattern.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-accent focus:text-bg focus:text-sm focus:font-medium focus:outline-none focus:shadow-card"
        >
          {tCommon("skipToMain")}
        </a>

        <ThemeProvider initialTheme={theme}>
          <NextIntlClientProvider messages={messages} locale="en">
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
