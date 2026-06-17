import { Reveal, SectionHeading } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import { BadgeGlyph, PinpointIcon, ClockIcon } from "./icons";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["profile"];

export function ProfileSection({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-32 sm:py-44">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading title={t.title} subtitle={t.subtitle} />
          <span aria-hidden className="gilt-rule mt-10 max-w-[8rem] opacity-60" />
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {t.badges.map((g) => (
              <li
                key={g}
                className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(0.76_0.105_80_/_0.1)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.32)]"
                aria-hidden
              >
                <BadgeGlyph glyph={g} size={18} />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* the profile card */}
        <Reveal y={28}>
          <div className="frame relative mx-auto w-full max-w-[440px] overflow-hidden bg-surface">
            {/* cover — flat charcoal with a single fine gilt band, no aurora */}
            <div
              className="h-24 w-full bg-surface-2 grain"
              aria-hidden
            />
            <span aria-hidden className="gilt-rule opacity-50" />
            <div className="px-6 pb-6">
              <div className="-mt-9 flex items-end justify-between gap-3">
                <Avatar initials={t.initials} size={72} ring />
                <div className="flex gap-2">
                  <span className="rounded-md bg-ink px-3.5 py-1.5 text-xs font-semibold text-bg-deep">
                    {t.followLabel}
                  </span>
                  <span className="rounded-md px-3.5 py-1.5 text-xs font-semibold text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {t.messageLabel}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h3 className="text-lg font-semibold text-ink">{t.name}</h3>
                  <span className="text-sm text-muted">{t.handle}</span>
                </div>
                <p className="text-sm font-medium text-gold">{t.role}</p>
              </div>

              <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-soft">{t.bio}</p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <PinpointIcon size={13} />
                  {t.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon size={13} />
                  {t.joined}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-3">
                {t.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg bg-bg-deep/60 p-3 text-center [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                  >
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-base font-bold tabular-nums text-ink">{s.value}</dd>
                    <p className="mt-0.5 text-[11px] text-muted">{s.label}</p>
                  </div>
                ))}
              </dl>

              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  {t.topBadgesLabel}
                </p>
                <div className="mt-2 flex gap-2">
                  {t.badges.map((g) => (
                    <span
                      key={g}
                      className="grid h-10 w-10 place-items-center rounded-lg bg-[oklch(0.76_0.105_80_/_0.1)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]"
                      aria-hidden
                    >
                      <BadgeGlyph glyph={g} size={20} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ProfileSection;
