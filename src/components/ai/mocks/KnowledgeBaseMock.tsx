import type { AIContent } from "@/content/ai";
import { IconCheck, IconDoc, IconUpload } from "../icons";

const STATUS_STYLE = (status: string) => {
  const s = status.trim();
  // "Learned"/"נלמד" → done; "Processing"/"מעבד" → working; else queued
  if (/נלמד|learned/i.test(s))
    return {
      cls: "text-[oklch(0.8_0.16_150)] bg-[oklch(0.72_0.15_150_/_0.14)] [box-shadow:inset_0_0_0_1px_oklch(0.72_0.15_150_/_0.3)]",
      dot: false,
      done: true,
    };
  if (/מעבד|process/i.test(s))
    return {
      cls: "text-gold bg-[oklch(0.82_0.135_84_/_0.14)] [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.3)]",
      dot: true,
      done: false,
    };
  return {
    cls: "text-muted bg-bg-deep/60 [box-shadow:inset_0_0_0_1px_var(--color-line)]",
    dot: false,
    done: false,
  };
};

/**
 * Knowledge Base (#47) mock — an upload dropzone, a list of source files with
 * learned/processing status, and a panel of what the AI has learned from them.
 */
export function KnowledgeBaseMock({
  data,
}: {
  data: AIContent["knowledge"];
}) {
  return (
    <div className="rounded-2xl bg-surface/30 p-5 [box-shadow:inset_0_0_0_1px_var(--color-line)] sm:p-6">
      {/* dropzone */}
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-bg-deep/40 px-4 py-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[oklch(0.62_0.2_264_/_0.18)] text-ink-soft">
          <IconUpload width={17} height={17} />
        </span>
        <p className="text-sm text-ink-soft">PDF · Word · PowerPoint · Site</p>
      </div>

      {/* sources */}
      <ul className="mt-4 flex flex-col gap-2">
        {data.sources.map((src) => {
          const st = STATUS_STYLE(src.status);
          return (
            <li
              key={src.name}
              className="flex items-center gap-3 rounded-xl bg-bg-deep/50 px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface/60 text-muted">
                <IconDoc width={14} height={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{src.name}</p>
                <p className="text-[11px] text-muted">{src.type}</p>
              </div>
              <span
                className={
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium " +
                  st.cls
                }
              >
                {st.done && <IconCheck width={11} height={11} />}
                {st.dot && (
                  <span className="h-1.5 w-1.5 animate-[float_1.4s_ease-in-out_infinite] rounded-full bg-gold" />
                )}
                {src.status}
              </span>
            </li>
          );
        })}
      </ul>

      {/* learned */}
      <div className="mt-4 rounded-xl bg-[oklch(0.82_0.135_84_/_0.08)] p-4 [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.25)]">
        <p className="mb-2.5 text-xs font-medium text-gold">{data.learnedLabel}</p>
        <ul className="flex flex-col gap-2">
          {data.learned.map((l) => (
            <li key={l} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded text-gold">
                <IconCheck width={12} height={12} />
              </span>
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default KnowledgeBaseMock;
