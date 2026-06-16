import { Reveal, SectionHeading } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import { BadgeGlyph, PinpointIcon, ClockIcon } from "./icons";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["profile"];

export function ProfileSection({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading title={t.title} subtitle={t.subtitle} />
          <span aria-hidden className="gilt-rule mt-8 max-w-[8rem] opacity-50" />
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {t.badges.map((g) => (
              <li
                key={g}
                className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(0.83_0.13_88_/_0.1)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.32),inset_0_1px_0_oklch(1_0_0_/_0.08)]"
                aria-hidden
              >
                <BadgeGlyph glyph={g} size={18} />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* the profile card */}
        <Reveal y={28}>
          <div className="glow-aurora relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[16px] bg-surface [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.06),0_36px_100px_-44px_oklch(0.6_0.2_290_/_0.5)]">
            {/* cover */}
            <div
              className="h-24 w-full"
              style={{
                background:
                  "radial-gradient(120% 140% at 18% 0%, oklch(0.62 0.23 330 / 0.5), transparent 60%), radial-gradient(120% 140% at 60% 10%, oklch(0.62 0.215 294 / 0.5), transparent 58%), radial-gradient(120% 140% at 95% 30%, oklch(0.6 0.18 262 / 0.5), transparent 55%), oklch(0.2 0.05 265)",
              }}
              aria-hidden
            />
            <span aria-hidden className="gilt-rule opacity-50" />
            <div className="px-6 pb-6">
              <div className="-mt-9 flex items-end justify-between gap-3">
                <Avatar initials={t.initials} size={72} ring />
                <div className="flex gap-2">
                  <span className="bg-aurora rounded-lg px-3.5 py-1.5 text-xs font-semibold text-ink [box-shadow:inset_0_0_0_1px_oklch(0.9_0.1_92_/_0.38),inset_0_1px_0_oklch(1_0_0_/_0.12)]">
                    {t.followLabel}
                  </span>
                  <span className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
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
                    className="rounded-xl bg-bg-deep/60 p-3 text-center [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.55),inset_0_1px_0_oklch(1_0_0_/_0.04)]"
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
                      className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.83_0.13_88_/_0.1)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3),inset_0_1px_0_oklch(1_0_0_/_0.08)]"
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
