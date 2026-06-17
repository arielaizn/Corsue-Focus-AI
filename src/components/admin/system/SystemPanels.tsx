import type { ReactNode } from "react";
import type { PlanHealth, SystemHealth } from "@/lib/data/platform";
import type { AdminDict } from "@/lib/admin-dictionary";
import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN · System page leaf components.

   Server-safe (no "use client"), pure presentational. Renders the
   getSystemHealth() shape: a plans table (name + active-subscription count),
   an AI-usage readout, and a read-only feature-flags grid.

   These pieces deliberately wear a restrained STEEL rim (not the academy
   gold) so the platform surface reads as a distinct, oversight-level chrome.
--------------------------------------------------------------------------- */

const nf = (locale: Locale) => new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US");

/** A platform-tier panel — steel rim instead of the academy gold. */
function SteelPanel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="panel-premium relative overflow-hidden p-6 [box-shadow:inset_0_0_0_1px_oklch(0.72_0.03_240_/_0.22)]">
      <span
        aria-hidden
        className="absolute inset-inline-start-0 inset-block-0 w-[2px] bg-[linear-gradient(180deg,oklch(0.78_0.06_240_/_0.55),transparent)]"
      />
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {title}
        </h2>
        {hint && (
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

/* --------------------------------------------------------------------------- */

export interface PlansTableProps {
  plans: PlanHealth[];
  t: AdminDict["system"];
  locale: Locale;
}

/** Plans table: plan name + its active-subscription count. */
export function PlansTable({ plans, t, locale }: PlansTableProps) {
  const fmt = nf(locale);
  return (
    <SteelPanel title={t.plans} hint={`${fmt.format(plans.length)}`}>
      {plans.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t.none}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-muted">
                <th className="py-2.5 ps-1 text-start font-semibold">
                  {t.plans}
                </th>
                <th className="py-2.5 pe-1 text-end font-semibold">
                  {t.activeSubs}
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line/60 last:border-0"
                >
                  <td className="py-3 ps-1 text-start font-medium text-ink">
                    {p.name}
                  </td>
                  <td className="py-3 pe-1 text-end tabular-nums text-ink-soft">
                    {fmt.format(p.activeSubs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SteelPanel>
  );
}

/* --------------------------------------------------------------------------- */

export interface AiUsagePanelProps {
  aiTokens: number;
  aiReviews: number;
  t: AdminDict["system"];
  locale: Locale;
}

/** AI usage proxy: total tokens consumed across ai_reviews + review count. */
export function AiUsagePanel({
  aiTokens,
  aiReviews,
  t,
  locale,
}: AiUsagePanelProps) {
  const fmt = nf(locale);
  const avg = aiReviews > 0 ? Math.round(aiTokens / aiReviews) : 0;
  return (
    <SteelPanel title={t.aiUsage}>
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] bg-line/40 sm:grid-cols-3">
        <Metric
          label={t.tokens}
          value={fmt.format(aiTokens)}
          accent
        />
        <Metric label={t.aiUsage} value={fmt.format(aiReviews)} />
        <Metric label={t.tokens} value={fmt.format(avg)} hint="avg/review" />
      </dl>
    </SteelPanel>
  );
}

function Metric({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 bg-surface p-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <span
        className={[
          "font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums",
          accent ? "text-ink" : "text-ink-soft",
        ].join(" ")}
      >
        {value}
      </span>
      {hint && (
        <span className="text-[11px] lowercase tracking-wide text-muted">
          {hint}
        </span>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------- */

export interface FeatureFlagsPanelProps {
  flags: SystemHealth["featureFlags"];
  t: AdminDict["system"];
}

/** Read-only feature-flags grid. Renders the (static) platform flag set. */
export function FeatureFlagsPanel({ flags, t }: FeatureFlagsPanelProps) {
  return (
    <SteelPanel title={t.featureFlags} hint="read-only">
      {flags.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t.none}</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {flags.map((f) => (
            <li
              key={f.key}
              className="flex items-center justify-between gap-3 rounded-[8px] bg-surface px-4 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <span className="font-mono text-[0.8rem] text-ink-soft">
                {f.key}
              </span>
              <FlagPill enabled={f.enabled} />
            </li>
          ))}
        </ul>
      )}
    </SteelPanel>
  );
}

function FlagPill({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold",
        enabled
          ? "text-[oklch(0.82_0.13_150)] [box-shadow:inset_0_0_0_1px_oklch(0.82_0.13_150_/_0.4)]"
          : "text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "size-1.5 rounded-full",
          enabled
            ? "bg-[oklch(0.82_0.13_150)]"
            : "bg-muted",
        ].join(" ")}
      />
      {enabled ? "ON" : "OFF"}
    </span>
  );
}
