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
    <section className="mx-auto max-w-[1240px] px-5 py-12">
      <Reveal>
        <div className="panel-premium px-6 py-8 sm:px-9 sm:py-9">
          <p className="max-w-[62ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
            {t.intro}
          </p>
          <span aria-hidden className="gilt-rule my-7 opacity-35" />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <dd className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold leading-none tracking-[-0.02em] text-gold [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
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
