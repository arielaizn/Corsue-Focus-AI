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
      <section className="mx-auto max-w-[1240px] px-5 pb-20 pt-28 sm:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <span className="text-gilt inline-flex items-center gap-2">
              <span aria-hidden className="h-px w-6 bg-gold-grad opacity-70" />
              {locale === "he" ? "תמחור" : "Pricing"}
            </span>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-balance text-[length:var(--text-h1)] font-bold leading-[1.06] tracking-[-0.03em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
              {t.hero.title}
            </h1>
            <p className="mt-6 max-w-[60ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
              {t.hero.subtitle}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
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
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <PricingPlans locale={locale} t={t} />
      </section>

      {/* ── Lifetime (single wide spotlight panel) ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <span aria-hidden className="gilt-rule mb-20 opacity-40" />
        <LifetimePanel
          locale={locale}
          t={t.lifetime}
          currency={t.toggle.currency}
        />
      </section>

      {/* ── Growth: coupons + affiliate (two distinct cards) ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-24">
        <Reveal className="mb-12">
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
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <span aria-hidden className="gilt-rule mb-20 opacity-40" />
        <Reveal className="mb-12">
          <SectionHeading
            kicker={locale === "he" ? "השוואה מלאה" : "Full comparison"}
            title={t.comparison.title}
            subtitle={t.comparison.subtitle}
          />
        </Reveal>
        <Reveal y={14}>
          <ComparisonTable locale={locale} t={t.comparison} />
        </Reveal>
      </section>

      {/* ── Payment provider strip ── (no reveal: sits in place to break the
           uniform fade-rise rhythm on the mid-page band) */}
      <section className="mx-auto max-w-[1240px] px-5 py-12">
        <PaymentStrip locale={locale} t={t.payments} />
      </section>

      {/* ── FAQ (two-column: heading left, accordion right) ── */}
      <section className="mx-auto max-w-[1240px] px-5 py-28">
        <span aria-hidden className="gilt-rule mb-20 opacity-40" />
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
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
