import type { Locale } from "@/lib/i18n";
import type { QuizAttemptInsight } from "@/lib/data/grading";
import { gradingDict } from "./dict";
import { Panel, Pill } from "@/components/dashboard/ui";

/* ---------------------------------------------------------------------------
   Read-only insight: recent quiz attempts. Quizzes auto-grade, so this is
   purely informational for the instructor (no actions).
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

export function QuizAttempts({
  locale,
  attempts,
}: {
  locale: Locale;
  attempts: QuizAttemptInsight[];
}) {
  const t = gradingDict[locale].quizzes;

  return (
    <Panel title={t.heading}>
      <p className="-mt-2 mb-4 text-sm text-muted">{t.subtitle}</p>

      {attempts.length === 0 ? (
        <p className="text-sm text-muted">{t.empty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line/40">
          {attempts.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {a.quizTitle}
                </p>
                <p className="text-xs text-muted">
                  {a.studentName}
                  <span aria-hidden className="mx-2 text-line">
                    ·
                  </span>
                  {fmtDate(locale, a.submittedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-ink-soft">
                  {a.score == null ? t.pendingResult : a.score}
                  {a.maxScore != null && (
                    <span className="text-muted">/{a.maxScore}</span>
                  )}
                </span>
                {a.passed != null && (
                  <Pill tone={a.passed ? "gold" : "neutral"}>
                    {a.passed ? t.passed : t.failed}
                  </Pill>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
