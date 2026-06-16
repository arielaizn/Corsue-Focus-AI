"use client";

import { Reveal, SectionHeading, PhoneFrame } from "@/components/ui";
import { Logo } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

/**
 * Marketplace + Mobile + API three-up. Each panel is a DIFFERENT device:
 * a marketplace listing stack, a PhoneFrame student-app mock, and a real
 * API request/response block (the ONE place Geist Mono is allowed on Home).
 */
export function Platform({
  t,
  locale,
}: {
  t: HomeContent["platform"];
  locale: Locale;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-36">
      <span aria-hidden className="gilt-rule block mb-16 opacity-30" />
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.sub} as="h2" />
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {/* Marketplace — a listing stack */}
        <Reveal y={24}>
          <article className="panel-premium flex h-full flex-col overflow-hidden p-6">
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold leading-[1.1] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
              {t.marketplace.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{t.marketplace.desc}</p>

            <ul className="mt-5 space-y-2.5">
              {t.marketplace.items.map((it, i) => (
                <li
                  key={it}
                  className="flex items-center gap-3 rounded-xl bg-bg/60 p-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                >
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-aurora text-sm font-semibold text-ink"
                  >
                    {it.trim().charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {it}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted">
                      <span aria-hidden className="text-gold">
                        ★
                      </span>
                      4.9 · {1200 - i * 280}{" "}
                      {locale === "he" ? "תלמידים" : "students"}
                    </span>
                  </span>
                  <span className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.35)]">
                    {locale === "he" ? "מובל" : "Top"}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        {/* Mobile — PhoneFrame student-app mock */}
        <Reveal y={24} delay={0.06}>
          <article className="panel-premium flex h-full flex-col overflow-hidden p-6">
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold leading-[1.1] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
              {t.mobile.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{t.mobile.desc}</p>

            <div className="mt-6 flex flex-1 items-end justify-center">
              <PhoneFrame className="max-w-[230px]">
                <div className="flex flex-col" dir={locale === "he" ? "rtl" : "ltr"}>
                  {/* app top bar */}
                  <div className="flex items-center justify-between px-4 pb-3 pt-7">
                    <Logo size={16} showWordmark={false} href={undefined} />
                    <span className="text-xs font-semibold text-ink">
                      {t.mobile.appName}
                    </span>
                    <span
                      aria-hidden
                      className="grid h-6 w-6 place-items-center rounded-full bg-surface text-[11px] text-gold [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                    >
                      ✦
                    </span>
                  </div>

                  {/* now-playing lesson card */}
                  <div className="px-4">
                    <div className="overflow-hidden rounded-xl bg-surface/60 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                      <div
                        className="relative h-24 bg-aurora"
                        aria-hidden
                      >
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-bg-deep/60 text-ink">
                            ▶
                          </span>
                        </span>
                        <span className="absolute bottom-2 end-2 rounded-md bg-bg-deep/70 px-1.5 py-0.5 text-[10px] text-ink">
                          12:40
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] font-medium text-ink">
                          {t.mobile.lesson}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
                          <div className="h-full w-[68%] rounded-full bg-gold-grad" />
                        </div>
                        <p className="mt-1.5 text-[10px] text-muted">
                          {t.mobile.progress}
                        </p>
                      </div>
                    </div>

                    {/* offline pill */}
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface/60 px-2.5 py-1 text-[10px] text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                      <span aria-hidden className="text-[oklch(0.78_0.15_150)]">
                        ↓
                      </span>
                      {locale === "he" ? "זמין אופליין" : "Available offline"}
                    </div>
                  </div>

                  {/* bottom nav */}
                  <div className="mt-4 flex items-center justify-around border-t border-line/70 px-2 py-2.5">
                    {t.mobile.nav.map((n, i) => (
                      <span
                        key={n}
                        className={
                          "flex flex-col items-center gap-0.5 text-[9px] " +
                          (i === 1 ? "text-gold" : "text-muted")
                        }
                      >
                        <span
                          aria-hidden
                          className={
                            "h-1.5 w-1.5 rounded-full " +
                            (i === 1 ? "bg-gold" : "bg-muted/50")
                          }
                        />
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </PhoneFrame>
            </div>
          </article>
        </Reveal>

        {/* API — the ONE mono block on Home */}
        <Reveal y={24} delay={0.12}>
          <article className="panel-premium flex h-full flex-col overflow-hidden p-6">
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold leading-[1.1] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
              {t.api.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{t.api.desc}</p>

            <div
              dir="ltr"
              className="mt-5 flex flex-1 flex-col overflow-hidden rounded-xl bg-bg-deep [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              {/* endpoint header */}
              <div className="flex items-center gap-2 border-b border-line/70 px-3.5 py-2.5">
                <span className="rounded-md bg-[oklch(0.62_0.2_264_/_0.18)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-primary-bright">
                  {t.api.method}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-ink-soft">
                  {t.api.endpoint}
                </span>
                <span className="ms-auto inline-flex items-center gap-1 text-[10px] text-[oklch(0.78_0.15_150)]">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.15_150)]"
                  />
                  200 OK
                </span>
              </div>
              {/* code */}
              <pre className="overflow-x-auto p-3.5 font-[family-name:var(--font-mono)] text-[11.5px] leading-relaxed text-ink-soft">
                <code>{t.api.code}</code>
              </pre>
            </div>

            <p className="mt-4 text-[11px] text-muted">{t.api.caption}</p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export default Platform;
