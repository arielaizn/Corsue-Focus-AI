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
        "relative overflow-hidden rounded-[16px] p-6 backdrop-blur-xl",
        "bg-[oklch(0.22_0.05_268_/_0.5)]",
        // single soft rim + lit edge + colored depth (no ghost-card combo)
        tone === "aurora"
          ? "[box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.32),inset_0_1px_0_oklch(1_0_0_/_0.07),0_30px_90px_-40px_oklch(0.6_0.2_290_/_0.55)]"
          : "[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.36),inset_0_1px_0_oklch(1_0_0_/_0.08),0_30px_90px_-42px_oklch(0.83_0.13_88_/_0.4)]",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 h-48 w-48 rounded-full blur-3xl [inset-inline-end:-4rem]",
          tone === "aurora"
            ? "bg-[oklch(0.62_0.23_330_/_0.22)]"
            : "bg-[oklch(0.83_0.13_88_/_0.16)]",
        )}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default GlowCard;
