import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "gold" | "aurora";

export interface TagProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  default:
    "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]",
  // gilt pill — the precious label
  gold: "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.45)]",
  // 'aurora' kept for API compatibility — now a quiet gilt hairline, no colour
  aurora:
    "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]",
};

export function Tag({ children, tone = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Tag;
