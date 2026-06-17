import type { Locale } from "@/lib/i18n";
import type { BillingAcademyRevenue } from "@/lib/data/platform";
import { Panel } from "@/components/dashboard/ui";

/* ---------------------------------------------------------------------------
   Revenue-by-academy breakdown — pure CSS bars (no chart lib). Each row shows
   the academy name, a proportional steel bar, and the formatted revenue. The
   bar widths are scaled to the top-earner so the leader fills the track.
   Server-safe leaf (no "use client").
--------------------------------------------------------------------------- */

export function RevenueByAcademy({
  rows,
  currency,
  locale,
  title,
  emptyLabel,
}: {
  rows: BillingAcademyRevenue[];
  currency: string;
  locale: Locale;
  title: string;
  emptyLabel: string;
}) {
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: safeCurrency(currency),
      maximumFractionDigits: 0,
    }).format(n);

  const max = rows.reduce((m, r) => Math.max(m, r.revenue), 0);

  return (
    <Panel title={title}>
      {rows.length === 0 ? (
        <p className="py-6 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r) => {
            const pct = max > 0 ? Math.max(2, Math.round((r.revenue / max) * 100)) : 0;
            return (
              <li key={r.academyId} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-ink-soft">
                    {r.name}
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                    {fmtMoney(r.revenue)}
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-surface-2/60"
                  role="img"
                  aria-label={`${r.name}: ${fmtMoney(r.revenue)}`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      inlineSize: `${pct}%`,
                      background:
                        "linear-gradient(90deg, var(--color-ink-blue), var(--color-blue-bright))",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

/** Guard against malformed currency codes so Intl never throws. */
function safeCurrency(code: string): string {
  return /^[A-Za-z]{3}$/.test(code) ? code.toUpperCase() : "USD";
}
