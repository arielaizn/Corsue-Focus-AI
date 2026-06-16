import { Reveal, SectionHeading, BrowserFrame, Tag } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";

/** C3 — Courses · Lessons · Video. BrowserFrame player mock + a feature rail. */
export function C3Video({ locale }: { locale: Locale }) {
  const t = content[locale].c3;

  return (
    <Section className="py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      {/* Player mock */}
      <Reveal y={28} delay={0.05} className="mt-14">
        <BrowserFrame url="ariel.coursefocus.ai/lesson/04">
          <div className="grid gap-0 lg:grid-cols-[1.7fr_1fr]">
            {/* video stage */}
            <div className="p-4 sm:p-5">
              <div className="relative aspect-video overflow-hidden rounded-[14px] bg-bg-deep [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                {/* soft nebula sheen inside the stage */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 28% 0%, oklch(0.62 0.215 294 / 0.26), transparent 55%), radial-gradient(120% 90% at 82% 100%, oklch(0.62 0.23 330 / 0.2), transparent 55%)",
                  }}
                />
                {/* play button */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-aurora gilt-rim">
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                      <path d="M8 5v14l11-7z" fill="oklch(0.96 0.012 92)" />
                    </svg>
                  </div>
                </div>
                <div className="absolute left-4 top-4 rounded-md bg-bg-deep/80 px-2.5 py-1 text-xs text-ink-soft backdrop-blur [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                  {t.nowPlaying}
                </div>

                {/* control bar */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[oklch(0.34_0.06_267_/_0.7)]">
                    <div className="h-full w-[38%] rounded-full bg-aurora" />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-ink-soft">
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums">2:14 / 9:02</span>
                      <span className="rounded bg-bg-deep/70 px-1.5 py-0.5 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]">1.5×</span>
                      <span className="rounded bg-bg-deep/70 px-1.5 py-0.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]">CC</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted">
                      <span title="PiP">PiP</span>
                      <span title="AirPlay">AirPlay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* side panel — chapters + AI summary */}
            <div className="border-t border-line bg-surface/30 p-4 sm:p-5 lg:border-s lg:border-t-0">
              <div className="text-xs font-semibold text-muted">{t.chapterLabel}</div>
              <ul className="mt-3 space-y-1.5">
                {t.chapters.map((c, i) => (
                  <li
                    key={c}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                      i === 1
                        ? "bg-surface-2 text-ink [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
                        : "text-ink-soft"
                    }`}
                  >
                    <span className="text-[11px] text-gold tabular-nums">
                      {`0${i + 1}`}
                    </span>
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl bg-bg-deep/60 p-3.5 [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.22)]">
                <div className="flex items-center gap-2 text-xs font-semibold text-gold">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-aurora text-ink">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                  {t.summaryLabel}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.summaryText}</p>
              </div>

              <div className="mt-3 text-xs font-semibold text-muted">{t.transcriptLabel}</div>
              <div className="mt-2 space-y-1.5">
                {t.transcriptLines.map((line, i) => (
                  <p key={i} className="text-xs leading-relaxed text-ink-soft">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </BrowserFrame>
      </Reveal>

      {/* feature rail — the player capabilities */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {t.rail.map((r, i) => (
          <Reveal
            key={r.label}
            delay={0.03 * i}
            className="rounded-[14px] bg-surface p-5 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.05)]"
          >
            <div className="text-sm font-semibold text-ink">{r.label}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{r.desc}</p>
          </Reveal>
        ))}
      </div>

      {/* course types */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="me-1 text-sm text-muted">{t.courseTypesLabel}:</span>
        {t.courseTypes.map((ct, i) => (
          <Tag key={ct} tone={i === 3 ? "gold" : "default"}>
            {ct}
          </Tag>
        ))}
      </div>
    </Section>
  );
}

export default C3Video;
