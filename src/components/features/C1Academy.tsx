import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { IconBuild, IconShield } from "./icons";

/** C1 — Academy & White-Label. Split: copy + a live "create academy" mock panel. */
export function C1Academy({ locale }: { locale: Locale }) {
  const t = content[locale].c1;

  return (
    <Section className="py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left — copy */}
        <div>
          <Reveal>
            <SectionHeading title={t.title} subtitle={t.subtitle} />
          </Reveal>
          <div className="mt-9 space-y-5">
            {t.points.map((p, i) => (
              <Reveal key={p.title} delay={0.05 * i} className="flex gap-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3),inset_0_1px_0_oklch(1_0_0_/_0.06)]">
                  {i === 0 ? <IconBuild /> : <IconShield />}
                </span>
                <div>
                  <div className="text-base font-semibold text-ink">{p.title}</div>
                  <p className="mt-1.5 max-w-[44ch] text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — create-academy mock panel */}
        <Reveal y={28} delay={0.1}>
          <div className="panel-premium glow-aurora relative overflow-hidden p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[oklch(0.62_0.23_330_/_0.18)] blur-3xl"
            />
            <span aria-hidden className="gilt-rule absolute inset-x-0 top-0 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink">{t.panelTitle}</div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-aurora text-ink gilt-rim">
                  <IconBuild size={18} />
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {t.fields.map((f) => (
                  <div key={f.label}>
                    <div className="text-xs text-muted">{f.label}</div>
                    <div className="mt-1.5 rounded-xl bg-bg-deep px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                      {f.value}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="text-xs text-muted">{t.brandColors}</div>
                  <div className="mt-1.5 flex gap-2">
                    {[
                      "bg-[oklch(0.6_0.18_262)]",
                      "bg-[oklch(0.62_0.215_294)]",
                      "bg-[oklch(0.83_0.13_88)]",
                      "bg-[oklch(0.62_0.23_330)]",
                    ].map((c, i) => (
                      <span
                        key={i}
                        className={`h-8 flex-1 rounded-lg ${c} ${i === 2 ? "ring-2 ring-gold ring-offset-2 ring-offset-surface" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-bg-deep px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {t.languageValue}
                  </div>
                  <div className="rounded-xl bg-bg-deep px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {t.currencyValue}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-aurora px-4 py-3 text-center text-sm font-semibold text-ink gilt-rim">
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
