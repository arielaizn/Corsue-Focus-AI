"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/ui";
import { easeOutExpo } from "@/lib/motion";
import type { HomeContent } from "@/content/home";

/**
 * "Eight tools become one OS." Eight scattered tool chips animate inward
 * (whileInView) toward a single glowing aurora orb. Reduced-motion: chips
 * simply sit in a settled ring, no inward travel.
 */
export function Reframe({ t }: { t: HomeContent["reframe"] }) {
  const reduced = useReducedMotion();
  const n = t.tools.length;

  // settled positions on an ellipse around the orb (percent of stage)
  const positions = t.tools.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(angle) * 38, y: 50 + Math.sin(angle) * 40 };
  });

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <SectionHeading
            title={t.title}
            subtitle={t.sub}
            as="h2"
          />
          <p className="mt-6 text-pretty text-base text-ink-soft">{t.note}</p>
        </Reveal>

        {/* convergence stage */}
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px]">
          {/* connective lines */}
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
                stroke="oklch(0.62 0.2 264 / 0.22)"
                strokeWidth="0.4"
              />
            ))}
          </svg>

          {/* central OS orb */}
          <motion.div
            initial={reduced ? { scale: 1 } : { scale: 0.7, opacity: 0.6 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.25 }}
            className="absolute left-1/2 top-1/2 z-[2] grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-aurora text-center [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.55),0_0_70px_-4px_oklch(0.6_0.25_300_/_0.75)]"
          >
            <span className="px-2 font-[family-name:var(--font-display)] text-base font-semibold leading-tight text-ink">
              {t.osLabel}
            </span>
          </motion.div>

          {/* tool chips that fly inward */}
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
                className="absolute z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-surface/80 px-3 py-1.5 text-xs font-medium text-ink-soft backdrop-blur [box-shadow:inset_0_0_0_1px_var(--color-line)]"
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
