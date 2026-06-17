"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading, Counter } from "@/components/ui";
import { easeOutExpo } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

/**
 * Elegant, aspirational gamification glimpse — NOT a playground. A tall level
 * card with an animated XP arc + bar, a streak chip, a badges row, and a
 * compact leaderboard where "you" is highlighted. Distinct layout device:
 * a two-column profile-panel split (no card grid).
 */
export function Gamification({
  t,
  locale,
}: {
  t: HomeContent["gamification"];
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });

  const pct = Math.round((t.xpCurrent / t.xpNext) * 100);
  const maxXp = Math.max(...t.leaders.map((l) => l.xp));

  // XP ring geometry
  const R = 52;
  const C = 2 * Math.PI * R;
  const ringTarget = C * (1 - pct / 100);

  return (
    <section
      ref={ref}
      className="relative py-32 sm:py-44"
    >
      <div className="mx-auto max-w-[1240px] px-6">
        <span aria-hidden className="gilt-rule mb-20 block max-w-[160px] opacity-60" />
        <Reveal>
          <SectionHeading title={t.title} subtitle={t.sub} as="h2" />
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Level + XP ring panel */}
          <Reveal y={20}>
            <div className="panel-couture relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7">
              <div className="relative flex items-center gap-6">
                {/* ring */}
                <div className="relative grid h-[136px] w-[136px] shrink-0 place-items-center">
                  <svg
                    viewBox="0 0 136 136"
                    className="h-full w-full -rotate-90"
                    aria-hidden
                  >
                    <circle
                      cx="68"
                      cy="68"
                      r={R}
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="68"
                      cy="68"
                      r={R}
                      fill="none"
                      stroke="oklch(0.76 0.105 80)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      initial={{ strokeDashoffset: reduced ? ringTarget : C }}
                      animate={{
                        strokeDashoffset: inView ? ringTarget : C,
                      }}
                      transition={{
                        duration: reduced ? 0 : 1.4,
                        ease: easeOutExpo,
                      }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[11px] font-medium text-muted">
                      {t.levelLabel}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-none text-ink [.font-he_&]:font-[family-name:var(--font-he-display)]">
                      {t.level}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <Counter
                      to={t.xpCurrent}
                      duration={1.4}
                      className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he-display)]"
                    />
                    <span className="text-sm text-muted">
                      / {t.xpNext.toLocaleString()} {t.xpUnit}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {pct}% {locale === "he" ? "לרמה הבאה" : "to next level"}
                  </p>

                  {/* streak chip */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-bg px-3 py-1.5 text-xs font-medium text-gold gilt-rim">
                    <span aria-hidden>✦</span>
                    <span className="text-muted">{t.streakLabel}:</span>
                    <span className="text-ink">{t.streakValue}</span>
                  </div>
                </div>
              </div>

              {/* XP progress bar */}
              <div className="relative mt-7">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg ring-line">
                  <motion.div
                    className="h-full rounded-full bg-gold-grad"
                    initial={{ width: reduced ? `${pct}%` : 0 }}
                    animate={{ width: inView ? `${pct}%` : 0 }}
                    transition={{
                      duration: reduced ? 0 : 1.2,
                      ease: easeOutExpo,
                      delay: 0.15,
                    }}
                  />
                </div>
              </div>

              {/* badges */}
              <div className="mt-7">
                <p className="mb-3 text-xs font-medium text-muted">
                  {t.badgesLabel}
                </p>
                <ul className="flex flex-wrap gap-2.5">
                  {t.badges.map((b, i) => (
                    <motion.li
                      key={b.name}
                      initial={
                        reduced ? { opacity: 1 } : { opacity: 0, scale: 0.85 }
                      }
                      animate={
                        inView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.85 }
                      }
                      transition={{
                        duration: 0.4,
                        ease: easeOutExpo,
                        delay: reduced ? 0 : 0.3 + i * 0.08,
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-bg px-3 py-1.5 text-xs text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                    >
                      <span
                        aria-hidden
                        className="grid h-5 w-5 place-items-center rounded-full bg-gold-grad text-[11px] text-bg-deep"
                      >
                        {b.icon}
                      </span>
                      {b.name}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Leaderboard panel */}
          <Reveal y={20} delay={0.08}>
            <div className="panel-couture h-full overflow-hidden p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                  {t.leaderboardLabel}
                </h3>
                <span className="rounded-full bg-bg px-2.5 py-1 text-[11px] text-muted ring-line">
                  XP
                </span>
              </div>

              <ol className="space-y-2.5">
                {t.leaders.map((l, i) => {
                  const isYou = l.name === t.youLabel;
                  const barPct = Math.round((l.xp / maxXp) * 100);
                  return (
                    <motion.li
                      key={l.name}
                      initial={
                        reduced ? { opacity: 1 } : { opacity: 0, x: 0, y: 8 }
                      }
                      animate={
                        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                      }
                      transition={{
                        duration: 0.45,
                        ease: easeOutExpo,
                        delay: reduced ? 0 : 0.15 + i * 0.08,
                      }}
                      className={
                        "relative flex items-center gap-3 overflow-hidden rounded-[8px] px-3.5 py-3 " +
                        (isYou
                          ? "bg-bg [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.5)]"
                          : "bg-bg/50 ring-line")
                      }
                    >
                      {/* progress fill behind */}
                      <motion.div
                        aria-hidden
                        className={
                          "pointer-events-none absolute inset-y-0 start-0 " +
                          (isYou
                            ? "bg-[oklch(0.76_0.105_80_/_0.12)]"
                            : "bg-[oklch(1_0_0_/_0.04)]")
                        }
                        initial={{ width: reduced ? `${barPct}%` : 0 }}
                        animate={{ width: inView ? `${barPct}%` : 0 }}
                        transition={{
                          duration: reduced ? 0 : 1,
                          ease: easeOutExpo,
                          delay: 0.2 + i * 0.08,
                        }}
                      />
                      <span
                        className={
                          "relative grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-xs font-semibold " +
                          (i === 0
                            ? "bg-gold-grad text-bg-deep"
                            : isYou
                              ? "bg-ink text-bg-deep"
                              : "bg-surface text-ink-soft ring-line")
                        }
                      >
                        {i + 1}
                      </span>
                      <span
                        className={
                          "relative flex-1 text-sm " +
                          (isYou ? "font-semibold text-ink" : "text-ink-soft")
                        }
                      >
                        {l.name}
                        {isYou && (
                          <span className="ms-2 rounded-full bg-ink px-2 py-0.5 align-middle text-[10px] font-medium text-bg-deep">
                            {t.youLabel}
                          </span>
                        )}
                      </span>
                      <span className="relative font-[family-name:var(--font-display)] text-sm font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he-display)]">
                        {l.xp.toLocaleString()}
                      </span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Gamification;
