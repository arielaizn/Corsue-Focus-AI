import { Reveal, SectionHeading, GlowCard } from "@/components/ui";
import type { content } from "@/content/community";
import { SparkIcon } from "./SparkIcon";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["aiManager"];

export function AIManagerSection({ t }: { t: T }) {
  return (
    <section className="relative mx-auto max-w-[1240px] px-5 py-24 sm:py-36">
      <Reveal>
        <SectionHeading kicker={t.botName} title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch lg:gap-8">
        {/* duties — staggered list, not a card grid */}
        <Reveal y={26}>
          <ol className="flex h-full flex-col gap-3">
            {t.duties.map((d, i) => (
              <li
                key={d.title}
                className="panel-premium flex gap-4 p-5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[oklch(0.62_0.215_294_/_0.2)] text-sm font-bold tabular-nums text-violet-bright [box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.3)]">
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
                  <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
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
