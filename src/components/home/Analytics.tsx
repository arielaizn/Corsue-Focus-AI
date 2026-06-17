"use client";

import { useId, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading, Counter } from "@/components/ui";
import { easeOutExpo } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

// a calm, generally-up 12-month recurring-revenue curve (0..100 domain)
const SERIES = [28, 31, 36, 34, 42, 48, 52, 58, 63, 71, 79, 88];

function buildPath(points: number[], w: number, h: number, pad = 4) {
  const stepX = (w - pad * 2) / (points.length - 1);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  return points
    .map((p, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((p - min) / span) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function Analytics({
  t,
  locale,
}: {
  t: HomeContent["analytics"];
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const gradId = useId();

  const W = 560;
  const H = 200;
  const line = buildPath(SERIES, W, H);
  const area = `${line} L${W - 4},${H - 4} L4,${H - 4} Z`;

  return (
    <section ref={ref} className="mx-auto max-w-[1240px] px-6 py-32 sm:py-44">
      <span aria-hidden className="gilt-rule mb-20 block max-w-[160px] opacity-60" />
      <Reveal>
        <SectionHeading
          kicker={
            locale === "he" ? "אנליטיקה + יועץ עסקי AI" : "Analytics + AI Advisor"
          }
          title={t.title}
          subtitle={t.sub}
          as="h2"
        />
      </Reveal>

      <Reveal y={20} delay={0.08}>
        <div className="mt-16 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* dashboard: stats + chart — a framed product mock */}
          <div className="frame overflow-hidden p-5 sm:p-6">
            {/* stat tiles */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {t.metrics.map((m, i) => (
                <motion.div
                  key={m.key}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{
                    duration: 0.5,
                    ease: easeOutExpo,
                    delay: reduced ? 0 : i * 0.06,
                  }}
                  className="rounded-[8px] bg-bg/60 p-3.5 ring-line"
                >
                  <p className="text-xs text-muted">{m.label}</p>
                  <p className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he-display)]">
                    <Counter
                      to={m.value}
                      prefix={m.prefix}
                      suffix={m.suffix}
                      decimals={m.decimals ?? 0}
                      duration={1.5}
                    />
                  </p>
                  <p
                    className={
                      "mt-1 inline-flex items-center gap-1 text-xs font-medium " +
                      (m.up ? "text-pos" : "text-gold")
                    }
                  >
                    <span aria-hidden>{m.up ? "▲" : "▼"}</span>
                    {m.delta}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* chart */}
            <div className="mt-5 rounded-[8px] bg-bg/60 p-4 ring-line">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-ink-soft">
                  {t.chartLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-[oklch(0.55_0.11_250)]"
                  />
                  {locale === "he" ? "הכנסה חוזרת" : "Recurring"}
                </span>
              </div>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-[180px] w-full"
                preserveAspectRatio="none"
                role="img"
                aria-label={t.chartLabel}
              >
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.55 0.11 250 / 0.22)"
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.55 0.11 250 / 0)"
                    />
                  </linearGradient>
                </defs>
                {/* gridlines */}
                {[0.25, 0.5, 0.75].map((g) => (
                  <line
                    key={g}
                    x1="4"
                    x2={W - 4}
                    y1={H * g}
                    y2={H * g}
                    stroke="var(--color-line)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    opacity="0.5"
                  />
                ))}
                {/* area fill */}
                <motion.path
                  d={area}
                  fill={`url(#${gradId})`}
                  initial={{ opacity: reduced ? 1 : 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.4 }}
                />
                {/* line draw */}
                <motion.path
                  d={line}
                  fill="none"
                  stroke="oklch(0.55 0.11 250)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: inView ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 1.6, ease: easeOutExpo }}
                />
                {/* end node */}
                <motion.circle
                  cx={W - 4}
                  cy={
                    H -
                    4 -
                    ((SERIES[SERIES.length - 1] - Math.min(...SERIES)) /
                      (Math.max(...SERIES) - Math.min(...SERIES))) *
                      (H - 8)
                  }
                  r="4"
                  fill="oklch(0.83 0.13 88)"
                  initial={{ opacity: reduced ? 1 : 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: reduced ? 0 : 1.5 }}
                />
              </svg>
            </div>
          </div>

          {/* AI Business Advisor panel */}
          <div className="gilt-rim relative flex flex-col overflow-hidden rounded-[8px] bg-surface p-6 sm:p-7">
            <div className="relative flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-[8px] bg-gold-grad text-bg-deep"
              >
                ✦
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {t.advisorLabel}
                </p>
                <p className="text-[11px] text-muted">
                  {locale === "he" ? "מנתח בזמן אמת" : "Analyzing in real time"}
                </p>
              </div>
            </div>

            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.5 }}
              className="relative mt-5 rounded-[8px] rounded-ss-sm bg-bg/70 p-4 text-sm leading-relaxed text-ink-soft ring-line"
            >
              {t.advisorMessage}
            </motion.div>

            <motion.a
              href={`/${locale}/ai`}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.7 }}
              className="relative mt-4 inline-flex h-10 w-fit items-center gap-2 self-start rounded-[6px] bg-ink px-4 text-sm font-semibold text-bg-deep transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t.advisorAction}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="rtl:rotate-180"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>

            <p className="relative mt-auto pt-6 text-[11px] text-muted">
              {locale === "he"
                ? "המלצות מבוססות על נתוני האקדמיה שלך בלבד."
                : "Recommendations based only on your academy's data."}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default Analytics;
