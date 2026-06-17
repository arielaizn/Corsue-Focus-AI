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
      <section className="mx-auto max-w-[1240px] px-6 pb-24 pt-32 sm:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <Reveal>
            <span className="text-gilt inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-7 bg-gold-grad opacity-70" />
              {locale === "he" ? "תמחור" : "Pricing"}
            </span>
            <h1 className="mt-7 text-balance text-[length:var(--text-display)] font-medium leading-[1.04] tracking-[-0.01em] text-ink">
              {t.hero.title}
            </h1>
            <p className="mt-7 max-w-[62ch] text-pretty text-[length:var(--text-lead)] leading-[1.65] text-ink-soft">
              {t.hero.subtitle}
            </p>
            <ul className="mt-9 flex flex-wrap gap-2.5">
              {t.hero.chips.map((c) => (
                <li key={c}>
                  <Tag tone="default">{c}</Tag>
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
      <section className="mx-auto max-w-[1240px] px-6 py-20 sm:py-24">
        <PricingPlans locale={locale} t={t} />
      </section>

      {/* ── Lifetime (single wide spotlight panel) ── */}
      <section className="mx-auto max-w-[1240px] px-6 py-24 sm:py-32">
        <span aria-hidden className="gilt-rule mb-24 max-w-[180px] opacity-60" />
        <LifetimePanel
          locale={locale}
          t={t.lifetime}
          currency={t.toggle.currency}
        />
      </section>

      {/* ── Growth: coupons + affiliate (two distinct cards) ── */}
      <section className="mx-auto max-w-[1240px] px-6 py-24 sm:py-32">
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
      <section className="mx-auto max-w-[1240px] px-6 py-24 sm:py-32">
        <span aria-hidden className="gilt-rule mb-24 max-w-[180px] opacity-60" />
        <Reveal className="mb-14">
          <SectionHeading
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
      <section className="mx-auto max-w-[1240px] px-6 py-14">
        <PaymentStrip locale={locale} t={t.payments} />
      </section>

      {/* ── FAQ (two-column: heading left, accordion right) ── */}
      <section className="mx-auto max-w-[1240px] px-6 py-28 sm:py-40">
        <span aria-hidden className="gilt-rule mb-24 max-w-[180px] opacity-60" />
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
