import type { AIContent } from "@/content/ai";
import { IconSpark, IconStudio } from "../icons";

/**
 * AI Content Studio mock — a single request that fans out into multiple ready
 * marketing outputs (post / email / description). Output cards stack as a small
 * varied set, not a uniform grid.
 */
export function ContentStudioMock({
  data,
}: {
  data: AIContent["contentStudio"];
}) {
  return (
    <div className="panel-couture p-5 sm:p-6">
      {/* request */}
      <div className="flex items-center gap-2.5 rounded-lg bg-bg-deep/60 px-3.5 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface-2 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
          <IconStudio width={14} height={14} />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm text-ink">{data.request}</p>
      </div>

      {/* fan-out outputs */}
      <div className="mt-4 flex flex-col gap-2.5">
        {data.outputs.map((o, i) => (
          <div
            key={o.kind}
            className="rounded-lg bg-bg-deep/40 p-3.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            style={{ marginInlineStart: `${i * 14}px` }}
          >
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-gold">
              <IconSpark width={11} height={11} />
              {o.kind}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{o.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentStudioMock;
