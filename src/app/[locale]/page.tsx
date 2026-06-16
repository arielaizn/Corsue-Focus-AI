import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { CTASection } from "@/components/shared";
import { content } from "@/content/home";
import {
  Hero,
  TrustStrip,
  Reframe,
  AcademyBuilder,
  OrbitSection,
  Pillars,
  CourseGenerator,
  Gamification,
  Analytics,
  Platform,
} from "@/components/home";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale];

  return (
    <>
      {/* 1 — Hero: logo + nebula + constellation */}
      <Hero t={t.hero} locale={locale} />

      {/* 2 — Trust marquee: integrations + AI models */}
      <TrustStrip t={t.trust} />

      {/* 3 — 8 → 1 reframe */}
      <Reframe t={t.reframe} />

      {/* 4 — Academy in one click (live create panel) */}
      <AcademyBuilder t={t.academy} locale={locale} />

      {/* 5 — The central AI: Academy OS orbit (signature) */}
      <OrbitSection t={t.orbit} locale={locale} />

      {/* 6 — Six pillars bento → deep pages */}
      <Pillars t={t.pillars} locale={locale} />

      {/* 7 — AI builds your course (prompt → full course) */}
      <CourseGenerator t={t.generator} locale={locale} />

      {/* 8 — Gamification glimpse */}
      <Gamification t={t.gamification} locale={locale} />

      {/* 9 — Analytics + AI Business Advisor */}
      <Analytics t={t.analytics} locale={locale} />

      {/* 10 — Marketplace + Mobile + API three-up */}
      <Platform t={t.platform} locale={locale} />

      {/* 11 — Closing CTA (constellation finale) */}
      <CTASection locale={locale} />
    </>
  );
}
