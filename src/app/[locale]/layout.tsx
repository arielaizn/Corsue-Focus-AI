import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Rubik, Geist_Mono } from "next/font/google";
import { locales, dir, isLocale, type Locale } from "@/lib/i18n";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { NebulaBackground } from "@/components/shared/NebulaBackground";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-rubik",
  display: "swap",
});

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
      images: ["/logo-bg.png"],
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "website",
    },
    alternates: {
      languages: { he: "/he", en: "/en" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1a1d33",
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
      className={`${rubik.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap"
        />
      </head>
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
