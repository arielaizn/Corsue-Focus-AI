import type { AIContent } from "@/content/ai";
import { IconExam } from "../icons";

/**
 * AI Exam Generator mock — a settings header (topic/level/count/type) and a
 * short generated question list with type chips. Static, credible exam-builder UI.
 */
export function ExamCard({ data }: { data: AIContent["exam"] }) {
  return (
    <div className="panel-couture overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-bg-deep/60 px-5 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <IconExam width={16} height={16} />
        </span>
        <p className="text-sm font-semibold text-ink">{data.settingsTitle}</p>
      </div>

      <div className="p-5 sm:p-6">
        {/* settings */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {data.settings.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-bg-deep/50 px-3 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <p className="text-[11px] text-muted">{s.label}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-ink">{s.value}</p>
            </div>
          ))}
        </div>

        {/* questions */}
        <ol className="mt-5 flex flex-col gap-2.5">
          {data.questions.map((q, i) => (
            <li
              key={q.q}
              className="flex items-start gap-3 rounded-lg bg-surface/40 px-3.5 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[4px] bg-[oklch(0.76_0.105_80_/_0.13)] text-xs font-semibold text-gold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">{q.q}</p>
                <span className="mt-1.5 inline-block rounded-full bg-bg-deep/60 px-2 py-0.5 text-[11px] text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                  {q.type}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ExamCard;
