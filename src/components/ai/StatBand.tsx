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
    <section className="mx-auto max-w-[1240px] px-5 py-10">
      <Reveal>
        <div className="rounded-2xl bg-surface/30 px-6 py-7 [box-shadow:inset_0_0_0_1px_var(--color-line)] sm:px-8">
          <p className="max-w-[60ch] text-pretty text-base text-ink-soft">
            {t.intro}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dd className="font-[family-name:var(--font-display)] text-3xl font-semibold text-gold sm:text-4xl [.font-he_&]:font-[family-name:var(--font-he)]">
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
