import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { IconBuild, IconShield } from "./icons";

/** C1 — Academy & White-Label. Split: copy + a live "create academy" mock panel. */
export function C1Academy({ locale }: { locale: Locale }) {
  const t = content[locale].c1;

  return (
    <Section className="py-24 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left — copy */}
        <div>
          <Reveal>
            <SectionHeading title={t.title} subtitle={t.subtitle} />
          </Reveal>
          <span aria-hidden className="gilt-rule mt-8 max-w-[140px] opacity-60" />
          <div className="mt-9 space-y-6">
            {t.points.map((p, i) => (
              <Reveal key={p.title} delay={0.05 * i} className="flex gap-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-surface text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.35)]">
                  {i === 0 ? <IconBuild /> : <IconShield />}
                </span>
                <div>
                  <div className="text-base font-medium text-ink">{p.title}</div>
                  <p className="mt-1.5 max-w-[44ch] text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — create-academy mock panel, gallery-framed */}
        <Reveal y={24} delay={0.1}>
          <div className="frame relative overflow-hidden p-6 sm:p-8">
            <span aria-hidden className="gilt-rule absolute inset-x-0 top-0 opacity-40" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-ink">{t.panelTitle}</div>
                <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-surface text-gold gilt-rim">
                  <IconBuild size={18} />
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {t.fields.map((f) => (
                  <div key={f.label}>
                    <div className="text-xs text-muted">{f.label}</div>
                    <div className="mt-1.5 rounded-[8px] bg-bg px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                      {f.value}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="text-xs text-muted">{t.brandColors}</div>
                  {/* white-label palette picker — neutral steps + one gilt brand pick */}
                  <div className="mt-1.5 flex gap-2">
                    {[
                      "bg-surface",
                      "bg-surface-2",
                      "bg-surface-3",
                      "bg-[oklch(0.76_0.105_80)]",
                    ].map((c, i) => (
                      <span
                        key={i}
                        className={`h-8 flex-1 rounded-[6px] ${c} ${
                          i === 3
                            ? "[box-shadow:inset_0_0_0_1px_oklch(0.86_0.085_85)]"
                            : "[box-shadow:inset_0_0_0_1px_var(--color-line)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[8px] bg-bg px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {t.languageValue}
                  </div>
                  <div className="rounded-[8px] bg-bg px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {t.currencyValue}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[6px] bg-ink px-4 py-3 text-center text-sm font-semibold text-bg-deep">
                {locale === "he" ? "צור אקדמיה" : "Create academy"}
              </div>
              <p className="mt-4 text-center text-xs text-muted">{t.ctaption}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default C1Academy;
