import type { ReactNode } from "react";
import { Reveal } from "@/components/ui";
import type { AISection } from "@/content/ai";
import { cn } from "@/lib/cn";
import { CapabilityIntro } from "./CapabilityIntro";

export interface CapabilitySplitProps {
  section: AISection;
  /** the mock/visual for this capability */
  visual: ReactNode;
  /** place the visual at the start (leading) instead of trailing */
  visualFirst?: boolean;
  /** narrow the visual column (used for chat-style panels) */
  balance?: "even" | "visual-wide" | "text-wide";
  className?: string;
}

/**
 * Alternating two-column capability section. The page flips `visualFirst` per
 * section so the rhythm never repeats one fixed side. Logical column order is
 * preserved for RTL via source order + grid. The visual reveals with a gentle
 * offset; the text reveals first.
 */
export function CapabilitySplit({
  section,
  visual,
  visualFirst = false,
  balance = "even",
  className,
}: CapabilitySplitProps) {
  const cols =
    balance === "visual-wide"
      ? "lg:grid-cols-[0.85fr_1.15fr]"
      : balance === "text-wide"
        ? "lg:grid-cols-[1.1fr_0.9fr]"
        : "lg:grid-cols-2";

  return (
    <section className={cn("mx-auto max-w-[1240px] px-5 py-16 sm:py-20", className)}>
      <div className={cn("grid items-center gap-10 lg:gap-14", cols)}>
        <Reveal className={cn(visualFirst && "lg:order-2")}>
          <CapabilityIntro section={section} />
        </Reveal>
        <Reveal y={28} delay={0.05} className={cn(visualFirst && "lg:order-1")}>
          {visual}
        </Reveal>
      </div>
    </section>
  );
}

export default CapabilitySplit;
