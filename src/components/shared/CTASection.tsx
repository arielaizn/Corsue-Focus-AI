import { dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Constellation } from "./Constellation";

export interface CTASectionProps {
  locale: Locale;
}

/**
 * Reused bottom CTA. Aurora-rimmed panel (gold/aurora glow — NOT glass), big
 * heading + Build button + constellation accent. Bilingual via dictionary.
 */
export function CTASection({ locale }: CTASectionProps) {
  const t = dictionary[locale].cta;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:py-28">
      <Reveal>
        <div className="glow-aurora relative overflow-hidden rounded-[16px] bg-surface px-6 py-16 text-center [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.32),inset_0_1px_0_oklch(1_0_0_/_0.06),0_44px_120px_-44px_oklch(0.6_0.2_290_/_0.55)] sm:px-12 sm:py-20">
          {/* aurora wash — blue → violet → magenta, the closing crescendo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, oklch(0.62 0.215 294 / 0.24), transparent 60%), radial-gradient(46% 60% at 86% 18%, oklch(0.62 0.23 330 / 0.18), transparent 62%), radial-gradient(50% 60% at 14% 108%, oklch(0.6 0.18 262 / 0.2), transparent 62%)",
            }}
          />
          {/* film-grain texture on the panel itself */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 -top-6 flex justify-center opacity-80">
            <Constellation className="max-w-[180px]" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-[family-name:var(--font-display)] text-balance text-[length:var(--text-h1)] font-bold leading-[1.05] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
              {t.heading}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href={`/${locale}/pricing`} size="lg" magnetic>
                {t.cta}
              </Button>
              <Button href={`/${locale}/features`} size="lg" variant="secondary">
                {t.tour}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default CTASection;
