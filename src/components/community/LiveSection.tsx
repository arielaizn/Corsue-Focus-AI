import { Reveal, SectionHeading } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import { LiveDot, BellIcon, VideoIcon, UsersIcon, CalendarIcon } from "./icons";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["live"];
type Cls = T["classes"][number];

const platformMark: Record<Cls["platform"], { label: string; cls: string }> = {
  Zoom: { label: "Zoom", cls: "text-muted" },
  "Google Meet": { label: "Meet", cls: "text-muted" },
  Teams: { label: "Teams", cls: "text-muted" },
};

function ClassRow({ c, t }: { c: Cls; t: T }) {
  const live = c.status === "live";
  const pm = platformMark[c.platform];
  return (
    <div
      className={`flex flex-col gap-4 rounded-[8px] p-4 sm:flex-row sm:items-center sm:p-5 ${
        live
          ? "bg-surface [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]"
          : "panel-couture"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
              <LiveDot />
              {c.statusLabel}
            </span>
          ) : (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
              {c.statusLabel}
            </span>
          )}
          <span className={`text-[11px] font-semibold ${pm.cls}`}>{pm.label}</span>
        </div>
        <h3 className="mt-2 text-pretty font-semibold text-ink">{c.title}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Avatar initials={c.host.slice(0, 2)} size={20} />
            {c.host}
          </span>
          <span>{c.time}</span>
          <span className="inline-flex items-center gap-1">
            <UsersIcon size={13} />
            {c.attendees} {t.attendeesLabel}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        {live ? (
          <span className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-bg-deep">
            <VideoIcon size={16} />
            {t.joinLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
            <BellIcon size={15} />
            {t.remindLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function CalendarMock({ cal }: { cal: T["calendar"] }) {
  // June 2026 starts on a Monday; pad the leading blanks. 30 days.
  const lead = 1;
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: 30 }, (_, i) => i + 1),
  ];
  const eventByDay = new Map(cal.events.map((e) => [e.day, e]));

  return (
    <div className="panel-couture p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-base font-semibold text-ink">
          <CalendarIcon size={18} className="text-gold" />
          {cal.monthLabel}
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center" dir="ltr">
        {cal.weekdays.map((d, i) => (
          <span key={i} className="pb-1 text-[11px] font-medium text-muted">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`b${i}`} />;
          const ev = eventByDay.get(day);
          const isToday = day === 16;
          return (
            <div
              key={day}
              className={`relative aspect-square rounded-md p-1 text-xs ${
                isToday
                  ? "bg-[oklch(0.76_0.105_80_/_0.12)] text-ink [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]"
                  : ev
                    ? "text-ink-soft"
                    : "text-muted"
              }`}
            >
              <span className="tabular-nums">{day}</span>
              {ev && (
                <span
                  className={`absolute inset-x-1 bottom-1 truncate rounded px-1 py-px text-[9px] font-semibold leading-tight ${
                    ev.tone === "gold"
                      ? "bg-[oklch(0.76_0.105_80_/_0.16)] text-gold"
                      : "bg-surface-3 text-ink-soft"
                  }`}
                >
                  {ev.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-line/70 pt-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-soft" />
          {cal.legend.aurora}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gold" />
          {cal.legend.gold}
        </span>
      </div>
    </div>
  );
}

export function LiveSection({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-32 sm:py-44">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
        <span aria-hidden className="gilt-rule mt-10 max-w-[8rem] opacity-60" />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-8">
        <Reveal y={24} className="space-y-3.5">
          {t.classes.map((c) => (
            <ClassRow key={c.title} c={c} t={t} />
          ))}
        </Reveal>
        <Reveal y={24} delay={0.06}>
          <CalendarMock cal={t.calendar} />
        </Reveal>
      </div>
    </section>
  );
}

export default LiveSection;
