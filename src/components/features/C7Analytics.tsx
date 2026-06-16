import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { ProgressBar } from "./bits";
import { IconChart } from "./icons";

/** Deterministic mini area-chart (SSR-safe, fixed points). */
function RevenueChart() {
  const pts = [22, 30, 27, 41, 38, 52, 49, 64, 72];
  const w = 320;
  const h = 96;
  const max = 80;
  const step = w / (pts.length - 1);
  const coords = pts.map((p, i) => [i * step, h - (p / max) * h]);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" aria-hidden role="img">
      <defs>
        <linearGradient id="cf-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.25 300 / 0.45)" />
          <stop offset="100%" stopColor="oklch(0.62 0.2 264 / 0)" />
        </linearGradient>
        <linearGradient id="cf-rev-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.62 0.2 264)" />
          <stop offset="100%" stopColor="oklch(0.6 0.25 300)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cf-rev)" />
      <path d={line} fill="none" stroke="url(#cf-rev-line)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** C7 — Analytics. Two dashboards side by side: owner metrics + AI advisor, and student progress. */
export function C7Analytics({ locale }: { locale: Locale }) {
  const t = content[locale].c7;

  return (
    <Section className="py-20 sm:py-28">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Owner dashboard */}
        <Reveal y={26}>
          <div className="rounded-2xl bg-surface/40 p-6 ring-line sm:p-7">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="text-gold">
                <IconChart size={16} />
              </span>
              {t.ownerLabel}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {t.ownerMetrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-bg/60 p-3.5 ring-line">
                  <div className="text-xs text-muted">{m.label}</div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                    {m.value}
                  </div>
                  <div
                    className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium ${
                      m.up ? "text-[oklch(0.78_0.15_150)]" : "text-[oklch(0.7_0.16_25)]"
                    }`}
                  >
                    <span aria-hidden>{m.up ? "▲" : "▼"}</span>
                    {m.trend}
                  </div>
                </div>
              ))}
            </div>

            {/* revenue chart */}
            <div className="mt-5 rounded-xl bg-bg/60 p-4 ring-line">
              <div className="mb-3 text-xs font-semibold text-muted">{t.revenueLabel}</div>
              <RevenueChart />
            </div>

            {/* AI advisor */}
            <div className="mt-5 rounded-xl bg-[oklch(0.62_0.2_264_/_0.1)] p-4 [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.35)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-gold">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-aurora text-ink">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
                {t.advisorLabel}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.advisorText}</p>
            </div>
          </div>
        </Reveal>

        {/* Student dashboard */}
        <Reveal y={26} delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl bg-surface/40 p-6 ring-line sm:p-7">
            <div className="text-sm font-semibold text-ink">{t.studentLabel}</div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {t.studentMetrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-bg/60 p-3.5 ring-line">
                  <div className="text-xs text-muted">{m.label}</div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-gold">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs font-semibold text-muted">{t.studentProgressLabel}</div>
            <div className="mt-3 flex flex-col gap-4">
              {t.studentCourses.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">{c.name}</span>
                    <span className="text-xs text-muted tabular-nums">{c.pct}%</span>
                  </div>
                  <ProgressBar value={c.pct} className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default C7Analytics;
