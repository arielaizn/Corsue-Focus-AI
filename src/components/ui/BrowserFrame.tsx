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
        "overflow-hidden rounded-2xl bg-bg-deep [box-shadow:inset_0_0_0_1px_var(--color-line),0_30px_80px_-30px_oklch(0.6_0.25_300_/_0.35)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-surface/40 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[oklch(0.6_0.13_25)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.13_85)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.15_150)]" />
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
