import type { AIContent } from "@/content/ai";
import { IconMentor } from "../icons";

/**
 * Mentor Network (#49) mock — a roster of distinct named AI mentors, each with
 * an avatar initial, a role, and a specialty. A horizontal roster, not a
 * uniform feature grid.
 */
export function MentorNetwork({ data }: { data: AIContent["mentors"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {data.roster.map((m, i) => {
        // hue sweep across the aurora arc: blue → violet → magenta
        const hue = 262 + i * 34;
        return (
          <div
            key={m.name}
            className="panel-premium flex flex-col gap-3.5 p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-full font-[family-name:var(--font-display)] text-lg font-bold text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold"
                style={{
                  backgroundColor: `oklch(0.62 0.2 ${hue} / 0.22)`,
                  boxShadow: `inset 0 0 0 1px oklch(0.62 0.2 ${hue} / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.08)`,
                }}
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
