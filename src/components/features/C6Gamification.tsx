import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { ProgressBar } from "./bits";
import { IconFlame, IconTrophy, IconCheck } from "./icons";

/** C6 — Gamification. A single composed "player panel": level + XP, streak, badges, leaderboard, daily AI tasks. */
export function C6Gamification({ locale }: { locale: Locale }) {
  const t = content[locale].c6;
  const xpPct = Math.round((t.xpCurrent / t.xpNext) * 100);

  return (
    <Section tint className="py-24 sm:py-36">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <Reveal y={26} delay={0.05} className="mt-14">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {/* Left column — level, XP, streak, badges */}
          <div className="flex flex-col gap-5">
            {/* Level + XP — the hero panel */}
            <div className="panel-premium glow-aurora p-6">
              <div className="flex items-center gap-4">
                <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-aurora gilt-rim">
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold text-ink">
                    {t.level}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-ink">
                      {t.levelLabel} {t.level}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {t.xpCurrent.toLocaleString()} / {t.xpNext.toLocaleString()} XP
                    </span>
                  </div>
                  <ProgressBar value={xpPct} className="mt-2.5" />
                  <div className="mt-1.5 text-xs text-muted">{t.xpLabel}</div>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-4 rounded-[16px] bg-surface p-6 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.05)]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[oklch(0.72_0.13_78_/_0.18)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]">
                <IconFlame size={22} />
              </span>
              <div>
                <div className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
                  {t.streakDays}
                </div>
                <div className="text-xs text-muted">{t.streakLabel}</div>
              </div>
              {/* mini 7-day strip */}
              <div className="ms-auto flex items-end gap-1.5">
                {[1, 1, 1, 1, 1, 0, 0].map((on, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={`w-2.5 rounded-full ${
                      on ? "h-7 bg-aurora" : "h-3.5 bg-[oklch(0.34_0.06_267_/_0.6)]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="rounded-[16px] bg-surface p-6 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.05)]">
              <div className="text-sm font-semibold text-ink">{t.badgesLabel}</div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {t.badges.map((b, i) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full bg-bg-deep px-3 py-1.5 text-xs font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                  >
                    <span className={i % 2 === 0 ? "text-gold" : "text-violet-bright"}>
                      <IconTrophy size={13} />
                    </span>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — leaderboard, challenge, daily AI tasks */}
          <div className="flex flex-col gap-5">
            {/* Leaderboard */}
            <div className="rounded-[16px] bg-surface p-6 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.05)]">
              <div className="text-sm font-semibold text-ink">{t.leaderboardLabel}</div>
              <ul className="mt-4 space-y-1.5">
                {t.leaderboard.map((row) => (
                  <li
                    key={row.rank}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      row.me
                        ? "bg-[oklch(0.6_0.18_262_/_0.14)] text-ink [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]"
                        : "text-ink-soft"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ${
                        row.rank === 1
                          ? "bg-gold-grad text-bg-deep"
                          : "bg-bg-deep text-muted ring-line"
                      }`}
                    >
                      {row.rank}
                    </span>
                    <span className="flex-1 font-medium">{row.name}</span>
                    <span className="text-xs text-muted tabular-nums">
                      {row.xp.toLocaleString()} XP
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weekly challenge */}
            <div className="rounded-[16px] bg-surface p-6 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.05)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{t.challengeLabel}</span>
                <span className="rounded-full bg-bg-deep px-2.5 py-0.5 text-xs font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]">
                  3/5
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{t.challengeText}</p>
              <ProgressBar value={60} tone="gold" className="mt-3" />
            </div>

            {/* Daily AI tasks */}
            <div className="rounded-[16px] bg-surface p-6 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.6),inset_0_1px_0_oklch(1_0_0_/_0.05)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="text-gold">AI</span>
                {t.dailyLabel}
              </div>
              <ul className="mt-3.5 space-y-2">
                {t.dailyTasks.map((task, i) => (
                  <li key={task} className="flex items-center gap-3 text-sm text-ink-soft">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${
                        i === 0 ? "bg-aurora text-ink" : "bg-bg-deep text-muted ring-line"
                      }`}
                    >
                      {i === 0 && <IconCheck size={12} />}
                    </span>
                    <span className={i === 0 ? "text-ink line-through decoration-muted" : ""}>
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export default C6Gamification;
