import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Pure-CSS trend visualizations — no chart library. Server-safe (no "use
   client"). All sizing is via flex/height %, so layout is logical/RTL-safe.
--------------------------------------------------------------------------- */

/** Turn a `YYYY-MM` key into a short month label via the dict. */
function monthLabel(key: string, monthsShort: string[]): string {
  const m = Number(key.split("-")[1] ?? 0);
  return monthsShort[m] ?? key;
}

interface BarChartProps {
  data: { month: string; value: number }[];
  monthsShort: string[];
  emptyLabel: string;
  /** Optional value formatter for the tooltip/aria (e.g. currency). */
  format?: (v: number) => string;
  accent?: boolean;
}

/**
 * Vertical bar chart from a month→value series. Bars scale to the series max;
 * a zero series renders the empty label. Values surface on hover + in aria.
 */
export function BarChart({
  data,
  monthsShort,
  emptyLabel,
  format,
  accent = false,
}: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const hasData = data.some((d) => d.value > 0);
  const fmt = format ?? ((v: number) => String(v));

  if (!hasData) {
    return (
      <p className="grid h-40 place-items-center text-sm text-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="flex h-40 items-end justify-between gap-2" aria-hidden={false}>
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100);
        const label = monthLabel(d.month, monthsShort);
        return (
          <div
            key={d.month}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
            title={`${label}: ${fmt(d.value)}`}
          >
            <span className="text-[10px] tabular-nums text-muted opacity-0 transition-opacity group-hover:opacity-100">
              {fmt(d.value)}
            </span>
            <div
              role="img"
              aria-label={`${label}: ${fmt(d.value)}`}
              className={cn(
                "w-full rounded-t-[4px] transition-[height,background-color] duration-500",
                accent
                  ? "bg-gold-grad"
                  : "bg-[oklch(0.55_0.11_250)] group-hover:bg-[oklch(0.62_0.11_250)]",
              )}
              style={{ height: `${Math.max(pct, 3)}%` }}
            />
            <span className="text-[10px] text-muted">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

interface TopCoursesProps {
  data: { title: string; enrolled: number }[];
  unit: string;
  emptyLabel: string;
}

/**
 * Horizontal ranked list of courses by enrollment, each with a logical-width
 * (`inline-size`) gilt bar. RTL-safe: bars grow from the start edge.
 */
export function TopCoursesBars({ data, unit, emptyLabel }: TopCoursesProps) {
  if (data.length === 0) {
    return (
      <p className="grid h-24 place-items-center text-sm text-muted">
        {emptyLabel}
      </p>
    );
  }
  const max = Math.max(1, ...data.map((d) => d.enrolled));

  return (
    <ul className="flex flex-col gap-3.5">
      {data.map((c) => {
        const pct = Math.round((c.enrolled / max) * 100);
        return (
          <li key={c.title} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-ink-soft">{c.title}</span>
              <span className="shrink-0 tabular-nums text-muted">
                {c.enrolled} {unit}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2/60 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
              <div
                className="h-full rounded-full bg-gold-grad"
                style={{ inlineSize: `${Math.max(pct, 4)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** A titled wrapper that mirrors the `Panel` look but with a subtitle row. */
export function TrendPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="panel-premium flex flex-col gap-5 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
