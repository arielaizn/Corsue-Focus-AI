import { BrowserFrame } from "@/components/ui";
import type { AIContent } from "@/content/ai";
import { IconChart, IconSpark, IconTrendDown, IconTrendUp } from "../icons";

/**
 * Business Advisor + Growth Coach mock — a metrics dashboard (MRR/active/churn/
 * LTV) with deltas, a sparkline, an AI insight line, and a Growth Coach move.
 * Rendered in a BrowserFrame as the owner's analytics screen.
 */
export function AdvisorDashboard({ data }: { data: AIContent["advisor"] }) {
  return (
    <BrowserFrame url="app.coursefocus.ai/analytics">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted">
          <IconChart width={14} height={14} />
          <span>{data.tag}</span>
        </div>

        {/* metrics */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {data.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg bg-bg-deep/50 px-3.5 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <p className="text-[11px] text-muted">{m.label}</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-medium tracking-[-0.005em] text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                {m.value}
              </p>
              <p
                className={
                  "mt-1 inline-flex items-center gap-1 text-[11px] font-medium " +
                  (m.up ? "text-[oklch(0.78_0.13_150)]" : "text-gold")
                }
              >
                {m.up ? (
                  <IconTrendUp width={12} height={12} />
                ) : (
                  <IconTrendDown width={12} height={12} />
                )}
                {m.delta}
              </p>
            </div>
          ))}
        </div>

        {/* sparkline */}
        <div className="mt-4 rounded-lg bg-surface/30 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <Sparkline />
        </div>

        {/* AI insight */}
        <div className="mt-4 rounded-lg bg-[oklch(0.55_0.11_250_/_0.08)] p-4 [box-shadow:inset_0_0_0_1px_oklch(0.55_0.11_250_/_0.26),inset_0_1px_0_oklch(1_0_0_/_0.04)]">
          <p className="text-gilt mb-2 flex items-center gap-1.5">
            <IconSpark width={12} height={12} className="text-gold" />
            {data.tag}
          </p>
          <p className="text-sm text-ink-soft">{data.insight}</p>
        </div>

        {/* growth coach */}
        <div className="mt-2.5 rounded-lg bg-[oklch(0.76_0.105_80_/_0.08)] p-4 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.28)]">
          <p className="mb-1.5 text-xs font-medium text-gold">{data.coachLabel}</p>
          <p className="text-sm text-ink-soft">{data.coachLine}</p>
        </div>
      </div>
    </BrowserFrame>
  );
}

function Sparkline() {
  // deterministic, monotonic-ish growth line (LTR drawing; BrowserFrame is dir=ltr)
  const pts = [8, 14, 11, 20, 24, 22, 30, 36, 33, 42, 48];
  const w = 320;
  const h = 64;
  const max = Math.max(...pts);
  const step = w / (pts.length - 1);
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 8) - 4}`)
    .join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="advArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.11 250 / 0.28)" />
          <stop offset="100%" stopColor="oklch(0.55 0.11 250 / 0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#advArea)" />
      <path
        d={d}
        fill="none"
        stroke="oklch(0.62 0.11 250)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default AdvisorDashboard;
