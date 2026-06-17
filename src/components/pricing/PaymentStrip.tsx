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
    <div className="panel-couture px-8 py-9">
      <p className="text-center text-sm font-medium text-ink-soft">{t.title}</p>
      <span aria-hidden className="gilt-rule mx-auto mt-5 max-w-[120px] opacity-40" />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {t.providers.map((p) => (
          <div
            key={p.name}
            dir="ltr"
            className="flex items-center gap-2 rounded-lg bg-bg-deep/50 px-4 py-2.5 ring-line transition-colors hover:bg-surface-2"
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
