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
          <div className="mt-8 space-y-4">
            {t.points.map((p, i) => (
              <Reveal key={p.title} delay={0.05 * i} className="flex gap-3.5">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface/70 text-gold ring-line">
                  {i === 0 ? <IconBuild /> : <IconShield />}
                </span>
                <div>
                  <div className="font-medium text-ink">{p.title}</div>
                  <p className="mt-1 text-sm text-ink-soft">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — create-academy mock panel */}
        <Reveal y={28} delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl bg-surface/40 p-6 ring-line sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[oklch(0.6_0.25_300_/_0.18)] blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink">{t.panelTitle}</div>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-aurora glow-gold text-ink">
                  <IconBuild size={18} />
                </span>
              </div>

              <div className="mt-5 space-y-3.5">
                {t.fields.map((f) => (
                  <div key={f.label}>
                    <div className="text-xs text-muted">{f.label}</div>
                    <div className="mt-1.5 rounded-lg bg-bg px-3.5 py-2.5 text-sm text-ink ring-line">
                      {f.value}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="text-xs text-muted">{t.brandColors}</div>
                  <div className="mt-1.5 flex gap-2">
                    {[
                      "bg-[oklch(0.62_0.2_264)]",
                      "bg-[oklch(0.6_0.25_300)]",
                      "bg-[oklch(0.82_0.135_84)]",
                      "bg-[oklch(0.7_0.14_70)]",
                    ].map((c, i) => (
                      <span
                        key={i}
                        className={`h-8 flex-1 rounded-lg ${c} ${i === 1 ? "ring-2 ring-gold ring-offset-2 ring-offset-bg" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-bg px-3.5 py-2.5 text-sm text-ink ring-line">
                    {t.languageValue}
                  </div>
                  <div className="rounded-lg bg-bg px-3.5 py-2.5 text-sm text-ink ring-line">
                    {t.currencyValue}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-aurora px-4 py-3 text-center text-sm font-medium text-ink glow-aurora">
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
