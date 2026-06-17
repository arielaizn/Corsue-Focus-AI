"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import type { PricingContent } from "@/content/pricing";

interface Props {
  locale: Locale;
  t: PricingContent["growth"];
}

function CouponCard({ t, locale }: { t: PricingContent["growth"]["coupons"]; locale: Locale }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(t.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="panel-couture flex flex-col p-7">
      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-medium tracking-[-0.01em] text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
        {t.title}
      </h3>
      <p className="mt-3 max-w-[48ch] text-pretty text-[0.95rem] leading-relaxed text-ink-soft">{t.body}</p>

      {/* coupon mock */}
      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex flex-1 items-center justify-between gap-3 rounded-lg bg-bg-deep/60 px-4 py-3 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.35)]">
          {/* perforated notches */}
          <span
            aria-hidden
            className="absolute -start-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-bg"
          />
          <span
            aria-hidden
            className="absolute -end-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-bg"
          />
          <div className="flex flex-col">
            <span
              dir="ltr"
              className="font-[family-name:var(--font-display)] text-base font-semibold tracking-wide text-gold"
            >
              {t.code}
            </span>
            <span className="text-[11px] text-muted">{t.codeNote}</span>
          </div>
          <button
            type="button"
            onClick={copy}
            className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink"
            aria-label={locale === "he" ? "העתק קוד קופון" : "Copy coupon code"}
          >
            {copied
              ? locale === "he"
                ? "הועתק"
                : "Copied"
              : locale === "he"
                ? "העתק"
                : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AffiliateCard({ t }: { t: PricingContent["growth"]["affiliate"] }) {
  const reduced = useReducedMotion();
  return (
    <div className="panel-couture flex flex-col p-7">
      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-medium tracking-[-0.01em] text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
        {t.title}
      </h3>
      <p className="mt-3 max-w-[48ch] text-pretty text-[0.95rem] leading-relaxed text-ink-soft">{t.body}</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {t.stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.08 }}
            className={cn(
              "rounded-lg bg-bg-deep/50 px-3 py-5 text-center",
              i === 2
                ? "[box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4),inset_0_1px_0_oklch(1_0_0_/_0.05)]"
                : "ring-line",
            )}
          >
            <p className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-[-0.01em] text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
              {s.value}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function GrowthSection({ locale, t }: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <CouponCard t={t.coupons} locale={locale} />
      <AffiliateCard t={t.affiliate} />
    </div>
  );
}

export default GrowthSection;
