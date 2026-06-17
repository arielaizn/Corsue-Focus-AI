import { Reveal, Button, Counter } from "@/components/ui";
import { Constellation } from "@/components/shared";
import type { content } from "@/content/community";
import type { Locale } from "@/lib/i18n";
import { Avatar } from "./Avatar";
import { HeartIcon, CommentIcon, FlameIcon } from "./icons";

type T = (typeof content)[Locale]["hero"];

const cluster = ["מל", "דכ", "תב", "יא", "נ", "ML", "DC"];

export function CommunityHero({ t, locale }: { t: T; locale: Locale }) {
  return (
    <section className="relative overflow-hidden">
      {/* a single fine static gold hairline motif — no glow, no wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center opacity-30">
        <Constellation className="max-w-[280px]" />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-32 sm:pt-44 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="text-gilt">{t.tag}</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-6 max-w-[15ch] text-balance text-[length:var(--text-display)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
                {t.title}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-[60ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
                {t.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href={`/${locale}/pricing`} size="lg" magnetic>
                  {t.ctaPrimary}
                </Button>
                <Button href={`/${locale}/features`} size="lg" variant="secondary">
                  {t.ctaSecondary}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <span aria-hidden className="gilt-rule mt-14 max-w-md opacity-50" />
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-6">
                {t.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-[family-name:var(--font-display)] text-3xl font-medium text-ink sm:text-4xl [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                      <Counter
                        to={s.value}
                        prefix={s.prefix}
                        suffix={s.suffix}
                        decimals={s.value % 1 !== 0 ? 1 : 0}
                      />
                    </dd>
                    <p className="mt-1.5 text-xs leading-snug text-muted">{s.label}</p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* living community visual — orbiting member avatars + activity tickers */}
          <Reveal y={30} className="relative hidden lg:block">
            <CommunityOrb />
          </Reveal>

          {/* condensed branded fallback below lg — keeps a signature moment on mobile/tablet */}
          <Reveal y={24} className="relative lg:hidden">
            <CommunityCluster />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Condensed hero visual for mobile/tablet — a flat gallery-framed panel: a
   gilt-rimmed wordmark medallion, an avatar cluster, and one quiet activity
   chip. No glow, no blur, no aurora. Reuses Avatar at smaller scale. */
function CommunityCluster() {
  return (
    <div className="panel-couture grain relative mx-auto mt-12 flex max-w-md flex-col items-center gap-6 p-8">
      {/* wordmark medallion — flat surface, thin gilt rim */}
      <div className="grid h-20 w-20 place-items-center rounded-full bg-surface-2 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
        <span className="text-center text-[11px] font-medium leading-tight text-ink">
          CourseFocus
          <br />
          Community
        </span>
      </div>
      {/* avatar cluster */}
      <div className="relative flex -space-x-2 rtl:space-x-reverse">
        {cluster.slice(0, 5).map((init, i) => (
          <Avatar key={i} initials={init} size={i === 2 ? 44 : 36} ring={i === 2} />
        ))}
      </div>
      {/* one activity chip */}
      <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-xs font-medium text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <FlameIcon size={14} className="text-gold" />
        28
      </div>
    </div>
  );
}

function CommunityOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* concentric rings — thin neutral hairlines, innermost a faint gilt */}
      {[42, 30, 18].map((r, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${r * 2}%`,
            height: `${r * 2}%`,
            transform: "translate(-50%, -50%)",
            boxShadow:
              i === 2
                ? "inset 0 0 0 1px oklch(0.76 0.105 80 / 0.3)"
                : "inset 0 0 0 1px var(--color-line)",
          }}
        />
      ))}

      {/* center — flat surface medallion with a thin gilt rim, no glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-surface-2 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
          <span className="text-center text-xs font-medium leading-tight text-ink">
            CourseFocus
            <br />
            Community
          </span>
        </div>
      </div>

      {/* member avatars on the outer ring */}
      {cluster.map((init, i) => {
        const angle = (360 / cluster.length) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const radius = 42;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Avatar initials={init} size={i % 3 === 0 ? 48 : 38} ring={i % 3 === 0} />
          </div>
        );
      })}

      {/* floating activity chips — flat panels, neutral hairline, no blur/glow */}
      <div className="absolute left-[6%] top-[28%] -translate-y-1/2 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon size={14} className="text-gold" />
          248
        </span>
      </div>
      <div className="absolute right-[4%] top-[62%] rounded-lg bg-surface px-3 py-2 text-xs font-medium text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="inline-flex items-center gap-1.5">
          <CommentIcon size={14} className="text-ink-soft" />
          37
        </span>
      </div>
      <div className="absolute bottom-[8%] left-[24%] rounded-lg bg-surface px-3 py-2 text-xs font-medium text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="inline-flex items-center gap-1.5">
          <FlameIcon size={14} className="text-gold" />
          28
        </span>
      </div>
    </div>
  );
}

export default CommunityHero;
