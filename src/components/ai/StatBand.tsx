import { Counter, Reveal } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/ai";

export interface StatBandProps {
  locale: Locale;
}

/**
 * A quiet stat strip under the hero. Not the banned hero-metric template:
 * it is a single horizontal band of four small figures with a lead-in line,
 * not the page's primary headline device.
 */
export function StatBand({ locale }: StatBandProps) {
  const t = content[locale].band;

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 sm:py-20">
      <Reveal>
        <div className="panel-couture grain px-7 py-10 sm:px-12 sm:py-12">
          <p className="max-w-[62ch] text-pretty text-[length:var(--text-lead)] leading-[1.65] text-ink-soft">
            {t.intro}
          </p>
          <span aria-hidden className="gilt-rule my-9 opacity-45" />
          <dl className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <dd className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-medium leading-none tracking-[-0.01em] text-gold [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                  <Counter
                    to={s.value}
                    prefix={s.prefix ?? ""}
                    suffix={s.suffix ?? ""}
                  />
                </dd>
                <dt className="text-sm text-ink-soft">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}

export default StatBand;
