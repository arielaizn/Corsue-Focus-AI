import Image from "next/image";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { learnDict } from "@/components/learn/dictionary";
import { PageHeader, StatCard, Panel, EmptyState } from "@/components/dashboard/ui";
import {
  getPrimaryAcademy,
  getLeaderboard,
  myXp,
  myBadges,
  getMyStreak,
  listLevels,
  type LeaderboardEntry,
  type EarnedBadge,
} from "@/lib/data/gamification";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = learnDict[locale];
  const d = dict.leaderboard;
  const intl = locale === "he" ? "he-IL" : "en-US";

  await requireStudent(locale, `/${locale}/learn/leaderboard`);

  const academy = await getPrimaryAcademy();

  // No academy footprint yet → calm browse CTA (nothing to rank).
  if (!academy) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={dict.nav.leaderboard} title={d.title} subtitle={d.subtitle} />
        <EmptyState
          icon={<TrophyGlyph />}
          title={dict.overview.noCourses}
          body={d.subtitle}
          cta={{ label: dict.overview.browseCourses, href: `/${locale}` }}
        />
      </div>
    );
  }

  const [rows, mine, badges, streak, levels] = await Promise.all([
    getLeaderboard(academy.id, 20),
    myXp(academy.id),
    myBadges(academy.id),
    getMyStreak(academy.id),
    listLevels(),
  ]);

  const totalXp = mine?.totalXp ?? 0;
  const level = mine?.currentLevel ?? 1;
  const rank = mine?.rank ?? null;

  // Level progress toward the next milestone (from the global ladder).
  const current = levels.find((l) => l.level_number === level);
  const next = levels.find((l) => l.level_number === level + 1);
  const floor = current?.xp_required ?? 0;
  const ceil = next?.xp_required ?? floor;
  const span = Math.max(1, ceil - floor);
  const into = Math.max(0, totalXp - floor);
  const pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={dict.nav.leaderboard}
        title={d.title}
        subtitle={academy.name ? `${d.subtitle} · ${academy.name}` : d.subtitle}
      />

      {/* My standing — XP / level / streak / rank */}
      <section aria-label={d.title} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={d.xp}
          value={totalXp.toLocaleString(intl)}
          accent
          icon={<SparkGlyph />}
          hint={
            next
              ? `${Math.max(0, ceil - totalXp).toLocaleString(intl)} ${d.xp} → ${next.title}`
              : (current?.title ?? undefined)
          }
        />
        <StatCard label={d.level} value={level} hint={current?.title ?? undefined} />
        <StatCard
          label={d.currentStreak}
          value={`${streak.currentStreak} ${d.days}`}
          icon={<FlameGlyph />}
          hint={`${d.longestStreak}: ${streak.longestStreak} ${d.days}`}
        />
        <StatCard
          label={d.rank}
          value={rank ? `#${rank}` : "—"}
          icon={<TrophyGlyph size={18} />}
        />
      </section>

      {/* Level progress bar (toward the next milestone) */}
      {next && (
        <Panel className="!p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-ink">
              {d.level} {level}
              {current?.title ? ` · ${current.title}` : ""}
            </span>
            <span className="text-xs tabular-nums text-muted">
              {totalXp.toLocaleString(intl)} / {ceil.toLocaleString(intl)} {d.xp}
            </span>
          </div>
          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-bg-deep [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${d.level} ${level}`}
          >
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {(ceil - totalXp > 0 ? ceil - totalXp : 0).toLocaleString(intl)} {d.xp} → {next.title}
          </p>
        </Panel>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Leaderboard table */}
        <Panel title={d.title}>
          {rows.length === 0 ? (
            <p className="text-sm text-muted">{dict.errors.loadFailed}</p>
          ) : (
            <ol className="space-y-1.5">
              {rows.map((r) => (
                <LeaderboardRowItem key={r.userId} row={r} d={d} intl={intl} />
              ))}
            </ol>
          )}
        </Panel>

        {/* Earned badges */}
        <Panel title={d.earnedBadges}>
          {badges.length === 0 ? (
            <p className="py-4 text-sm text-muted">{d.noBadges}</p>
          ) : (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
              {badges.map((b) => (
                <BadgeTile key={b.id} badge={b} />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Leaderboard row ---------- */
function LeaderboardRowItem({
  row,
  d,
  intl,
}: {
  row: LeaderboardEntry;
  d: (typeof learnDict)[Locale]["leaderboard"];
  intl: string;
}) {
  const podium = row.rank <= 3;
  return (
    <li
      className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 ${
        row.isMe
          ? "bg-[oklch(0.76_0.105_80_/_0.1)] [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]"
          : "bg-bg-deep/40"
      }`}
    >
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold tabular-nums ${
          podium
            ? "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.32)]"
            : "text-muted"
        }`}
      >
        {row.rank === 1 ? <CrownGlyph /> : row.rank}
      </span>
      <AvatarBubble name={row.displayName} avatarUrl={row.avatarUrl} ring={row.rank === 1} />
      <span
        className={`flex-1 truncate text-sm font-medium ${
          row.isMe ? "text-ink" : "text-ink-soft"
        }`}
      >
        {row.displayName}
        {row.isMe && (
          <span className="ms-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
            {d.you}
          </span>
        )}
      </span>
      <span className="text-[11px] tabular-nums text-muted">
        {d.level} {row.currentLevel}
      </span>
      <span className="w-20 text-end text-sm font-semibold tabular-nums text-ink">
        {row.totalXp.toLocaleString(intl)}
        <span className="ms-1 text-[10px] font-normal text-muted">{d.xp}</span>
      </span>
    </li>
  );
}

/* ---------- Badge tile ---------- */
function BadgeTile({ badge }: { badge: EarnedBadge }) {
  const valid = /^https?:\/\//.test(badge.iconUrl ?? "");
  return (
    <li
      className="flex flex-col items-center gap-2 rounded-[8px] bg-[oklch(0.76_0.105_80_/_0.07)] p-3 text-center [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.32)]"
      title={badge.description ? `${badge.name} — ${badge.description}` : badge.name}
    >
      <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[oklch(0.76_0.105_80_/_0.13)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]">
        {valid ? (
          <Image
            src={badge.iconUrl}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            unoptimized
          />
        ) : (
          <MedalGlyph />
        )}
      </span>
      <span className="text-[11px] font-medium leading-tight text-ink-soft">
        {badge.name}
      </span>
    </li>
  );
}

/* ---------- Avatar bubble (image or initial) ---------- */
function AvatarBubble({
  name,
  avatarUrl,
  ring,
}: {
  name: string;
  avatarUrl: string | null;
  ring?: boolean;
}) {
  const initial = (name || "—").trim().charAt(0).toUpperCase();
  const valid = !!avatarUrl && /^https?:\/\//.test(avatarUrl);
  return (
    <span
      className={`relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-xs font-semibold text-ink-soft ${
        ring
          ? "[box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.5),0_0_0_2px_oklch(0.76_0.105_80_/_0.18)]"
          : "[box-shadow:inset_0_0_0_1px_var(--color-line)]"
      }`}
      aria-hidden
    >
      {valid ? (
        <Image src={avatarUrl as string} alt="" fill className="object-cover" unoptimized />
      ) : (
        initial
      )}
    </span>
  );
}

/* ---------- Inline glyphs (24-grid, currentColor) ---------- */
const g = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function TrophyGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg {...g} width={size} height={size}>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
    </svg>
  );
}
function SparkGlyph() {
  return (
    <svg {...g}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}
function FlameGlyph() {
  return (
    <svg {...g}>
      <path d="M12 3c1.5 3 4.5 4.5 4.5 8a4.5 4.5 0 0 1-9 0c0-1.2.5-2.2 1.2-3 .3 1 .9 1.6 1.6 1.8C9.5 7.5 10.5 5 12 3Z" />
    </svg>
  );
}
function CrownGlyph() {
  return (
    <svg {...g} width={15} height={15}>
      <path d="M4 18h16M4 18l-1-9 5 4 4-7 4 7 5-4-1 9" />
    </svg>
  );
}
function MedalGlyph() {
  return (
    <svg {...g} width={22} height={22}>
      <circle cx="12" cy="14" r="6" />
      <path d="M8.5 8 6 3M15.5 8 18 3M12 11v3l2 1" />
    </svg>
  );
}
