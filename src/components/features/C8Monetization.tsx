import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { IconCard, IconUsers } from "./icons";

/** C8 — Monetization. An asymmetric bento: plans + provider strip + coupon + affiliate + CRM/email/push. */
export function C8Monetization({ locale }: { locale: Locale }) {
  const t = content[locale].c8;

  return (
    <Section tint className="py-20 sm:py-28">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-6">
        {/* Subscription plans — wide */}
        <Reveal y={24} className="md:col-span-4">
          <div className="rounded-2xl bg-surface/40 p-6 ring-line">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="text-gold"><IconCard size={16} /></span>
              {t.planLabel}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.plans.map((p, i) => (
                <div
                  key={p.name}
                  className={`rounded-xl p-4 ${
                    i === 1
                      ? "bg-bg [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.45)]"
                      : "bg-bg/60 ring-line"
                  }`}
                >
                  <div className="text-xs text-muted">{p.name}</div>
                  <div className="mt-1.5 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
                    {p.price}
                  </div>
                  <div className="text-xs text-muted">{p.cycle}</div>
                  {i === 1 && (
                    <span className="mt-3 inline-block rounded-full bg-aurora px-2.5 py-0.5 text-[11px] font-medium text-ink">
                      {locale === "he" ? "הכי נבחר" : "Most picked"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Coupon — tall accent */}
        <Reveal y={24} delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-bg-deep p-6 [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.4)]">
            <div className="text-xs font-semibold text-muted">{t.couponLabel}</div>
            <div className="my-4">
              <div className="inline-flex items-center rounded-lg border border-dashed border-gold/60 bg-[oklch(0.7_0.14_70_/_0.12)] px-4 py-2.5 font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide text-gold">
                {t.couponCode}
              </div>
            </div>
            <div className="text-sm font-medium text-ink">{t.couponOff}</div>
          </div>
        </Reveal>

        {/* Payment providers strip — wide */}
        <Reveal y={24} delay={0.05} className="md:col-span-6">
          <div className="rounded-2xl bg-surface/40 p-6 ring-line">
            <div className="text-xs font-semibold text-muted">{t.providersLabel}</div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {t.providers.map((p) => (
                <span
                  key={p}
                  className="rounded-lg bg-bg/60 px-4 py-2 text-sm font-medium text-ink-soft ring-line"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CRM / Email / Push */}
        {t.items.map((it, i) => (
          <Reveal key={it.n} y={24} delay={0.04 * i} className="md:col-span-2">
            <div className="flex h-full flex-col rounded-2xl bg-surface/40 p-5 ring-line">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg/70 text-gold ring-line">
                <IconUsers size={16} />
              </span>
              <div className="mt-3 text-sm font-medium text-ink">{it.label}</div>
              <p className="mt-1 text-xs text-ink-soft">{it.desc}</p>
            </div>
          </Reveal>
        ))}

        {/* Affiliate — wide closer */}
        <Reveal y={24} delay={0.05} className="md:col-span-6">
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-[oklch(0.62_0.2_264_/_0.1)] p-6 [box-shadow:inset_0_0_0_1px_oklch(0.62_0.2_264_/_0.4)] sm:flex-row sm:items-center">
            <div>
              <div className="text-sm font-semibold text-ink">{t.affiliateLabel}</div>
              <p className="mt-1 text-sm text-ink-soft">{t.affiliateText}</p>
            </div>
            <div className="ms-auto flex items-center gap-2 rounded-lg bg-bg/70 px-3.5 py-2 text-xs text-ink-soft ring-line">
              {locale === "he" ? "לינק שותף ייחודי" : "Unique affiliate link"}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default C8Monetization;
