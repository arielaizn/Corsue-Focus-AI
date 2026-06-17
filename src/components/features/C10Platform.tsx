import { Reveal, SectionHeading, PhoneFrame } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { ProgressBar } from "./bits";
import { IconCode, IconBolt, IconArrowR } from "./icons";

// Couture syntax: foil for keywords/functions, ink-blue (mockup-only) for
// strings, bone for plain. No violet/green chrome colours.
const SYNTAX: Record<string, string> = {
  comment: "text-muted",
  kw: "text-gold-bright",
  fn: "text-gold",
  str: "text-ink-blue",
  plain: "text-ink-soft",
};

/** C10 — Platform & Developer. API code (mono — sanctioned here) + automation node-graph + PhoneFrame mobile mock. */
export function C10Platform({ locale }: { locale: Locale }) {
  const t = content[locale].c10;

  return (
    <Section tint className="py-24 sm:py-36">
      <Reveal className="max-w-2xl">
        <SectionHeading kicker={t.kicker} title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Left — API code + webhooks + automation node-graph */}
        <div className="flex flex-col gap-6">
          {/* API code block — MONO sanctioned */}
          <Reveal y={24}>
            <div className="frame overflow-hidden" dir="ltr">
              <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
                <span className="text-gold"><IconCode size={15} /></span>
                <span className="text-xs font-medium text-ink-soft">{t.apiLabel}</span>
                <span className="ms-auto flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full [box-shadow:inset_0_0_0_1px_var(--color-line)]" />
                  <span className="h-2.5 w-2.5 rounded-full [box-shadow:inset_0_0_0_1px_var(--color-line)]" />
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed">
                <code>
                  <span className="block text-muted">{t.apiComment}</span>
                  {t.apiCode.map((line, i) => (
                    <span key={i} className="block">
                      {line.map((tok, j) => (
                        <span key={j} className={SYNTAX[tok.kind]}>
                          {tok.text}
                        </span>
                      ))}
                      {line.length === 0 ? " " : null}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </Reveal>

          {/* Webhooks */}
          <Reveal y={24} delay={0.05}>
            <div className="panel-couture p-5">
              <div className="text-xs font-semibold text-muted">{t.webhookLabel}</div>
              <div className="mt-3 flex flex-wrap gap-2" dir="ltr">
                {t.webhooks.map((w) => (
                  <span
                    key={w}
                    className="rounded-[6px] bg-bg-deep/70 px-3 py-1.5 font-mono text-xs text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Automation node-graph */}
          <Reveal y={24} delay={0.1}>
            <div className="panel-couture p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="text-gold"><IconBolt size={15} /></span>
                {t.automationLabel}
              </div>
              <div className="mt-2 text-sm text-ink-soft">{t.automationTitle}</div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
                {t.nodes.map((node, i) => (
                  <div key={i} className="flex flex-1 items-stretch gap-2.5 sm:flex-col">
                    <div
                      className={`flex flex-1 flex-col rounded-[8px] p-3.5 ${
                        i === 0
                          ? "bg-bg-deep [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.45)]"
                          : "bg-bg-deep/60 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                      }`}
                    >
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wide text-gold"
                      >
                        {node.label}
                      </span>
                      <span className="mt-1 text-sm text-ink">{node.sub}</span>
                    </div>
                    {i < t.nodes.length - 1 && (
                      <span
                        aria-hidden
                        className="grid shrink-0 place-items-center self-center text-muted sm:rotate-90 rtl:rotate-180 rtl:sm:rotate-90"
                      >
                        <IconArrowR size={18} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — Mobile (PhoneFrame) + Marketplace */}
        <div className="flex flex-col gap-6">
          <Reveal y={26} delay={0.05}>
            <PhoneFrame>
              <div className="flex flex-col gap-3 p-4 pt-9">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-surface gilt-rim text-xs font-semibold text-gold">
                    CF
                  </span>
                  <div>
                    <div className="text-xs font-medium text-ink">{t.mobileTitle}</div>
                    <div className="text-[10px] text-muted">{t.mobileLabel}</div>
                  </div>
                </div>

                {/* a "downloaded lesson" card */}
                <div className="rounded-[8px] bg-surface-2 p-3 [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.04)]">
                  <div className="relative aspect-video overflow-hidden rounded-[6px] bg-bg-deep">
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(120% 100% at 50% 0%, oklch(0.24 0.003 60), oklch(0.11 0 0) 70%)",
                      }}
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-bg-deep/70 px-1.5 py-0.5 text-[9px] text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                      ↓ {locale === "he" ? "אופליין" : "Offline"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-medium text-ink">{content[locale].c3.nowPlaying}</div>
                  <ProgressBar value={42} className="mt-2" />
                </div>

                <div className="flex flex-col gap-1.5">
                  {t.mobileFeatures.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 rounded-[6px] bg-surface px-3 py-2 text-[11px] text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </PhoneFrame>
          </Reveal>

          {/* Marketplace */}
          <Reveal y={24} delay={0.1}>
            <div className="rounded-[8px] bg-surface p-6 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.35),inset_0_1px_0_oklch(1_0_0_/_0.03)]">
              <div className="text-sm font-medium text-ink">{t.marketplaceLabel}</div>
              <p className="mt-1.5 text-sm text-ink-soft">{t.marketplaceText}</p>
              <div className="mt-4 flex -space-x-2 rtl:space-x-reverse">
                {["AI", "UX", "BIZ", "DEV", "+9"].map((x) => (
                  <span
                    key={x}
                    className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-[10px] font-semibold text-ink-soft ring-2 ring-bg-deep"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export default C10Platform;
