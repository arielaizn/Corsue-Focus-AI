import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { Avatar } from "./bits";
import { IconCalendar } from "./icons";

const TONE: Record<"live" | "task" | "drop", string> = {
  live: "bg-aurora text-ink",
  task: "bg-[oklch(0.7_0.14_70_/_0.25)] text-gold",
  drop: "bg-[oklch(0.62_0.2_264_/_0.2)] text-primary-bright",
};

/** C9 — Operations. A month calendar with tagged events, beside a live-class mock. */
export function C9Operations({ locale }: { locale: Locale }) {
  const t = content[locale].c9;

  // June 2026 starts on a Monday → leading blank for Sunday-first grid.
  const firstWeekday = 1; // 0=Sun
  const daysInMonth = 30;
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const eventByDay = new Map(t.events.map((e) => [e.day, e]));

  return (
    <Section className="py-20 sm:py-28">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Calendar */}
        <Reveal y={26}>
          <div className="rounded-2xl bg-surface/40 p-6 ring-line">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="text-gold"><IconCalendar size={16} /></span>
                {t.calendarTitle}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                {(["live", "task", "drop"] as const).map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={`h-2 w-2 rounded-full ${
                        k === "live"
                          ? "bg-[oklch(0.6_0.25_300)]"
                          : k === "task"
                            ? "bg-gold"
                            : "bg-primary-bright"
                      }`}
                    />
                    {t.events.find((e) => e.tone === k)?.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5 text-center" dir="ltr">
              {t.weekdays.map((w, i) => (
                <div key={i} className="pb-1 text-[11px] font-medium text-muted">
                  {w}
                </div>
              ))}
              {cells.map((day, i) => {
                const ev = day ? eventByDay.get(day) : undefined;
                return (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-lg text-sm ${
                      day ? "ring-line" : ""
                    } ${ev ? "bg-bg" : day ? "bg-bg/40" : ""}`}
                  >
                    {day && (
                      <span className="absolute left-1.5 top-1 text-[11px] text-ink-soft tabular-nums">
                        {day}
                      </span>
                    )}
                    {ev && (
                      <span
                        className={`absolute inset-x-1 bottom-1 truncate rounded px-1 py-0.5 text-[9px] font-medium ${TONE[ev.tone]}`}
                      >
                        {ev.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Live class */}
        <Reveal y={26} delay={0.08}>
          <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-bg-deep ring-line">
            {/* stage */}
            <div className="relative aspect-video">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(110% 90% at 25% 0%, oklch(0.6 0.25 300 / 0.28), transparent 55%), radial-gradient(110% 90% at 80% 100%, oklch(0.62 0.2 264 / 0.24), transparent 55%)",
                }}
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-[oklch(0.6_0.13_25)] px-2.5 py-1 text-xs font-semibold text-ink">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" aria-hidden />
                {t.liveStatus}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <Avatar name="Ariel" small />
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {["NA", "ID", "TL"].map((x) => (
                    <Avatar key={x} name={x} small className="ring-2 ring-bg-deep" />
                  ))}
                </div>
                <span className="text-xs text-ink-soft">{t.liveAttendees}</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="text-xs font-semibold text-gold">{t.liveLabel}</div>
              <div className="mt-1.5 text-base font-medium text-ink">{t.liveTitle}</div>

              <div className="mt-4 flex flex-wrap gap-2">
                {t.livePlatforms.map((p) => (
                  <span key={p} className="rounded-md bg-surface/60 px-2.5 py-1 text-xs text-ink-soft ring-line">
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5">
                <div className="rounded-lg bg-aurora px-4 py-2.5 text-center text-sm font-medium text-ink glow-aurora">
                  {t.liveCtaJoin}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default C9Operations;
