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
            "text-gilt inline-flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden className="h-px w-7 bg-gold-grad opacity-80" />
          {kicker}
        </span>
      )}
      <Tag className="text-balance text-[length:var(--text-h2)] font-medium leading-[1.1] text-ink [.font-he_&]:font-bold">
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
