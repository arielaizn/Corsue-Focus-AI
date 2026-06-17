import type { Locale } from "@/lib/i18n";
import type { GradingSubmission } from "@/lib/data/grading";
import { gradingDict } from "./dict";
import { Pill } from "@/components/dashboard/ui";
import { GradeForm } from "./GradeForm";

/* ---------------------------------------------------------------------------
   One pending submission: student + assignment header, the submitted body /
   attachments, and (for graders) the inline grade form. Server-safe shell;
   the interactive grade form is a client island.
--------------------------------------------------------------------------- */

function fmtDate(locale: Locale, iso: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function SubmissionCard({
  locale,
  academyId,
  submission,
  canWrite,
  aiConfigured,
}: {
  locale: Locale;
  academyId: string;
  submission: GradingSubmission;
  canWrite: boolean;
  aiConfigured: boolean;
}) {
  const t = gradingDict[locale];
  const s = submission;

  const attachments = [
    s.file_url
      ? { href: s.file_url, label: t.index.viewFile }
      : null,
    s.video_url
      ? { href: s.video_url, label: t.index.viewVideo }
      : null,
    s.submission_type === "url" && s.body && /^https?:\/\//.test(s.body)
      ? { href: s.body, label: t.index.openUrl }
      : null,
  ].filter((a): a is { href: string; label: string } => a !== null);

  const showBody =
    !!s.body && !(s.submission_type === "url" && /^https?:\/\//.test(s.body));

  return (
    <article className="panel-premium flex flex-col gap-5 p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-ink">
              {s.assignmentTitle}
            </h3>
            <Pill tone="neutral">{t.submissionType[s.submission_type]}</Pill>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            <span className="text-muted">{t.index.student}:</span> {s.studentName}
            <span aria-hidden className="mx-2 text-line">
              ·
            </span>
            <span className="text-muted">{t.index.submittedAt}:</span>{" "}
            {fmtDate(locale, s.submitted_at)}
          </p>
        </div>
        <Pill tone="gold">{t.index.pending}</Pill>
      </header>

      <div className="rounded-xl bg-surface-2/40 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        {showBody ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-soft">
            {s.body}
          </p>
        ) : (
          <p className="text-sm text-muted">{t.index.noBody}</p>
        )}

        {attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((a) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-3/50 px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
              >
                {a.label}
                <span aria-hidden className="rtl:rotate-180">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {canWrite && (
        <div className="border-t border-line/50 pt-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.form.heading}
          </h4>
          <GradeForm
            locale={locale}
            academyId={academyId}
            submissionId={s.id}
            maxScore={s.assignmentMaxScore}
            aiConfigured={aiConfigured}
          />
        </div>
      )}
    </article>
  );
}
