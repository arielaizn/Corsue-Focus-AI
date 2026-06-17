import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface BrowserFrameProps {
  children: ReactNode;
  url?: string;
  className?: string;
}

/** Dark window chrome with a fake URL bar. Wraps real mock UI. */
export function BrowserFrame({
  children,
  url = "app.coursefocus.ai",
  className,
}: BrowserFrameProps) {
  return (
    <div
      dir="ltr"
      className={cn(
        "overflow-hidden rounded-[8px] bg-bg-deep [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.05),0_8px_24px_-16px_oklch(0_0_0_/_0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full [box-shadow:inset_0_0_0_1px_var(--color-line)]" />
          <span className="h-2.5 w-2.5 rounded-full [box-shadow:inset_0_0_0_1px_var(--color-line)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.76_0.105_80_/_0.7)]" />
        </div>
        <div className="mx-auto flex max-w-[60%] flex-1 items-center justify-center gap-2 rounded-md bg-bg px-3 py-1.5 text-xs text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 10V8a6 6 0 1 1 12 0v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              x="4"
              y="10"
              width="16"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="bg-bg">{children}</div>
    </div>
  );
}

export default BrowserFrame;
