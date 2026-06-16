import { Reveal, Button, Counter, Tag } from "@/components/ui";
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
      {/* soft aurora wash behind the hero only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 50% -10%, oklch(0.6 0.25 300 / 0.18), transparent 60%), radial-gradient(50% 50% at 85% 10%, oklch(0.62 0.2 264 / 0.14), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center opacity-50">
        <Constellation className="max-w-[280px]" />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-28 sm:pt-32 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <Tag tone="gold">{t.tag}</Tag>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-5 max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl [.font-he_&]:font-[family-name:var(--font-he)]">
                {t.title}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[54ch] text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                {t.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={`/${locale}/pricing`} size="lg" magnetic>
                  {t.ctaPrimary}
                </Button>
                <Button href={`/${locale}/features`} size="lg" variant="secondary">
                  {t.ctaSecondary}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
                {t.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-[family-name:var(--font-display)] text-2xl font-semibold text-gold sm:text-3xl [.font-he_&]:font-[family-name:var(--font-he)]">
                      <Counter
                        to={s.value}
                        prefix={s.prefix}
                        suffix={s.suffix}
                        decimals={s.value % 1 !== 0 ? 1 : 0}
                      />
                    </dd>
                    <p className="mt-1 text-xs leading-snug text-muted">{s.label}</p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* living community visual — orbiting member avatars + activity tickers */}
          <Reveal y={30} className="relative hidden lg:block">
            <CommunityOrb />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CommunityOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* concentric rings */}
      {[42, 30, 18].map((r, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full border border-line/50"
          style={{
            width: `${r * 2}%`,
            height: `${r * 2}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* center pulse */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-aurora glow-aurora grid h-24 w-24 place-items-center rounded-full [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.5),0_0_70px_-8px_oklch(0.6_0.25_300_/_0.7)]">
          <span className="animate-float text-center text-xs font-semibold leading-tight text-ink">
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

      {/* floating activity chips */}
      <div className="absolute left-[6%] top-[28%] -translate-y-1/2 rounded-xl bg-surface/80 px-3 py-2 text-xs text-ink-soft backdrop-blur [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon size={14} className="text-gold" />
          248
        </span>
      </div>
      <div className="absolute right-[4%] top-[62%] rounded-xl bg-surface/80 px-3 py-2 text-xs text-ink-soft backdrop-blur [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="inline-flex items-center gap-1.5">
          <CommentIcon size={14} className="text-[oklch(0.82_0.15_300)]" />
          37
        </span>
      </div>
      <div className="absolute bottom-[8%] left-[24%] rounded-xl bg-surface/80 px-3 py-2 text-xs text-ink-soft backdrop-blur [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <span className="inline-flex items-center gap-1.5">
          <FlameIcon size={14} className="text-gold" />
          28
        </span>
      </div>
    </div>
  );
}

export default CommunityHero;
