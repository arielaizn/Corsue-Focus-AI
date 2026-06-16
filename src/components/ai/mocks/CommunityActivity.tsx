import type { AIContent } from "@/content/ai";
import { IconCommunity, IconSpark } from "../icons";

/**
 * AI Community Manager mock — a live "AI activity" log of moderation/answers.
 * Each row is an action + detail, framed as the AI working the community feed.
 */
export function CommunityActivity({ data }: { data: AIContent["community"] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface/40 [box-shadow:inset_0_0_0_1px_var(--color-line),0_24px_70px_-36px_oklch(0.6_0.25_300_/_0.5)]">
      <div className="flex items-center gap-3 border-b border-line bg-bg-deep/60 px-5 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-aurora text-ink">
          <IconCommunity width={16} height={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{data.tag}</p>
          <p className="truncate text-xs text-muted">CourseFocus AI</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.72_0.15_150_/_0.14)] px-2.5 py-1 text-[11px] font-medium text-[oklch(0.8_0.16_150)] [box-shadow:inset_0_0_0_1px_oklch(0.72_0.15_150_/_0.3)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.8_0.16_150)]" />
          Active
        </span>
      </div>

      <ul className="flex flex-col">
        {data.feed.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-3 border-b border-line/60 px-5 py-3.5 last:border-b-0"
          >
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[oklch(0.82_0.135_84_/_0.12)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.25)]">
              <IconSpark width={13} height={13} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{f.action}</p>
              <p className="text-xs text-muted">{f.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommunityActivity;
