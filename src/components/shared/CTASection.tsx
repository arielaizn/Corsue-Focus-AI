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
        <div className="relative overflow-hidden rounded-2xl bg-surface/40 px-6 py-16 text-center [box-shadow:inset_0_0_0_1px_oklch(0.62_0.2_264_/_0.4),0_30px_90px_-30px_oklch(0.6_0.25_300_/_0.5)] sm:px-12 sm:py-20">
          {/* aurora rim glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, oklch(0.6 0.25 300 / 0.22), transparent 60%), radial-gradient(50% 60% at 50% 110%, oklch(0.62 0.2 264 / 0.2), transparent 60%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 -top-6 flex justify-center opacity-80">
            <Constellation className="max-w-[180px]" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-[family-name:var(--font-display)] text-balance text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl [.font-he_&]:font-[family-name:var(--font-he)]">
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
