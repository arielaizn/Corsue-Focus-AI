import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ChatTurn } from "@/content/ai";
import { IconSpark } from "./icons";

export interface ChatPanelProps {
  title: string;
  subtitle?: string;
  turns: ChatTurn[];
  /** small node rendered in the header trailing slot (e.g. a status dot/model) */
  headerRight?: ReactNode;
  /** composer placeholder; pass empty string to hide the composer */
  placeholder?: string;
  quickActions?: string[];
  className?: string;
}

/**
 * Credible dark AI-chat surface. Used across the AI page sections. Static mock,
 * no client JS required — visuals only. Bubbles use logical properties so the
 * conversation aligns correctly in both RTL and LTR.
 */
export function ChatPanel({
  title,
  subtitle,
  turns,
  headerRight,
  placeholder,
  quickActions,
  className,
}: ChatPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-surface/40 [box-shadow:inset_0_0_0_1px_var(--color-line),0_24px_70px_-34px_oklch(0.6_0.25_300_/_0.5)]",
        className,
      )}
    >
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line bg-bg-deep/60 px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-aurora text-ink [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.5)]">
          <IconSpark width={16} height={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted">{subtitle}</p>
          )}
        </div>
        {headerRight}
      </div>

      {/* conversation */}
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-5">
        {turns.map((turn, i) =>
          turn.from === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[82%] rounded-2xl rounded-ee-md bg-surface-2 px-3.5 py-2.5 text-sm text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                {turn.text}
              </p>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div className="max-w-[88%]">
                {turn.note && (
                  <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-bg-deep/70 px-2 py-0.5 text-[11px] font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.3)]">
                    <IconSpark width={11} height={11} />
                    {turn.note}
                  </span>
                )}
                <p className="rounded-2xl rounded-ss-md bg-[oklch(0.62_0.2_264_/_0.14)] px-3.5 py-2.5 text-sm text-ink-soft [box-shadow:inset_0_0_0_1px_oklch(0.62_0.2_264_/_0.35)]">
                  {turn.text}
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      {/* quick actions */}
      {quickActions && quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-1 sm:px-5">
          {quickActions.map((a) => (
            <span
              key={a}
              className="rounded-full bg-bg-deep/60 px-3 py-1 text-xs text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {/* composer */}
      {placeholder !== "" && (
        <div className="mt-auto px-4 pb-4 pt-4 sm:px-5">
          <div className="flex items-center gap-2 rounded-xl bg-bg-deep/70 px-3 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
            <span className="flex-1 truncate text-sm text-muted">
              {placeholder ?? "Ask the AI…"}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-aurora text-ink">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="rtl:-scale-x-100"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPanel;
