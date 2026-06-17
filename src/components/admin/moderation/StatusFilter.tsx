"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { adminDict } from "@/lib/admin-dictionary";

type Filter = "open" | "reviewing" | "actioned" | "dismissed" | "all";

const ORDER: Filter[] = ["open", "reviewing", "actioned", "dismissed", "all"];

export interface StatusFilterProps {
  locale: Locale;
  active: Filter;
}

/**
 * Status filter for the report queue. Each tab is a plain link that sets
 * `?status=…` so the server re-queries via `listModerationQueue`. The active
 * tab carries the steel/critical platform accent (distinct from gold).
 */
export function StatusFilter({ locale, active }: StatusFilterProps) {
  const m = adminDict[locale].moderation;

  const labels: Record<Filter, string> = {
    open: m.open,
    reviewing: m.reviewing,
    actioned: m.markActioned,
    dismissed: m.dismiss,
    all: locale === "he" ? "הכול" : "All",
  };

  return (
    <nav
      aria-label={m.title}
      className="flex flex-wrap items-center gap-2"
    >
      {ORDER.map((f) => {
        const isActive = f === active;
        const href =
          f === "open"
            ? `/${locale}/admin/moderation`
            : `/${locale}/admin/moderation?status=${f}`;
        return (
          <Link
            key={f}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-[color,box-shadow,background-color] duration-200",
              isActive
                ? "bg-surface-2/70 text-ink [box-shadow:inset_0_0_0_1px_oklch(0.62_0.13_250_/_0.55)]"
                : "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)] hover:text-ink hover:[box-shadow:inset_0_0_0_1px_oklch(0.5_0.06_250_/_0.45)]",
            )}
          >
            {labels[f]}
          </Link>
        );
      })}
    </nav>
  );
}
