import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** 'gold' adds a thin gilt rim instead of the neutral hairline. */
  tone?: "aurora" | "gold";
}

/**
 * Couture panel. The old glass + glow has been removed: this is now a flat
 * surface with a single hairline (neutral, or thin gilt when tone="gold").
 * No backdrop-blur, no colored aura. Name + props preserved for callers.
 */
export function GlowCard({ children, className, tone = "aurora" }: GlowCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[8px] bg-surface p-6",
        tone === "gold"
          ? "[box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4),inset_0_1px_0_oklch(1_0_0_/_0.04)]"
          : "[box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.03)]",
        className,
      )}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

export default GlowCard;
