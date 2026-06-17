"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/ui";
import { easeOutExpo } from "@/lib/motion";
import type { HomeContent } from "@/content/home";

/**
 * "Eight tools become one OS." Eight scattered tool labels settle on an ellipse
 * around a single flat core, joined by fine gold hairlines. No glow, no aurora —
 * a restrained editorial convergence diagram.
 */
export function Reframe({ t }: { t: HomeContent["reframe"] }) {
  const reduced = useReducedMotion();
  const n = t.tools.length;

  const positions = t.tools.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(angle) * 38, y: 50 + Math.sin(angle) * 40 };
  });

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-32 sm:py-44">
      <span aria-hidden className="gilt-rule mb-24 block max-w-[160px] opacity-60" />
      <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal y={0} x={-24} duration={0.95}>
          <SectionHeading title={t.title} subtitle={t.sub} as="h2" />
          <p className="mt-8 max-w-[60ch] text-pretty text-[length:var(--text-lead)] leading-[1.62] text-ink-soft">
            {t.note}
          </p>
        </Reveal>

        {/* convergence stage */}
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px]">
          {/* fine gold hairlines toward the core */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {positions.map((p, i) => (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={50}
                y2={50}
                stroke="oklch(0.76 0.105 80 / 0.28)"
                strokeWidth="0.35"
              />
            ))}
          </svg>

          {/* central OS core — flat surface, gilt rim, no glow */}
          <motion.div
            initial={reduced ? { scale: 1 } : { scale: 0.82, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.2 }}
            className="gilt-rim absolute left-1/2 top-1/2 z-[2] grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-surface text-center"
          >
            <span className="px-2 font-[family-name:var(--font-display)] text-base font-medium leading-tight text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
              {t.osLabel}
            </span>
          </motion.div>

          {/* tool labels settling onto the ellipse */}
          {t.tools.map((tool, i) => {
            const p = positions[i];
            return (
              <motion.span
                key={tool}
                initial={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 0, left: "50%", top: "50%" }
                }
                whileInView={{ opacity: 1, left: `${p.x}%`, top: `${p.y}%` }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{
                  duration: 0.7,
                  ease: easeOutExpo,
                  delay: 0.05 * i,
                }}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="ring-line absolute z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-bg px-3 py-1.5 text-xs text-ink-soft"
              >
                {tool}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Reframe;
