import type { AISection } from "@/content/ai";
import { cn } from "@/lib/cn";
import { IconCheck } from "./icons";

export interface CapabilityIntroProps {
  section: AISection;
  /** alignment of the text column; center used only on full-width intros */
  align?: "start" | "center";
  /** show the quiet glossary reference chip */
  showRef?: boolean;
  /** render the kicker as a precious gilt label — reserve for the few named movements */
  gilt?: boolean;
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
  showRef = false,
  gilt = false,
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
      <div className={cn("flex flex-wrap items-center gap-3", align === "center" && "justify-center")}>
        {gilt ? (
          <span className="text-gilt">{section.tag}</span>
        ) : (
          <span className="text-gilt opacity-90">{section.tag}</span>
        )}
        {showRef && (
          <span className="text-xs font-medium text-muted">{section.ref}</span>
        )}
      </div>

      <h2 className="text-balance text-[length:var(--text-h2)] font-medium leading-[1.1] tracking-[-0.005em] text-ink [.font-he_&]:font-bold [.font-he_&]:tracking-normal">
        {section.title}
      </h2>

      <span
        aria-hidden
        className={cn("gilt-rule max-w-[150px] opacity-60", align === "center" && "mx-auto")}
      />

      <p
        className={cn(
          "max-w-[58ch] text-pretty text-[length:var(--text-lead)] leading-[1.65] text-ink-soft",
          align === "center" && "mx-auto",
        )}
      >
        {section.body}
      </p>

      <ul
        className={cn(
          "mt-2 flex flex-col gap-3.5",
          align === "center" && "items-center",
        )}
      >
        {section.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink-soft">
            <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-[3px] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
              <IconCheck width={11} height={11} />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CapabilityIntro;
