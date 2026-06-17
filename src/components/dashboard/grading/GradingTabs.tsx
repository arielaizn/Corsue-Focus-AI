"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { gradingDict } from "./dict";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Client tab switcher for the grading queue: "Awaiting review" vs "Recently
   graded". Both panels are server-rendered and passed as children; this only
   toggles which is visible (cheap, no refetch, keyboard-accessible).
--------------------------------------------------------------------------- */

export function GradingTabs({
  locale,
  pendingCount,
  gradedCount,
  pending,
  graded,
}: {
  locale: Locale;
  pendingCount: number;
  gradedCount: number;
  pending: ReactNode;
  graded: ReactNode;
}) {
  const t = gradingDict[locale].index;
  const [tab, setTab] = useState<"pending" | "graded">("pending");

  const tabs = [
    { id: "pending" as const, label: t.pendingTab, count: pendingCount },
    { id: "graded" as const, label: t.gradedTab, count: gradedCount },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label={t.title}
        className="flex w-fit items-center gap-1 rounded-xl bg-surface-2/40 p-1 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
      >
        {tabs.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(tb.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-ink text-bg-deep [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.25)]"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {tb.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] tabular-nums",
                  active
                    ? "bg-bg-deep/20 text-bg-deep"
                    : "bg-surface-3/60 text-muted",
                )}
              >
                {tb.count}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" hidden={tab !== "pending"}>
        {pending}
      </div>
      <div role="tabpanel" hidden={tab !== "graded"}>
        {graded}
      </div>
    </div>
  );
}
