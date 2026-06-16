"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import { BadgeGlyph, FlameIcon, CrownIcon, CheckIcon } from "./icons";
import { SparkIcon } from "./SparkIcon";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["gamification"];

/* ---------- XP + Level card ---------- */
function XPCard({ xp }: { xp: T["xp"] }) {
  const reduced = useReducedMotion();
  const pct = Math.round((xp.current / xp.next) * 100);
  return (
    <div className="panel-premium relative overflow-hidden p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-aurora grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold tabular-nums text-ink [box-shadow:inset_0_0_0_1px_oklch(0.9_0.1_92_/_0.45),inset_0_1px_0_oklch(1_0_0_/_0.12),0_0_36px_-6px_oklch(0.62_0.23_330_/_0.6)]">
            {xp.level}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {xp.levelLabel} {xp.level}
            </p>
            <p className="text-lg font-semibold text-ink">{xp.title}</p>
          </div>
        </div>
        <span className="text-sm tabular-nums text-gold">
          {xp.current.toLocaleString()} / {xp.next.toLocaleString()}
        </span>
      </div>

      <div
        className="mt-5 h-3 w-full overflow-hidden rounded-full bg-bg [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${xp.levelLabel} ${xp.level}`}
      >
        {/*
          REGRESSION GUARD: any Framer `whileInView` width tween in this file MUST
          carry this `reduced` fallback (initial set to final width, transition 0).
          The global CSS prefers-reduced-motion block does NOT neutralize JS-driven
          width tweens — only this guard does. Mirror it on every future animated bar.
        */}
        <motion.div
          className="bg-aurora h-full rounded-full"
          initial={reduced ? { width: `${pct}%` } : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        {(xp.next - xp.current).toLocaleString()} {xp.toNextLabel}
      </p>
    </div>
  );
}

/* ---------- Streak card ---------- */
function StreakCard({ streak }: { streak: T["streak"] }) {
  return (
    <div className="panel-premium relative overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[oklch(0.83_0.13_88_/_0.14)] blur-3xl"
      />
      <div className="relative flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[oklch(0.83_0.13_88_/_0.16)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.32)]">
          <FlameIcon size={24} />
        </span>
        <div>
          <p className="text-2xl font-bold tabular-nums text-ink">
            {streak.days} <span className="text-base font-medium text-ink-soft">{streak.label}</span>
          </p>
          <p className="text-xs text-muted">{streak.sub}</p>
        </div>
      </div>
      <div className="relative mt-5 flex items-center justify-between gap-1.5">
        {streak.weekLabels.map((d, i) => {
          const active = i < 5;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`grid h-8 w-full place-items-center rounded-lg text-[11px] font-semibold ${
                  active
                    ? "bg-[oklch(0.83_0.13_88_/_0.18)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4),inset_0_1px_0_oklch(1_0_0_/_0.08)]"
                    : "bg-bg-deep text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                }`}
              >
                {active ? <FlameIcon size={14} /> : d}
              </span>
              <span className="text-[10px] text-muted">{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Levels milestone path ---------- */
function LevelsCard({ levels }: { levels: T["levels"] }) {
  return (
    <div className="panel-premium p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-ink">{levels.rangeLabel}</h3>
        <span className="text-xs text-muted">{levels.note}</span>
      </div>
      <div className="relative mt-7">
        {/* track */}
        <div className="absolute inset-x-1 top-2 h-0.5 bg-line" aria-hidden />
        <div
          className="bg-gold-grad absolute start-1 top-2 h-0.5"
          style={{ width: "50%" }}
          aria-hidden
        />
        <ol className="relative flex justify-between">
          {levels.milestones.map((m) => {
            const reached = m.lvl <= 50;
            return (
              <li key={m.lvl} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full ${
                    reached
                      ? "bg-gold [box-shadow:0_0_0_4px_oklch(0.82_0.135_84_/_0.15)]"
                      : "bg-bg [box-shadow:inset_0_0_0_1.5px_var(--color-line)]"
                  }`}
                />
                <span className="text-[11px] font-semibold tabular-nums text-ink-soft">
                  {m.lvl}
                </span>
                <span className={`text-[11px] ${reached ? "text-gold" : "text-muted"}`}>
                  {m.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* ---------- Badge wall ---------- */
function BadgesCard({ badges }: { badges: T["badges"] }) {
  return (
    <div className="panel-premium p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{badges.title}</h3>
        <span className="text-xs tabular-nums text-muted">
          {badges.items.filter((b) => b.earned).length}/{badges.items.length}
        </span>
      </div>
      <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
        {badges.items.map((b) => (
          <li
            key={b.name}
            className={`group/badge flex flex-col items-center gap-2 rounded-xl p-3 text-center ${
              b.earned
                ? "bg-[oklch(0.83_0.13_88_/_0.08)] [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.32),inset_0_1px_0_oklch(1_0_0_/_0.06)]"
                : "bg-bg-deep/60 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            }`}
            title={`${b.name} — ${b.desc}`}
          >
            <span
              className={`grid h-11 w-11 place-items-center rounded-full ${
                b.earned
                  ? "bg-[oklch(0.83_0.13_88_/_0.15)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
                  : "bg-surface text-[oklch(0.55_0.02_265)]"
              }`}
            >
              <BadgeGlyph glyph={b.glyph} size={22} />
            </span>
            <span
              className={`text-[11px] font-medium leading-tight ${
                b.earned ? "text-ink-soft" : "text-muted"
              }`}
            >
              {b.name}
            </span>
            <span className="sr-only">{b.earned ? badges.earnedLabel : badges.lockedLabel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Leaderboard with tabs (interactive) ---------- */
function LeaderboardCard({ lb }: { lb: T["leaderboard"] }) {
  const [tab, setTab] = useState(lb.activeTab);
  // Deterministic cumulative XP per tab so switching feels alive without fake data files.
  // Weekly = 1 (the anchor); daily is a single-day slice, monthly/all accumulate upward.
  // All bands stay positive integers and read as plausible: daily < weekly < monthly < all.
  const factor: Record<string, number> = { daily: 0.32, weekly: 1, monthly: 3.8, all: 26 };
  const rows = [...lb.rows]
    .map((r) => ({ ...r, val: Math.round(r.xp * (factor[tab] ?? 1)) }))
    .sort((a, b) => b.val - a.val)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="panel-premium p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{lb.title}</h3>
        <div
          role="tablist"
          aria-label={lb.title}
          className="flex flex-wrap gap-1 rounded-lg bg-bg p-1 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          {lb.tabs.map((tb) => {
            const active = tb.id === tab;
            return (
              <button
                key={tb.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(tb.id)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 ${
                  active
                    ? "bg-surface-2 text-ink [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.07)]"
                    : "text-muted hover:text-ink-soft"
                }`}
              >
                {tb.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 space-y-1.5">
        {rows.map((r) => {
          const podium = r.rank <= 3;
          return (
            <li
              key={r.name}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                r.you
                  ? "bg-[oklch(0.62_0.215_294_/_0.16)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.42),inset_0_1px_0_oklch(1_0_0_/_0.06)]"
                  : "bg-bg-deep/40"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold tabular-nums ${
                  podium
                    ? "bg-[oklch(0.83_0.13_88_/_0.16)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.28)]"
                    : "text-muted"
                }`}
              >
                {r.rank === 1 ? <CrownIcon size={15} /> : r.rank}
              </span>
              <Avatar initials={r.initials} size={32} ring={r.rank === 1} />
              <span className={`flex-1 truncate text-sm font-medium ${r.you ? "text-ink" : "text-ink-soft"}`}>
                {r.name}
              </span>
              <span className="text-xs tabular-nums text-pos">{r.delta}</span>
              <span className="w-16 text-end text-sm font-semibold tabular-nums text-ink">
                {r.val.toLocaleString()}
                <span className="ms-1 text-[10px] font-normal text-muted">{lb.xpLabel}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Challenges ---------- */
function ChallengesCard({ challenges }: { challenges: T["challenges"] }) {
  const reduced = useReducedMotion();
  return (
    <div className="panel-premium p-6">
      <h3 className="text-base font-semibold text-ink">{challenges.title}</h3>
      <ul className="mt-5 space-y-4">
        {challenges.items.map((c) => (
          <li key={c.title}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-ink-soft">{c.title}</span>
              <span className="shrink-0 rounded-md bg-[oklch(0.83_0.13_88_/_0.13)] px-2 py-0.5 text-[11px] font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.28)]">
                {c.reward}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {/* mirrors XPCard: reduced fallback sets initial to final width, transition 0. */}
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-bg [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                role="progressbar"
                aria-valuenow={c.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={c.title}
              >
                <motion.div
                  className="bg-aurora h-full rounded-full"
                  initial={reduced ? { width: `${c.progress}%` } : { width: 0 }}
                  whileInView={{ width: `${c.progress}%` }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted">{c.state}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Daily AI tasks ---------- */
function DailyCard({ daily }: { daily: T["daily"] }) {
  const total = daily.tasks.reduce((s, t) => s + t.xp, 0);
  return (
    <div className="panel-premium p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[oklch(0.62_0.215_294_/_0.2)] text-violet-bright [box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.3)]">
          <SparkIcon size={16} />
        </span>
        <div>
          <h3 className="text-base font-semibold text-ink">{daily.title}</h3>
          <p className="text-xs text-muted">{daily.sub}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {daily.tasks.map((task) => (
          <li
            key={task.text}
            className="flex items-center gap-3 rounded-xl bg-bg-deep/50 px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.4)]"
          >
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${
                task.done
                  ? "bg-pos text-bg-deep"
                  : "[box-shadow:inset_0_0_0_1.5px_var(--color-line)]"
              }`}
            >
              {task.done && <CheckIcon size={13} />}
            </span>
            <span
              className={`flex-1 text-sm ${
                task.done ? "text-muted line-through" : "text-ink-soft"
              }`}
            >
              {task.text}
            </span>
            <span className="text-xs font-semibold tabular-nums text-gold">+{task.xp}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
        <span className="text-xs text-muted">{daily.totalLabel}</span>
        <span className="text-sm font-semibold tabular-nums text-gold">+{total} XP</span>
      </div>
    </div>
  );
}

export function GamificationSection({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-36">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} align="center" className="max-w-2xl" />
        <span aria-hidden className="gilt-rule mx-auto mt-8 max-w-[10rem] opacity-50" />
      </Reveal>

      {/* Bento: distinct spans, not a uniform grid */}
      <div className="mt-14 grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" y={24}>
          <XPCard xp={t.xp} />
        </Reveal>
        <Reveal className="lg:col-span-5" y={24} delay={0.05}>
          <StreakCard streak={t.streak} />
        </Reveal>

        <Reveal className="lg:col-span-12" y={24} delay={0.05}>
          <LevelsCard levels={t.levels} />
        </Reveal>

        <Reveal className="lg:col-span-7" y={24}>
          <LeaderboardCard lb={t.leaderboard} />
        </Reveal>
        <Reveal className="lg:col-span-5" y={24} delay={0.05}>
          <BadgesCard badges={t.badges} />
        </Reveal>

        <Reveal className="lg:col-span-6" y={24}>
          <ChallengesCard challenges={t.challenges} />
        </Reveal>
        <Reveal className="lg:col-span-6" y={24} delay={0.05}>
          <DailyCard daily={t.daily} />
        </Reveal>
      </div>
    </section>
  );
}

export default GamificationSection;
