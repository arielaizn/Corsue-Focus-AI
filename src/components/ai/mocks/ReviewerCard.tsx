import type { AIContent } from "@/content/ai";
import { IconCheck, IconReview, IconSpark } from "../icons";

/**
 * AI Assignment Reviewer mock — a graded submission card with a large score,
 * a rubric breakdown (label + verdict, color is never the only signal), and
 * an AI feedback paragraph. Reads like a real grading panel.
 */
export function ReviewerCard({ data }: { data: AIContent["reviewer"] }) {
  return (
    <div className="panel-premium overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-bg-deep/60 px-5 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[oklch(0.6_0.18_262_/_0.18)] text-ink-soft">
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
              <span className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-none tracking-[-0.02em] text-gold [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
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
              className="flex items-center gap-3 rounded-xl bg-bg-deep/50 px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <span
                className={
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md " +
                  (r.ok
                    ? "bg-[oklch(0.72_0.15_150_/_0.16)] text-[oklch(0.78_0.16_150)]"
                    : "bg-[oklch(0.78_0.13_70_/_0.16)] text-gold")
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
        <div className="mt-5 rounded-xl bg-[oklch(0.6_0.18_262_/_0.1)] p-4 [box-shadow:inset_0_0_0_1px_oklch(0.6_0.18_262_/_0.3)]">
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
