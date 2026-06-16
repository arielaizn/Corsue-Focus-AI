import { Reveal, SectionHeading, GlowCard } from "@/components/ui";
import type { content } from "@/content/community";
import { SparkIcon } from "./SparkIcon";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["aiManager"];

export function AIManagerSection({ t }: { t: T }) {
  return (
    <section className="relative mx-auto max-w-[1240px] px-5 py-20 sm:py-24">
      <Reveal>
        <SectionHeading kicker={t.botName} title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch lg:gap-8">
        {/* duties — staggered list, not a card grid */}
        <Reveal y={26}>
          <ol className="flex h-full flex-col gap-3">
            {t.duties.map((d, i) => (
              <li
                key={d.title}
                className="flex gap-4 rounded-xl bg-surface/45 p-5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[oklch(0.6_0.25_300_/_0.18)] text-sm font-semibold tabular-nums text-[oklch(0.82_0.15_300)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{d.title}</h3>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-ink-soft">{d.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* live AI activity log — the ONE sanctioned glass panel */}
        <Reveal y={26} delay={0.08}>
          <GlowCard tone="aurora" className="h-full">
            <div className="flex items-center gap-3">
              <span className="bg-aurora glow-aurora grid h-10 w-10 place-items-center rounded-xl text-ink">
                <SparkIcon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{t.botName}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.15_150)]" />
                  24/7
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
              {t.feedNote}
            </p>
            <ul className="mt-3 space-y-3">
              {t.sampleActions.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <div className="flex-1">
                    <p className="text-pretty text-sm leading-relaxed text-ink-soft">
                      <span className="font-semibold text-gold">{a.actor}</span> {a.action}
                    </p>
                    <p className="text-[11px] text-muted">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}

export default AIManagerSection;
