import type { Locale } from "@/lib/i18n";
import type { PricingContent } from "@/content/pricing";

interface Props {
  locale: Locale;
  t: PricingContent["payments"];
}

/**
 * Payment-provider strip. Each provider is a real wordmark-style chip
 * (set in the display font), not a logo image — credible and license-safe.
 */
export function PaymentStrip({ t }: Props) {
  return (
    <div className="rounded-2xl bg-surface/30 px-6 py-7 ring-line">
      <p className="text-center text-sm font-medium text-muted">{t.title}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {t.providers.map((p) => (
          <div
            key={p.name}
            dir="ltr"
            className="flex items-center gap-2 rounded-xl bg-bg-deep/40 px-4 py-2.5 ring-line transition-colors hover:bg-surface/50"
          >
            <span className="size-2 rounded-full bg-gold-grad" aria-hidden />
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-ink">
              {p.name}
            </span>
            <span className="text-[11px] text-muted">{p.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentStrip;
