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
    "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.04)]",
  // gilt pill — the precious label
  gold: "text-gold bg-[oklch(0.83_0.13_88_/_0.06)] [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]",
  aurora:
    "text-ink bg-[oklch(0.62_0.215_294_/_0.1)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.45)]",
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
