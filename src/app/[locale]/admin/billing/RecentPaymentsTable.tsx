import type { Locale } from "@/lib/i18n";
import type { RecentPayment } from "@/lib/data/platform";
import { Panel } from "@/components/dashboard/ui";

/* ---------------------------------------------------------------------------
   Recent-payments table — academy, amount + currency, status pill, paid date.
   Logical CSS props (text-start/text-end) keep it correct in he-RTL & en-LTR.
   Server-safe leaf.
--------------------------------------------------------------------------- */

type StatusTone = "pos" | "neg" | "neutral";

const STATUS_TONE: Record<string, StatusTone> = {
  succeeded: "pos",
  paid: "pos",
  failed: "neg",
  canceled: "neg",
  cancelled: "neg",
  refunded: "neg",
};

export function RecentPaymentsTable({
  rows,
  locale,
  title,
  cols,
  emptyLabel,
}: {
  rows: RecentPayment[];
  locale: Locale;
  title: string;
  cols: { academy: string; amount: string; status: string; paidAt: string };
  emptyLabel: string;
}) {
  const fmtMoney = (n: number, currency: string) =>
    new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: safeCurrency(currency),
      maximumFractionDigits: 2,
    }).format(n);

  const fmtDate = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  };

  return (
    <Panel title={title}>
      {rows.length === 0 ? (
        <p className="py-6 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                <th className="px-2 pb-3 text-start font-semibold">
                  {cols.academy}
                </th>
                <th className="px-2 pb-3 text-end font-semibold">
                  {cols.amount}
                </th>
                <th className="px-2 pb-3 text-start font-semibold">
                  {cols.status}
                </th>
                <th className="px-2 pb-3 text-end font-semibold">
                  {cols.paidAt}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[var(--color-line)]/60"
                >
                  <td className="max-w-[16rem] truncate px-2 py-3 text-ink-soft">
                    {p.academyName}
                  </td>
                  <td className="px-2 py-3 text-end font-semibold tabular-nums text-ink">
                    {fmtMoney(p.amount, p.currency)}
                  </td>
                  <td className="px-2 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-2 py-3 text-end tabular-nums text-muted">
                    {fmtDate(p.paidAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status.toLowerCase()] ?? "neutral";
  const styles: Record<StatusTone, string> = {
    pos: "text-[var(--color-pos)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.1_165_/_0.4)]",
    neg: "text-[var(--color-neg)] [box-shadow:inset_0_0_0_1px_oklch(0.66_0.16_25_/_0.4)]",
    neutral: "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold capitalize ${styles[tone]}`}
    >
      {status}
    </span>
  );
}

/** Guard against malformed currency codes so Intl never throws. */
function safeCurrency(code: string): string {
  return /^[A-Za-z]{3}$/.test(code) ? code.toUpperCase() : "USD";
}
