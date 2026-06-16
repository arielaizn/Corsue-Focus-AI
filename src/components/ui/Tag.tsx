import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "gold" | "aurora";

export interface TagProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  default: "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]",
  gold: "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.4)]",
  aurora:
    "text-ink [box-shadow:inset_0_0_0_1px_oklch(0.62_0.2_264_/_0.5)] bg-[oklch(0.62_0.2_264_/_0.1)]",
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
