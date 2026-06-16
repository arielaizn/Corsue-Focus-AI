import type { AIContent } from "@/content/ai";
import { IconArrow } from "../icons";

/**
 * Beginner → Expert path visualization. A connected ladder of four stages with
 * a progress spine that rises stage to stage. Logical properties keep the spine
 * flowing correctly in RTL and LTR. Not a generic card grid — it's a path.
 */
export function CurriculumPath({
  data,
}: {
  data: AIContent["curriculum"];
}) {
  const levels = data.levels;
  return (
    <div className="panel-premium p-5 sm:p-7">
      <ol className="flex flex-col gap-0">
        {levels.map((lvl, i) => {
          const last = i === levels.length - 1;
          // each stage's aurora fill deepens toward "expert"
          const fill = 0.12 + (i / (levels.length - 1)) * 0.32;
          return (
            <li key={lvl.name} className="relative flex gap-4 ps-2">
              {/* spine + node */}
              <div className="relative flex flex-col items-center">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-semibold text-ink"
                  style={{
                    backgroundColor: `oklch(0.6 0.18 262 / ${fill})`,
                    boxShadow: `inset 0 0 0 1px oklch(0.6 0.18 262 / ${fill + 0.3})`,
                  }}
                >
                  {i + 1}
                </span>
                {!last && (
                  <span
                    aria-hidden
                    className="my-1 w-px flex-1 bg-gradient-to-b from-[oklch(0.6_0.18_262_/_0.6)] to-[oklch(0.62_0.215_294_/_0.3)]"
                  />
                )}
              </div>

              {/* stage card */}
              <div className={last ? "pb-0" : "pb-6"}>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h3 className="text-base font-semibold text-ink">{lvl.name}</h3>
                  <span className="rounded-full bg-bg-deep/60 px-2 py-0.5 text-[11px] font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]">
                    {lvl.tag}
                  </span>
                </div>
                <p className="mt-1 max-w-[40ch] text-sm text-ink-soft">{lvl.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
        <span>{levels[0].name}</span>
        <IconArrow width={14} height={14} className="rtl:-scale-x-100" />
        <span className="text-gold">{levels[levels.length - 1].name}</span>
      </div>
    </div>
  );
}

export default CurriculumPath;
