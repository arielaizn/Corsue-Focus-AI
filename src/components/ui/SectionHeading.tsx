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
        <span className="text-sm font-semibold text-gold">{kicker}</span>
      )}
      <Tag className="font-[family-name:var(--font-display)] text-balance text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl [.font-he_&]:font-[family-name:var(--font-he)]">
        {title}
      </Tag>
      {subtitle && (
        <p
          className={cn(
            "max-w-[60ch] text-pretty text-base text-ink-soft sm:text-lg",
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
