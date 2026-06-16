import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Reveal, SectionHeading, Tag } from "@/components/ui";
import { CTASection } from "@/components/shared";
import { content } from "@/content/pricing";
import {
  PricingPlans,
  RevenueMock,
  ComparisonTable,
  FaqAccordion,
  GrowthSection,
  LifetimePanel,
  PaymentStrip,
} from "@/components/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale].meta;
  return { title: t.title, description: t.description };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale];

  return (
    <main className="overflow-clip">
      {/* ── Hero + live revenue panel (split, not centered template) ── */}
      <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-28 sm:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <h1 className="font-[family-name:var(--font-display)] text-balance text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[3.75rem] [.font-he_&]:font-[family-name:var(--font-he)]">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-[54ch] text-pretty text-lg text-ink-soft">
              {t.hero.subtitle}
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {t.hero.chips.map((c) => (
                <li key={c}>
                  <Tag tone="gold">{c}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <RevenueMock
              locale={locale}
              t={t.revenuePanel}
              currency={t.toggle.currency}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Plans + billing toggle ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-12">
        <PricingPlans locale={locale} t={t} />
      </section>

      {/* ── Lifetime (single wide spotlight panel) ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <LifetimePanel
          locale={locale}
          t={t.lifetime}
          currency={t.toggle.currency}
        />
      </section>

      {/* ── Growth: coupons + affiliate (two distinct cards) ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <Reveal className="mb-10">
          <SectionHeading
            title={locale === "he" ? "כלים שמגדילים הכנסה" : "Tools that grow revenue"}
            subtitle={
              locale === "he"
                ? "קופונים ותוכנית שותפים — מובנים מהיום הראשון, בלי תוספים."
                : "Coupons and an affiliate program — built in from day one, no add-ons."
            }
          />
        </Reveal>
        <GrowthSection locale={locale} t={t.growth} />
      </section>

      {/* ── Full comparison table ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <Reveal className="mb-10">
          <SectionHeading title={t.comparison.title} subtitle={t.comparison.subtitle} />
        </Reveal>
        <Reveal y={14}>
          <ComparisonTable locale={locale} t={t.comparison} />
        </Reveal>
      </section>

      {/* ── Payment provider strip ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-10">
        <Reveal y={14}>
          <PaymentStrip locale={locale} t={t.payments} />
        </Reveal>
      </section>

      {/* ── FAQ (two-column: heading left, accordion right) ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                as="h2"
                title={t.faq.title}
                subtitle={t.faq.subtitle}
              />
            </div>
          </Reveal>
          <Reveal y={14}>
            <FaqAccordion items={t.faq.items} />
          </Reveal>
        </div>
      </section>

      <CTASection locale={locale} />
    </main>
  );
}
