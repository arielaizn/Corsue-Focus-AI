import { BrowserFrame } from "@/components/ui";
import type { AIContent } from "@/content/ai";
import { IconBook, IconCheck, IconSpark } from "../icons";

/**
 * Credible "prompt → generated course" mock. A prompt bar at the top,
 * then a generated module list with lesson counts — rendered inside a
 * BrowserFrame so it reads as a real product screen.
 */
export function CourseOutlineMock({
  data,
}: {
  data: AIContent["courseGen"];
}) {
  return (
    <BrowserFrame url="app.coursefocus.ai/build">
      <div className="p-5 sm:p-6">
        {/* prompt row */}
        <div className="flex items-center gap-2.5 rounded-lg bg-surface/50 px-3.5 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface-2 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
            <IconSpark width={14} height={14} />
          </span>
          <p className="min-w-0 flex-1 truncate text-sm text-ink">{data.prompt}</p>
          <span className="hidden shrink-0 rounded-lg bg-gold-grad px-3 py-1.5 text-xs font-semibold text-bg-deep sm:inline-block">
            ⏎
          </span>
        </div>

        {/* generated outline */}
        <div className="text-gilt mt-6 flex items-center gap-2">
          <IconSpark width={13} height={13} />
          <span>{data.tag}</span>
        </div>

        <ol className="mt-3 flex flex-col gap-2.5">
          {data.modules.map((m, i) => (
            <li
              key={m.title}
              className="rounded-lg bg-bg-deep/50 p-3.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[4px] bg-surface-2 text-xs font-semibold text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                  {m.title}
                </p>
                <span className="shrink-0 text-xs text-muted">
                  {m.lessons.length}
                </span>
                <IconBook width={14} height={14} className="shrink-0 text-muted" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 ps-8">
                {m.lessons.map((l) => (
                  <span
                    key={l}
                    className="rounded-md bg-surface/50 px-2 py-0.5 text-[11px] text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[oklch(0.76_0.105_80_/_0.08)] px-3.5 py-2.5 text-sm text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]">
          <IconCheck width={15} height={15} />
          <span className="font-medium">{data.quizLabel}</span>
        </div>
      </div>
    </BrowserFrame>
  );
}

export default CourseOutlineMock;
