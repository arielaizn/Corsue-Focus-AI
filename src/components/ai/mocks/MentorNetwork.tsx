import type { AIContent } from "@/content/ai";
import { IconMentor } from "../icons";

/**
 * Mentor Network (#49) mock — a roster of distinct named AI mentors, each with
 * an avatar initial, a role, and a specialty. A horizontal roster, not a
 * uniform feature grid.
 */
export function MentorNetwork({ data }: { data: AIContent["mentors"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {data.roster.map((m) => {
        return (
          <div
            key={m.name}
            className="panel-couture flex flex-col gap-4 p-6"
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-full bg-surface-2 font-[family-name:var(--font-display)] text-lg font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4),inset_0_1px_0_oklch(1_0_0_/_0.05)] [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold"
                aria-hidden
              >
                {m.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                <p className="truncate text-xs font-medium text-gold">{m.role}</p>
              </div>
            </div>
            <span aria-hidden className="gilt-rule opacity-25" />
            <p className="flex items-start gap-2 text-sm text-ink-soft">
              <IconMentor width={15} height={15} className="mt-0.5 shrink-0 text-muted" />
              {m.specialty}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default MentorNetwork;
