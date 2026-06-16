import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** gold rim instead of aurora rim */
  tone?: "aurora" | "gold";
}

/**
 * The ONE sanctioned glass + glow panel. Use purposefully, not as the default
 * card treatment. Faint surface tint + backdrop blur + a single soft rim glow.
 */
export function GlowCard({ children, className, tone = "aurora" }: GlowCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 backdrop-blur-md",
        "bg-[oklch(0.21_0.05_265_/_0.55)]",
        tone === "aurora"
          ? "[box-shadow:inset_0_0_0_1px_oklch(0.62_0.2_264_/_0.35),0_18px_60px_-24px_oklch(0.6_0.25_300_/_0.5)]"
          : "[box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.35),0_18px_60px_-24px_oklch(0.82_0.135_84_/_0.4)]",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 h-48 w-48 rounded-full blur-3xl [inset-inline-end:-4rem]",
          tone === "aurora"
            ? "bg-[oklch(0.6_0.25_300_/_0.25)]"
            : "bg-[oklch(0.82_0.135_84_/_0.18)]",
        )}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default GlowCard;
