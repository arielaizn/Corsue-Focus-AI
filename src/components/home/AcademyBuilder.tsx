"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/ui";
import { Logo } from "@/components/shared";
import { easeOutExpo } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 13 4 4 10-12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "flex h-10 w-full items-center rounded-lg bg-bg px-3 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]";

export function AcademyBuilder({
  t,
  locale,
}: {
  t: HomeContent["academy"];
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<"idle" | "building" | "ready">("idle");
  const p = t.panel;
  // restrained brand swatches — ink-blue is allowed INSIDE the product mock only
  const swatches = [
    "oklch(0.55 0.11 250)",
    "oklch(0.76 0.105 80)",
    "oklch(0.66 0.01 75)",
    "oklch(0.5 0.06 220)",
  ];
  const [brand, setBrand] = useState(0);

  function run() {
    if (state === "building") return;
    setState("building");
    if (reduced) {
      setState("ready");
      return;
    }
    setTimeout(() => setState("ready"), 1700);
  }

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-32 sm:py-44">
      <span aria-hidden className="gilt-rule mb-24 block max-w-[160px] opacity-60" />
      <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* copy */}
        <Reveal>
          <SectionHeading
            title={t.title}
            subtitle={t.sub}
            as="h2"
          />
          <ul className="mt-10 space-y-4">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-1 text-gold" aria-hidden>
                  <Check />
                </span>
                <span className="text-pretty">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* live create panel — a framed product mock */}
        <Reveal y={20} delay={0.05}>
          <div className="frame relative overflow-hidden p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">{p.title}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-1 text-[11px] text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {p.subdomainValue}.coursefocus.ai
              </span>
            </div>

            <div className="grid gap-4">
              <Field label={p.nameLabel}>
                <div className={inputCls}>{p.nameValue}</div>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={p.subdomainLabel}>
                  <div className={inputCls}>
                    <span className="text-ink">{p.subdomainValue}</span>
                    <span className="text-muted">.coursefocus.ai</span>
                  </div>
                </Field>
                <Field label={p.brandLabel}>
                  <div className="flex h-10 items-center gap-2 rounded-lg bg-bg px-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {swatches.map((c, i) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`${p.brandLabel} ${i + 1}`}
                        aria-pressed={brand === i}
                        onClick={() => setBrand(i)}
                        className="h-5 w-5 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          boxShadow:
                            brand === i
                              ? "0 0 0 2px var(--color-bg), 0 0 0 4px oklch(0.83 0.13 88)"
                              : "inset 0 0 0 1px oklch(1 0 0 / 0.15)",
                        }}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label={p.langLabel}>
                  <div className={inputCls}>{p.langValue}</div>
                </Field>
                <Field label={p.currencyLabel}>
                  <div className={inputCls}>{p.currencyValue}</div>
                </Field>
                <Field label={p.tzLabel}>
                  <div className={inputCls}>{p.tzValue}</div>
                </Field>
              </div>

              <Field label={p.logoLabel}>
                <div className="flex items-center gap-3 rounded-lg bg-bg p-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-md text-sm font-bold text-ink"
                    style={{ backgroundColor: swatches[brand] }}
                  >
                    {p.nameValue.trim().charAt(0)}
                  </span>
                  <span className="text-xs text-muted">logo.png · 512×512</span>
                </div>
              </Field>

              <button
                type="button"
                onClick={run}
                disabled={state === "building"}
                className="relative mt-1 flex h-11 items-center justify-center gap-2 overflow-hidden rounded-[6px] bg-ink text-sm font-semibold text-bg-deep transition-transform hover:-translate-y-0.5 disabled:opacity-80"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {state === "idle" && (
                    <motion.span
                      key="cta"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {p.cta}
                    </motion.span>
                  )}
                  {state === "building" && (
                    <motion.span
                      key="building"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="h-3.5 w-3.5 animate-[orbit-spin_0.9s_linear_infinite] rounded-full border-2 border-bg-deep/30 border-t-bg-deep" />
                      {p.building}
                    </motion.span>
                  )}
                  {state === "ready" && (
                    <motion.span
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {p.ready}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* success — a quiet gilt rim, no glow */}
            <AnimatePresence>
              {state === "ready" && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: easeOutExpo }}
                  className="pointer-events-none absolute inset-0 rounded-[8px] [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.55)]"
                />
              )}
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 opacity-80">
            <Logo size={18} showWordmark={false} href={undefined} />
            <span className="text-[11px] text-muted">
              {locale === "he"
                ? "מופעל על ידי CourseFocus — מוסתר באקדמיה שלך"
                : "Powered by CourseFocus — hidden on your academy"}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default AcademyBuilder;
