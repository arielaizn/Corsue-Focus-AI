"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { LeaderboardRow } from "@/lib/data/community-admin";
import { communityDict } from "./dict";
import { Avatar } from "./Avatar";

export function Leaderboard({
  locale,
  rows,
}: {
  locale: Locale;
  rows: LeaderboardRow[];
}) {
  const t = communityDict[locale].leaderboard;

  if (rows.length === 0) {
    return <p className="text-sm text-ink-soft">{t.empty}</p>;
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {rows.map((r, i) => (
        <Row key={r.user_id} row={r} index={i} locale={locale} />
      ))}
    </ol>
  );
}

function Row({
  row,
  index,
  locale,
}: {
  row: LeaderboardRow;
  index: number;
  locale: Locale;
}) {
  const t = communityDict[locale].leaderboard;
  const [copied, setCopied] = useState(false);
  const rank = row.rank_all_time ?? index + 1;

  async function copyId() {
    try {
      await navigator.clipboard.writeText(row.user_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard blocked — silently ignore
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-xl bg-surface-2/40 px-3 py-2 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold tabular-nums ${
          rank <= 3
            ? "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]"
            : "text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        }`}
        aria-label={`${t.rank} ${rank}`}
      >
        {rank}
      </span>
      <Avatar name={row.display_name} url={row.avatar_url} size={28} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {row.display_name ?? t.anon}
        </p>
        <button
          type="button"
          onClick={copyId}
          title={row.user_id}
          className="truncate font-mono text-[0.65rem] text-muted/70 underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
        >
          {copied ? "✓ ID" : row.user_id.slice(0, 8) + "…"}
        </button>
      </div>
      <div className="shrink-0 text-end">
        <p className="text-sm font-bold tabular-nums text-ink">
          {row.total_xp.toLocaleString()}{" "}
          <span className="text-[0.65rem] font-normal text-muted">{t.xp}</span>
        </p>
        <p className="text-[0.65rem] text-muted">
          {t.level} {row.current_level}
        </p>
      </div>
    </li>
  );
}
