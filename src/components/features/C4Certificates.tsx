import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { QRMark } from "./QRMark";
import { IconCheck } from "./icons";

/** C4 — Assessments & Certificates. Quiz + AI review mock, beside a branded certificate w/ QR. */
export function C4Certificates({ locale }: { locale: Locale }) {
  const t = content[locale].c4;

  return (
    <Section tint className="py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
        <span aria-hidden className="gilt-rule mt-8 max-w-[140px] opacity-60" />
      </Reveal>

      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Quiz + AI reviewer */}
        <Reveal y={24} className="panel-couture flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-ink">{t.quizTitle}</div>
            <div className="rounded-full bg-bg-deep px-2.5 py-1 text-xs font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
              {t.scoreLabel} 96%
            </div>
          </div>

          <p className="text-base font-medium text-ink">{t.question}</p>

          <ul className="space-y-2.5">
            {t.options.map((o) => (
              <li
                key={o.text}
                className={`flex items-center justify-between rounded-[8px] px-3.5 py-3 text-sm ${
                  o.correct
                    ? "bg-surface text-ink [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.5)]"
                    : "bg-bg-deep text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                }`}
              >
                <span>{o.text}</span>
                {o.correct && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-surface text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.45)]">
                    <IconCheck size={12} />
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* AI reviewer line */}
          <div className="mt-1 rounded-[8px] bg-bg-deep/60 p-4 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.22)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-surface text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.35)]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
              {t.aiReviewLabel}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.aiReviewText}</p>
          </div>
        </Reveal>

        {/* Certificate — a printed couture diploma: bone field, gilt rules */}
        <Reveal y={24} delay={0.08} className="flex">
          <div className="frame-gilt relative flex w-full flex-col overflow-hidden p-6 sm:p-8">
            {/* gold corner rules */}
            <span aria-hidden className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-s-2 border-t-2 border-gold/60" />
            <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-e-2 border-t-2 border-gold/60" />
            <span aria-hidden className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-s-2 border-b-2 border-gold/60" />
            <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-e-2 border-b-2 border-gold/60" />

            <div className="relative flex flex-1 flex-col items-center text-center">
              <div className="text-gilt">{t.certSubtitle}</div>
              <div className="mt-4 font-[family-name:var(--font-display)] text-xl font-medium text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                {t.certTitle}
              </div>
              <span aria-hidden className="gilt-rule mt-4 max-w-[120px] opacity-60" />
              <div className="mt-5 font-[family-name:var(--font-display)] text-[1.6rem] font-medium text-gold [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                {t.certName}
              </div>
              <div className="mt-1.5 text-sm text-ink-soft">{t.certCourse}</div>

              <div className="mt-auto flex w-full items-end justify-between pt-7">
                <div className="text-start text-[11px] text-muted">
                  {t.certIssued}
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <QRMark size={56} />
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gold">
                    <IconCheck size={11} />
                    {t.certVerified}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* two supporting points */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {t.points.map((p, i) => (
          <Reveal
            key={p.title}
            delay={0.04 * i}
            className="panel-couture p-5"
          >
            <div className="text-sm font-medium text-ink">{p.title}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default C4Certificates;
