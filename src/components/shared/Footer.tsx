import Link from "next/link";
import { dictionary, paymentChips, aiChips } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { Logo } from "./Logo";
import { LocaleToggle } from "./LocaleToggle";

export interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = dictionary[locale].footer;
  const hrefFor = (slug: string) => `/${locale}${slug ? `/${slug}` : ""}`;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-deep">
      <div className="mx-auto max-w-[1240px] px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo href={hrefFor("")} size={34} />
            <p className="mt-5 text-pretty text-sm leading-relaxed text-muted">
              {t.mission}
            </p>
            <div className="mt-6">
              <LocaleToggle current={locale} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {t.columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link, i) => (
                    <li key={`${col.title}-${i}`}>
                      <Link
                        href={hrefFor(link.href)}
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
          <ChipRow label={t.paymentsLabel} chips={paymentChips} />
          <ChipRow label={t.aiLabel} chips={aiChips} />
        </div>

        <p className="mt-10 text-xs text-muted">
          {t.copyright} {year}
        </p>
      </div>
    </footer>
  );
}

function ChipRow({ label, chips }: { label: string; chips: string[] }) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-md bg-surface/50 px-2.5 py-1 text-xs font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Footer;
