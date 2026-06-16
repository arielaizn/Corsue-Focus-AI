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
      <div className={cn("flex flex-wrap items-center gap-2.5", align === "center" && "justify-center")}>
        {gilt ? (
          <span className="text-gilt">{section.tag}</span>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {section.tag}
          </span>
        )}
        {showRef && (
          <span className="text-xs font-medium text-muted">{section.ref}</span>
        )}
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-balance text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.03em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold [.font-he_&]:tracking-normal">
        {section.title}
      </h2>

      <p
        className={cn(
          "max-w-[58ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft",
          align === "center" && "mx-auto",
        )}
      >
        {section.body}
      </p>

      <ul
        className={cn(
          "mt-1 flex flex-col gap-3",
          align === "center" && "items-center",
        )}
      >
        {section.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-[0.95rem] text-ink-soft">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[oklch(0.83_0.13_88_/_0.13)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.34)]">
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
