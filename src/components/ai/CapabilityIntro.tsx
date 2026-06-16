import { Tag } from "@/components/ui";
import type { AISection } from "@/content/ai";
import { cn } from "@/lib/cn";
import { IconCheck } from "./icons";

export interface CapabilityIntroProps {
  section: AISection;
  /** alignment of the text column; center used only on full-width intros */
  align?: "start" | "center";
  /** show the quiet glossary reference chip */
  showRef?: boolean;
  className?: string;
}

/**
 * The narrative half of a capability section: a tone tag, a solid (never
 * gradient) display heading, body, and 2–3 capability bullets. The glossary
 * reference is rendered as a quiet trailing chip, NOT as 01/02 scaffolding.
 */
export function CapabilityIntro({
  section,
  align = "start",
  showRef = true,
  className,
}: CapabilityIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="aurora">{section.tag}</Tag>
        {showRef && (
          <span className="text-xs font-medium text-muted">{section.ref}</span>
        )}
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-balance text-2xl font-semibold text-ink sm:text-3xl lg:text-[2.5rem] lg:leading-[1.08] [.font-he_&]:font-[family-name:var(--font-he)]">
        {section.title}
      </h2>

      <p
        className={cn(
          "max-w-[54ch] text-pretty text-base text-ink-soft sm:text-lg",
          align === "center" && "mx-auto",
        )}
      >
        {section.body}
      </p>

      <ul
        className={cn(
          "mt-1 flex flex-col gap-2.5",
          align === "center" && "items-center",
        )}
      >
        {section.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[oklch(0.82_0.135_84_/_0.14)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.3)]">
              <IconCheck width={12} height={12} />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CapabilityIntro;
