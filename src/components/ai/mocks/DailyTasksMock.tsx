import type { AIContent } from "@/content/ai";
import { IconCheck, IconTasks, IconTutor } from "../icons";

/**
 * Daily AI Tasks mock — two parallel agendas (owner + student) the AI prepares
 * each morning. A two-pane layout, distinct from the page's other mocks.
 */
export function DailyTasksMock({ data }: { data: AIContent["dailyTasks"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Agenda
        title={data.forOwner}
        tasks={data.ownerTasks}
        icon={<IconTasks width={15} height={15} />}
      />
      <Agenda
        title={data.forStudent}
        tasks={data.studentTasks}
        icon={<IconTutor width={15} height={15} />}
        tone="gold"
      />
    </div>
  );
}

function Agenda({
  title,
  tasks,
  icon,
  tone = "aurora",
}: {
  title: string;
  tasks: string[];
  icon: React.ReactNode;
  tone?: "aurora" | "gold";
}) {
  return (
    <div className="rounded-2xl bg-surface/40 p-5 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className={
            "grid h-8 w-8 place-items-center rounded-lg " +
            (tone === "gold"
              ? "bg-[oklch(0.82_0.135_84_/_0.14)] text-gold"
              : "bg-[oklch(0.62_0.2_264_/_0.18)] text-ink-soft")
          }
        >
          {icon}
        </span>
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {tasks.map((task) => (
          <li
            key={task}
            className="flex items-start gap-2.5 rounded-xl bg-bg-deep/50 px-3 py-2.5 text-sm text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line text-transparent">
              <IconCheck width={11} height={11} />
            </span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailyTasksMock;
