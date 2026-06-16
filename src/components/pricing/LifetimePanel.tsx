import type { Locale } from "@/lib/i18n";
import { Button, GlowCard } from "@/components/ui";
import type { PricingContent } from "@/content/pricing";
import { CheckIcon } from "./icons";

interface Props {
  locale: Locale;
  t: PricingContent["lifetime"];
  currency: string;
}

export function LifetimePanel({ locale, t, currency }: Props) {
  const price = `${currency}${t.price.toLocaleString(
    locale === "he" ? "he-IL" : "en-US",
  )}`;
  return (
    <GlowCard tone="gold" className="glow-gold p-7 sm:p-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-deep/50 px-3 py-1 text-xs font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.4)]">
            <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden>
              <path d="M8 1.5 9.9 5.6l4.6.5-3.4 3.1.9 4.5L8 11.5 4 13.7l.9-4.5L1.5 6.1l4.6-.5z" />
            </svg>
            {t.badge}
          </span>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-balance text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.03em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
            {t.title}
          </h3>
          <p className="mt-4 max-w-[52ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">{t.body}</p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-pretty">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[16px] bg-bg-deep/50 p-7 text-center [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3),inset_0_1px_0_oklch(1_0_0_/_0.06)]">
          <p className="text-gilt">{t.priceLabel}</p>
          <span aria-hidden className="gilt-rule mx-auto mt-4 max-w-[80px] opacity-50" />
          <p className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-bold leading-none tracking-[-0.03em] text-gold [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
            {price}
          </p>
          <div className="mt-5">
            <Button href={`/${locale}/pricing`} magnetic className="w-full">
              {t.cta}
            </Button>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

export default LifetimePanel;
