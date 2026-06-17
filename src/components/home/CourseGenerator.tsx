"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading, BrowserFrame } from "@/components/ui";
import { easeOutExpo } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

export function CourseGenerator({
  t,
  locale,
}: {
  t: HomeContent["generator"];
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  // step: -1 idle, 0..steps.length running, steps.length = done
  const [step, setStep] = useState(-1);
  const dir = locale === "he" ? "rtl" : "ltr";

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(t.steps.length);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(0), 500));
    t.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 900 + i * 850));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced, t.steps.length, t.steps]);

  const started = step >= 0;
  const done = step >= t.steps.length;

  return (
    <section ref={ref} className="mx-auto max-w-[1240px] px-6 py-32 sm:py-44">
      <span aria-hidden className="gilt-rule mx-auto mb-20 block max-w-[160px] opacity-60" />
      <Reveal>
        <SectionHeading
          title={t.title}
          subtitle={t.sub}
          align="center"
          as="h2"
          className="mx-auto max-w-2xl"
        />
      </Reveal>

      <Reveal y={28} delay={0.1}>
        <div className="mx-auto mt-12 max-w-[1000px]">
          <BrowserFrame url="app.coursefocus.ai/ai/course-generator">
            <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]" dir={dir}>
              {/* left: prompt + steps */}
              <div className="border-line/70 p-5 md:border-e sm:p-6">
                <span className="text-xs font-medium text-muted">
                  {t.promptLabel}
                </span>
                <div className="mt-2 rounded-[6px] bg-surface p-3.5 text-sm text-ink ring-line">
                  {t.prompt}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-[6px] bg-ink px-3.5 py-2 text-sm font-semibold text-bg-deep">
                  {!done && started ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-[orbit-spin_0.9s_linear_infinite] rounded-full border-2 border-bg-deep/30 border-t-bg-deep" />
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <span aria-hidden>✦</span>
                      {t.generate}
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {t.steps.map((s, i) => {
                    const active = step === i;
                    const complete = step > i;
                    return (
                      <li key={s.label} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className={
                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] transition-colors " +
                            (complete
                              ? "bg-ink text-bg-deep"
                              : active
                                ? "bg-bg text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.5)]"
                                : "bg-bg text-muted ring-line")
                          }
                        >
                          {complete ? "✓" : active ? "•" : i + 1}
                        </span>
                        <div>
                          <p
                            className={
                              "text-sm font-medium transition-colors " +
                              (complete || active ? "text-ink" : "text-muted")
                            }
                          >
                            {s.label}
                          </p>
                          <AnimatePresence>
                            {(complete || active) && (
                              <motion.p
                                initial={
                                  reduced ? { opacity: 1 } : { opacity: 0, height: 0 }
                                }
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.4, ease: easeOutExpo }}
                                className="overflow-hidden text-xs text-ink-soft"
                              >
                                {s.detail}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* right: generated outline */}
              <div className="bg-bg-deep p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                    {t.outlineTitle}
                  </h3>
                  <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-gold gilt-rim">
                    AI
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {t.modules.map((m, mi) => {
                    const reveal = done || step > mi;
                    return (
                      <motion.div
                        key={m.title}
                        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                        animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 0 }}
                        transition={{ duration: 0.45, ease: easeOutExpo }}
                        className="rounded-[6px] bg-surface p-3 ring-line"
                      >
                        <div className="flex items-center gap-2">
                          <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-bg text-[11px] font-semibold text-ink-soft ring-line">
                            {mi + 1}
                          </span>
                          <span className="text-sm font-medium text-ink">
                            {m.title}
                          </span>
                        </div>
                        <ul className="mt-2 grid gap-1 ps-7 text-xs text-ink-soft">
                          {m.lessons.map((l) => (
                            <li key={l} className="flex items-center gap-2">
                              <span
                                aria-hidden
                                className="h-1 w-1 rounded-full bg-muted"
                              />
                              {l}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={done ? { opacity: 1, y: 0 } : { opacity: 0.25 }}
                    transition={{ duration: 0.45, ease: easeOutExpo, delay: 0.1 }}
                    className="rounded-[6px] bg-surface p-3 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]"
                  >
                    <span className="text-sm font-medium text-gold">
                      {t.quizLabel}
                    </span>
                    <ul className="mt-2 grid gap-1 text-xs text-ink-soft">
                      {t.quizItems.map((q, qi) => (
                        <li key={q} className="flex items-center gap-2">
                          <span className="text-gold">{qi + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </Reveal>
    </section>
  );
}

export default CourseGenerator;
