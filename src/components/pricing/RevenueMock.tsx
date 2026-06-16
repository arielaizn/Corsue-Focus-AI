"use client";

import { useId } from "react";
import type { Locale } from "@/lib/i18n";
import { Counter } from "@/components/ui";
import type { PricingContent } from "@/content/pricing";

interface Props {
  locale: Locale;
  t: PricingContent["revenuePanel"];
  currency: string;
}

// deterministic, on-brand revenue curve (rising)
const BARS = [0.42, 0.55, 0.5, 0.68, 0.82, 1];

/**
 * A credible dark dashboard panel — MRR sparkline + key metrics.
 * Pure SVG/HTML, on-brand. dir is forced LTR for the chart numerals only via the SVG.
 */
export function RevenueMock({ locale, t, currency }: Props) {
  const gid = useId().replace(/:/g, "");
  const w = 320;
  const h = 120;
  const pad = 8;
  const stepX = (w - pad * 2) / (BARS.length - 1);
  const points = BARS.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - v) * (h - pad * 2);
    return [x, y] as const;
  });
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(
    1,
  )},${h - pad} L${pad},${h - pad} Z`;

  const mrr = `${currency}${t.mrr.toLocaleString(
    locale === "he" ? "he-IL" : "en-US",
  )}`;

  return (
    <div className="rounded-2xl bg-surface/50 p-5 ring-line">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{t.title}</h3>
          <p className="mt-0.5 text-xs text-muted">{t.caption}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-bg-deep/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft ring-line">
          <span className="size-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_8px_oklch(0.78_0.16_150)]" />
          {locale === "he" ? "חי" : "Live"}
        </span>
      </div>

      {/* chart */}
      <div className="mt-4" dir="ltr">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          role="img"
          aria-label={
            locale === "he"
              ? "גרף הכנסה חודשית עולה"
              : "Rising monthly revenue chart"
          }
        >
          <defs>
            <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.6 0.25 300 / 0.35)" />
              <stop offset="100%" stopColor="oklch(0.6 0.25 300 / 0)" />
            </linearGradient>
            <linearGradient id={`line-${gid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.62 0.2 264)" />
              <stop offset="100%" stopColor="oklch(0.6 0.25 300)" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1={pad}
              x2={w - pad}
              y1={pad + g * (h - pad * 2)}
              y2={pad + g * (h - pad * 2)}
              stroke="oklch(0.34 0.045 266 / 0.5)"
              strokeWidth="1"
            />
          ))}
          <path d={areaPath} fill={`url(#area-${gid})`} />
          <path
            d={linePath}
            fill="none"
            stroke={`url(#line-${gid})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={i === points.length - 1 ? 4 : 2.5}
              fill={
                i === points.length - 1
                  ? "oklch(0.82 0.135 84)"
                  : "oklch(0.6 0.25 300)"
              }
            />
          ))}
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          {t.months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      {/* metrics */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
        <div>
          <p className="text-[11px] text-muted">{t.mrrLabel}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-gold [.font-he_&]:font-[family-name:var(--font-he)]">
            {mrr}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted">{t.activeLabel}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he)]">
            <Counter to={t.active} />
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted">{t.churnLabel}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he)]">
            {t.churn}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RevenueMock;
