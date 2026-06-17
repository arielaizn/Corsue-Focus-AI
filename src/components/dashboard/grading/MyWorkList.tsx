import type { Locale } from "@/lib/i18n";
import type { GradingSubmission } from "@/lib/data/grading";
import { gradingDict } from "./dict";
import { Pill } from "@/components/dashboard/ui";

/* ---------------------------------------------------------------------------
   Student-facing, read-only view of one's OWN submissions and grades. No
   grader language (no "review queue", no "pending to grade", no grade form) —
   just "awaiting grade" vs the score + feedback once it lands. RLS already
   scopes the rows to the signed-in student, so this simply re-frames them.
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

export function MyWorkList({
  locale,
  submissions,
}: {
  locale: Locale;
  submissions: GradingSubmission[];
}) {
  const t = gradingDict[locale];

  return (
    <ul className="flex flex-col gap-3">
      {submissions.map((s) => {
        const isGraded = s.graded_at != null;
        return (
          <li
            key={s.id}
            className="panel-premium flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-ink">
                {s.assignmentTitle}
              </h3>
              <p className="text-xs text-muted">
                {t.index.submittedAt} {fmtDate(locale, s.submitted_at)}
                {isGraded && (
                  <>
                    <span aria-hidden className="mx-2 text-line">
                      ·
                    </span>
                    {t.index.graded} {fmtDate(locale, s.graded_at)}
                  </>
                )}
              </p>
              {isGraded && s.feedback && (
                <p className="mt-1 line-clamp-3 max-w-2xl text-xs text-ink-soft">
                  <span className="text-muted">{t.mine.feedbackLabel}: </span>
                  {s.feedback}
                </p>
              )}
            </div>
            <div className="text-end">
              {isGraded ? (
                <>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-ink">
                    {s.score ?? "—"}
                  </span>
                  <span className="text-sm text-muted">
                    {" "}
                    {t.index.outOf} {s.assignmentMaxScore}
                  </span>
                </>
              ) : (
                <Pill tone="neutral">{t.mine.awaitingGrade}</Pill>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
