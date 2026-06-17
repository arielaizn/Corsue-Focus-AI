import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { AppDict } from "@/lib/app-dictionary";
import { Logo } from "@/components/shared/Logo";

export interface AuthShellProps {
  locale: Locale;
  t: AppDict["auth"];
  heading: string;
  sub: string;
  switchPrompt: string;
  switchHref: string;
  switchLabel: string;
  children: ReactNode;
}

/**
 * Premium split-screen auth shell (Midnight Atelier). Left: brand nebula panel
 * with the three product pillars. Right: the form. Calm, dark, expensive —
 * its own chrome, no marketing nav/footer.
 */
export function AuthShell({
  locale,
  t,
  heading,
  sub,
  switchPrompt,
  switchHref,
  switchLabel,
  children,
}: AuthShellProps) {
  return (
    <div className="relative grid min-h-dvh bg-bg lg:grid-cols-[1.05fr_1fr]">
      {/* Static nebula + grain backdrop (calm, no JS) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "var(--grad-nebula)" }}
      />

      {/* Brand panel */}
      <aside className="relative z-10 hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-bg-deep/60"
          style={{ background: "var(--grad-nebula)" }}
        />
        <Logo href={`/${locale}`} size={34} draw />

        <div className="max-w-md">
          <p className="text-gilt mb-5">{t.brandKicker}</p>
          <ul className="flex flex-col gap-6">
            {t.pillars.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gold [box-shadow:0_0_0_1px_oklch(0.76_0.105_80_/_0.35)]"
                />
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={`/${locale}`}
          className="text-sm text-muted transition-colors hover:text-ink-soft"
        >
          ← {t.backToSite}
        </Link>
      </aside>

      {/* Form panel */}
      <main className="relative z-10 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo href={`/${locale}`} size={32} />
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-h2 font-bold text-ink">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">{sub}</p>

          <hr className="gilt-rule my-7" />

          {children}

          <p className="mt-8 text-center text-sm text-muted">
            {switchPrompt}{" "}
            <Link
              href={switchHref}
              className="font-semibold text-gold transition-colors hover:text-gold-bright"
            >
              {switchLabel}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
