import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  Bodoni_Moda,
  Hanken_Grotesk,
  Frank_Ruhl_Libre,
  Assistant,
  Geist_Mono,
} from "next/font/google";
import { locales, dir, isLocale, type Locale } from "@/lib/i18n";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { NebulaBackground } from "@/components/shared/NebulaBackground";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";

// EN display — Bodoni Moda, high-contrast fashion serif (headlines only)
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

// EN body/UI — Hanken Grotesk, clean modern grotesque
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

// HE display — Frank Ruhl Libre, elegant high-contrast Hebrew serif
const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "900"],
  variable: "--font-frank",
  display: "swap",
});

// HE body — Assistant, clean Hebrew grotesque
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

// Mono (API section only)
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const meta: Record<
  Locale,
  { title: string; description: string }
> = {
  he: {
    title: "CourseFocus AI — מערכת ההפעלה לאקדמיה הדיגיטלית שלך",
    description:
      "אקדמיה, קהילה ועסק מנויים — מנוהלים על ידי AI מרכזי אחד. בדקות, לא בחודשים.",
  },
  en: {
    title: "CourseFocus AI — Academy OS for Creators",
    description:
      "An academy, a community, and a subscription business — run by one central AI. In minutes, not months.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[isLocale(locale) ? locale : "he"];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      // og:image is supplied by ./opengraph-image.tsx (branded 1200×630 card)
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "website",
    },
    alternates: {
      languages: { he: "/he", en: "/en" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // The authenticated app (dashboard) and the auth screens render their own
  // calm shell — they opt out of the marketing Nav/Footer/Nebula chrome.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const rest = pathname.slice(`/${locale}`.length);
  const isAppShell =
    rest === "/dashboard" ||
    rest.startsWith("/dashboard/") ||
    rest === "/login" ||
    rest === "/signup";

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${bodoni.variable} ${hanken.variable} ${frank.variable} ${assistant.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className={locale === "he" ? "font-he" : "font-en"}>
        {isAppShell ? (
          children
        ) : (
          <SmoothScroll>
            <NebulaBackground variant="global" />
            <GrainOverlay />
            <Nav locale={locale} />
            <main className="relative z-[var(--z-raised)] pt-16">
              {children}
            </main>
            <Footer locale={locale} />
          </SmoothScroll>
        )}
      </body>
    </html>
  );
}
