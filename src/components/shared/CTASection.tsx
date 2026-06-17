import { dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Constellation } from "./Constellation";

export interface CTASectionProps {
  locale: Locale;
}

/**
 * Reused bottom CTA. A flat couture panel: true-surface field, neutral
 * hairline, a single gilt rule above a serif headline, one fine gilt motif.
 * NO aurora, NO glow, NO glass. Bilingual via dictionary.
 */
export function CTASection({ locale }: CTASectionProps) {
  const t = dictionary[locale].cta;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-36">
      <Reveal>
        <div className="panel-couture grain relative overflow-hidden px-6 py-20 text-center sm:px-12 sm:py-28">
          {/* a single fine gilt motif — restrained, no glow */}
          <div className="pointer-events-none mx-auto mb-10 flex justify-center opacity-90">
            <Constellation className="max-w-[140px]" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            {/* gilt rule above the headline — the signature foil thread */}
            <span
              aria-hidden
              className="gilt-rule mx-auto mb-9 max-w-[120px] opacity-70"
            />
            <h2 className="text-balance text-[length:var(--text-h1)] font-medium leading-[1.08] text-ink [.font-he_&]:font-bold">
              {t.heading}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
