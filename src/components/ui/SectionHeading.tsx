import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  /** Optional. Do NOT put a kicker on every section (anti-eyebrow rule). */
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "start" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "start",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center mx-auto",
        className,
      )}
    >
      {kicker && (
        <span
          className={cn(
            "text-gilt inline-flex items-center gap-2",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden className="h-px w-6 bg-gold-grad opacity-70" />
          {kicker}
        </span>
      )}
      <Tag className="font-[family-name:var(--font-display)] text-balance text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
        {title}
      </Tag>
      {subtitle && (
        <p
          className={cn(
            "max-w-[62ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
