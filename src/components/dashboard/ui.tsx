import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Shared dashboard primitives — premium "Midnight Atelier" control-room style.
   Server-safe (no "use client"); pure presentational.
--------------------------------------------------------------------------- */

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  actions?: ReactNode;
  className?: string;
}

/** Page title block with an optional gilt kicker + right-aligned actions. */
export function PageHeader({
  title,
  subtitle,
  kicker,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {kicker && <p className="text-gilt mb-2">{kicker}</p>}
        <h1 className="font-[family-name:var(--font-display)] text-h2 font-bold text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-sm text-ink-soft">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
  className?: string;
}

/** A single KPI tile. `accent` adds a rare gilt rim for the headline metric. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "panel-premium relative flex flex-col gap-2 p-5",
        accent && "gilt-rim",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
        {icon && (
          <span className="text-ink-soft/70" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <span className="font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums text-ink">
        {value}
      </span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  body: string;
  icon?: ReactNode;
  cta?: { label: string; href: string };
  className?: string;
}

/** Calm, premium empty/zero state with an optional aurora CTA. */
export function EmptyState({
  title,
  body,
  icon,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "panel-premium glow-aurora relative flex flex-col items-center gap-4 px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-2xl bg-surface-2/70 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.35)]"
        >
          {icon}
        </span>
      )}
      <div className="max-w-md">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">{body}</p>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="bg-ink text-bg-deep mt-1 inline-flex items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

export interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Generic premium content panel for feature pages. */
export function Panel({ title, children, className }: PanelProps) {
  return (
    <section className={cn("panel-premium p-6", className)}>
      {title && (
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/** Small soon/role pill. */
export function Pill({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold",
        tone === "gold"
          ? "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]"
          : "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]",
      )}
    >
      {children}
    </span>
  );
}
