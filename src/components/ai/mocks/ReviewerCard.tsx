import type { AIContent } from "@/content/ai";
import { IconCheck, IconReview, IconSpark } from "../icons";

/**
 * AI Assignment Reviewer mock — a graded submission card with a large score,
 * a rubric breakdown (label + verdict, color is never the only signal), and
 * an AI feedback paragraph. Reads like a real grading panel.
 */
export function ReviewerCard({ data }: { data: AIContent["reviewer"] }) {
  return (
    <div className="panel-couture overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-bg-deep/60 px-5 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <IconReview width={16} height={16} />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
          {data.assignment}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {/* score */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted">{data.tag}</p>
            <p className="mt-1">
              <span className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-medium leading-none tracking-[-0.01em] text-gold [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                {data.grade}
              </span>
              <span className="text-lg text-muted"> / 100</span>
            </p>
          </div>
        </div>

        {/* rubric */}
        <ul className="mt-5 flex flex-col gap-2.5">
          {data.rubric.map((r) => (
            <li
              key={r.label}
              className="flex items-center gap-3 rounded-lg bg-bg-deep/50 px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <span
                className={
                  "grid h-6 w-6 shrink-0 place-items-center rounded-[4px] " +
                  (r.ok
                    ? "bg-[oklch(0.72_0.12_150_/_0.14)] text-[oklch(0.78_0.13_150)]"
                    : "bg-[oklch(0.76_0.105_80_/_0.14)] text-gold")
                }
              >
                {r.ok ? (
                  <IconCheck width={13} height={13} />
                ) : (
                  <span className="text-xs font-bold">!</span>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">
                {r.label}
              </span>
              <span
                className={
                  "shrink-0 text-xs font-medium " +
                  (r.ok ? "text-ink-soft" : "text-gold")
                }
              >
                {r.score}
              </span>
            </li>
          ))}
        </ul>

        {/* feedback */}
        <div className="mt-5 rounded-lg bg-[oklch(0.55_0.11_250_/_0.08)] p-4 [box-shadow:inset_0_0_0_1px_oklch(0.55_0.11_250_/_0.26)]">
          <p className="text-gilt mb-2 flex items-center gap-1.5">
            <IconSpark width={12} height={12} />
            {data.tag}
          </p>
          <p className="text-sm text-ink-soft">{data.feedback}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewerCard;
