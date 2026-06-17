import type { Locale } from "@/lib/i18n";
import type { GradingSubmission } from "@/lib/data/grading";
import { gradingDict } from "./dict";
import { Pill } from "@/components/dashboard/ui";
import { GradedRowEditor } from "./GradedRowEditor";

/* ---------------------------------------------------------------------------
   Recently-graded submissions — a compact read-back of finished grades with
   the score, student, assignment, and an AI-assisted marker.
--------------------------------------------------------------------------- */

function fmtDate(locale: Locale, iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function GradedList({
  locale,
  submissions,
  canWrite = false,
  academyId,
  aiConfigured = false,
}: {
  locale: Locale;
  submissions: GradingSubmission[];
  /** Graders get an inline "Edit grade" affordance to correct a score. */
  canWrite?: boolean;
  academyId?: string;
  aiConfigured?: boolean;
}) {
  const t = gradingDict[locale];

  return (
    <ul className="flex flex-col gap-3">
      {submissions.map((s) => (
        <li
          key={s.id}
          className="panel-premium flex flex-wrap items-center justify-between gap-4 p-4"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-ink">
                {s.assignmentTitle}
              </h3>
              {s.ai_review_id && (
                <Pill tone="neutral">{t.index.aiAssisted}</Pill>
              )}
            </div>
            <p className="text-xs text-muted">
              {s.studentName}
              <span aria-hidden className="mx-2 text-line">
                ·
              </span>
              {t.index.graded} {fmtDate(locale, s.graded_at)}
            </p>
            {s.feedback && (
              <p className="mt-1 line-clamp-2 max-w-2xl text-xs text-ink-soft">
                {s.feedback}
              </p>
            )}
          </div>
          <div className="text-end">
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-ink">
              {s.score ?? "—"}
            </span>
            <span className="text-sm text-muted">
              {" "}
              {t.index.outOf} {s.assignmentMaxScore}
            </span>
          </div>

          {canWrite && academyId && (
            <GradedRowEditor
              locale={locale}
              academyId={academyId}
              submission={s}
              aiConfigured={aiConfigured}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
