"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import type { PricingContent, BillingCycle, TierCopy } from "@/content/pricing";
import { CheckIcon } from "./icons";

interface Props {
  locale: Locale;
  t: PricingContent;
}

function formatPrice(n: number, currency: string, locale: Locale): string {
  const grouped = n.toLocaleString(locale === "he" ? "he-IL" : "en-US");
  // currency leads in EN ($49), trails naturally in HE reading order (₪199)
  return `${currency}${grouped}`;
}

function PriceDisplay({
  tier,
  cycle,
  currency,
  locale,
}: {
  tier: TierCopy;
  cycle: BillingCycle;
  currency: string;
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  if (tier.priceMonthly === null) {
    return (
      <span className="font-[family-name:var(--font-display)] text-4xl font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he)]">
        {tier.customLabel}
      </span>
    );
  }
  const value = cycle === "annual" ? tier.priceAnnual! : tier.priceMonthly;
  const key = `${cycle}-${value}`;
  return (
    <span className="flex items-baseline gap-1">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={key}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: easeOutExpo }}
          className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-none text-ink [.font-he_&]:font-[family-name:var(--font-he)]"
        >
          {formatPrice(value, currency, locale)}
        </motion.span>
      </AnimatePresence>
      {tier.perUnit && (
        <span className="text-sm font-medium text-muted">{tier.perUnit}</span>
      )}
    </span>
  );
}

export function PricingPlans({ locale, t }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>("annual");
  const reduced = useReducedMotion();
  const cycles: BillingCycle[] = ["monthly", "annual"];
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onRadioKeyDown(e: React.KeyboardEvent) {
    const next = ["ArrowRight", "ArrowDown"].includes(e.key);
    const prev = ["ArrowLeft", "ArrowUp"].includes(e.key);
    if (!next && !prev) return;
    e.preventDefault();
    const cur = cycles.indexOf(cycle);
    // Arrow advances/retreats with wraparound; LTR/RTL agnostic (radio-pattern convention).
    const idx = (cur + (next ? 1 : -1) + cycles.length) % cycles.length;
    setCycle(cycles[idx]);
    radioRefs.current[idx]?.focus();
  }

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex flex-col items-center gap-3">
        <div
          role="radiogroup"
          aria-label={locale === "he" ? "מחזור חיוב" : "Billing cycle"}
          onKeyDown={onRadioKeyDown}
          className="relative inline-flex items-center rounded-full bg-surface/70 p-1 ring-line"
        >
          {(["monthly", "annual"] as const).map((c, ci) => {
            const selected = cycle === c;
            return (
              <button
                key={c}
                ref={(el) => {
                  radioRefs.current[ci] = el;
                }}
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCycle(c)}
                className={cn(
                  "relative z-[1] rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200",
                  selected ? "text-ink" : "text-muted hover:text-ink-soft",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="billing-pill"
                    aria-hidden
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                    className="absolute inset-0 -z-[1] rounded-full bg-surface-2 [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.35)]"
                  />
                )}
                {c === "monthly" ? t.toggle.monthly : t.toggle.annual}
              </button>
            );
          })}
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
            <path
              d="M8 1.5 9.9 5.6l4.6.5-3.4 3.1.9 4.5L8 11.5 4 13.7l.9-4.5L1.5 6.1l4.6-.5z"
              fill="currentColor"
            />
          </svg>
          {t.toggle.annualBadge}
        </span>
      </div>

      {/* Tier cards */}
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {t.tiers.map((tier, i) => {
          const isPro = tier.highlighted;
          return (
            <motion.div
              key={tier.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{
                duration: 0.6,
                ease: easeOutExpo,
                delay: reduced ? 0 : i * 0.07,
              }}
              className={cn(
                "relative flex flex-col rounded-2xl p-6",
                isPro
                  ? "bg-surface/80 [box-shadow:inset_0_0_0_1.5px_oklch(0.82_0.135_84_/_0.55),0_24px_70px_-30px_oklch(0.82_0.135_84_/_0.5)] xl:-translate-y-3"
                  : "bg-surface/40 ring-line",
              )}
            >
              {tier.ribbon && (
                <span className="absolute -top-3 start-6 inline-flex items-center rounded-full bg-gold-grad px-3 py-1 text-xs font-semibold text-bg-deep shadow-[0_6px_20px_-6px_oklch(0.82_0.135_84_/_0.6)]">
                  {tier.ribbon}
                </span>
              )}

              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he)]">
                  {tier.name}
                </h3>
              </div>
              <p className="mt-1.5 min-h-[2.5rem] text-sm text-ink-soft">
                {tier.tagline}
              </p>

              <div className="mt-5 min-h-[3.5rem]">
                <PriceDisplay
                  tier={tier}
                  cycle={cycle}
                  currency={t.toggle.currency}
                  locale={locale}
                />
                <p className="mt-1.5 text-xs text-muted">
                  {cycle === "annual" || tier.priceMonthly === null
                    ? tier.annualNote
                    : tier.id === "starter"
                      ? tier.annualNote
                      : locale === "he"
                        ? "בחיוב חודשי"
                        : "billed monthly"}
                </p>
              </div>

              <p className="mt-4 border-t border-line pt-4 text-xs font-medium uppercase tracking-wide text-gold/90">
                {tier.meta}
              </p>

              <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <span
                      className={cn(
                        "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                        isPro ? "text-gold" : "text-primary-bright",
                      )}
                    >
                      <CheckIcon className="size-3.5" />
                    </span>
                    <span className="text-pretty">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  href={`/${locale}/pricing`}
                  variant={isPro ? "primary" : "secondary"}
                  magnetic={isPro}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mx-auto mt-8 max-w-[60ch] text-center text-xs text-muted">
        {t.indicativeNote}
      </p>
    </div>
  );
}

export default PricingPlans;
