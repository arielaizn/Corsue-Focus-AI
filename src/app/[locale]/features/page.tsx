import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { CTASection } from "@/components/shared";
import {
  Hero,
  C1Academy,
  C2AISuite,
  C3Video,
  C4Certificates,
  C5Community,
  C6Gamification,
  C7Analytics,
  C8Monetization,
  C9Operations,
  C10Platform,
} from "@/components/features";
import { content } from "@/content/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale].hero;
  return {
    title: locale === "he" ? "יכולות · CourseFocus AI" : "Features · CourseFocus AI",
    description: t.sub,
  };
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <main>
      <Hero locale={locale} />
      <C1Academy locale={locale} />
      <C2AISuite locale={locale} />
      <C3Video locale={locale} />
      <C4Certificates locale={locale} />
      <C5Community locale={locale} />
      <C6Gamification locale={locale} />
      <C7Analytics locale={locale} />
      <C8Monetization locale={locale} />
      <C9Operations locale={locale} />
      <C10Platform locale={locale} />
      <CTASection locale={locale} />
    </main>
  );
}
