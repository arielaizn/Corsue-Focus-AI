"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   PlayerTabs — a thin client tab shell beneath the lesson stage. The heavy
   content (Overview markdown, Notes, Tutor, Resources) is rendered on the
   server and passed in as nodes; this component only toggles visibility so the
   RSC keeps doing the data work. Accessible tablist (roving, aria-selected).
--------------------------------------------------------------------------- */

export interface PlayerTab {
  id: string;
  label: string;
  content: ReactNode;
}

export function PlayerTabs({
  tabs,
  initialId,
}: {
  tabs: PlayerTab[];
  initialId?: string;
}) {
  const first = initialId ?? tabs[0]?.id;
  const [active, setActive] = useState(first);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-wrap items-center gap-1 border-line/60 [border-block-end:1px_solid_var(--color-line)]"
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative -mb-px rounded-t-[6px] px-3.5 py-2.5 text-sm font-medium transition-colors",
                selected
                  ? "text-ink"
                  : "text-muted hover:text-ink-soft",
              )}
            >
              {t.label}
              {selected && (
                <span
                  aria-hidden
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold"
                />
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
        >
          {t.id === active && t.content}
        </div>
      ))}
    </div>
  );
}

export default PlayerTabs;
