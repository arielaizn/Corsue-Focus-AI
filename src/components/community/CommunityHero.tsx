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

      <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-28 sm:pt-36 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <Tag tone="gold">{t.tag}</Tag>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-6 max-w-[15ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-bold leading-[1.04] tracking-[-0.03em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold [.font-he_&]:tracking-normal">
                {t.title}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[58ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
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
              <span aria-hidden className="gilt-rule mt-12 max-w-md opacity-40" />
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-6">
                {t.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-[family-name:var(--font-display)] text-3xl font-bold text-gold sm:text-4xl [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
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

/* Condensed hero visual for mobile/tablet — a single branded panel with the
   aurora-core pulse, an avatar cluster, and one activity chip. Reuses Avatar +
   chip markup at smaller scale; no new APIs. */
function CommunityCluster() {
  return (
    <div className="relative mx-auto mt-12 flex max-w-md flex-col items-center gap-5 overflow-hidden rounded-[16px] bg-surface p-7 [box-shadow:inset_0_0_0_1px_oklch(0.4_0.04_268_/_0.7),inset_0_1px_0_oklch(1_0_0_/_0.05),0_28px_80px_-48px_oklch(0.08_0.03_268_/_0.9)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[oklch(0.62_0.23_330_/_0.18)] blur-3xl"
      />
      {/* aurora core */}
      <div className="bg-aurora relative grid h-20 w-20 place-items-center rounded-full [box-shadow:inset_0_0_0_1px_oklch(0.9_0.1_92_/_0.55),inset_0_1px_0_oklch(1_0_0_/_0.12),0_0_64px_-8px_oklch(0.62_0.23_330_/_0.6)]">
        <span className="animate-float text-center text-[11px] font-semibold leading-tight text-ink">
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
      <div className="relative inline-flex items-center gap-2 rounded-xl bg-surface-2/85 px-3 py-2 text-xs font-medium text-ink [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.07),0_18px_40px_-24px_oklch(0.08_0.03_268_/_0.9)]">
        <FlameIcon size={14} className="text-gold" />
        28
      </div>
    </div>
  );
}

function CommunityOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* concentric rings — gilt-tinted, innermost warms to gold */}
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
                ? "inset 0 0 0 1px oklch(0.83 0.13 88 / 0.32)"
                : "inset 0 0 0 1px oklch(0.62 0.215 294 / 0.28)",
          }}
        />
      ))}

      {/* center pulse — aurora core with gilt rim + soft colored depth */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-aurora grid h-24 w-24 place-items-center rounded-full [box-shadow:inset_0_0_0_1px_oklch(0.9_0.1_92_/_0.55),inset_0_1px_0_oklch(1_0_0_/_0.12),0_0_80px_-6px_oklch(0.62_0.23_330_/_0.6)]">
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

      {/* floating activity chips — raised panels with lit edge + soft depth */}
      <div className="absolute left-[6%] top-[28%] -translate-y-1/2 rounded-xl bg-surface-2/85 px-3 py-2 text-xs font-medium text-ink backdrop-blur [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.07),0_18px_40px_-24px_oklch(0.08_0.03_268_/_0.9)]">
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon size={14} className="text-gold" />
          248
        </span>
      </div>
      <div className="absolute right-[4%] top-[62%] rounded-xl bg-surface-2/85 px-3 py-2 text-xs font-medium text-ink backdrop-blur [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.07),0_18px_40px_-24px_oklch(0.08_0.03_268_/_0.9)]">
        <span className="inline-flex items-center gap-1.5">
          <CommentIcon size={14} className="text-violet-bright" />
          37
        </span>
      </div>
      <div className="absolute bottom-[8%] left-[24%] rounded-xl bg-surface-2/85 px-3 py-2 text-xs font-medium text-ink backdrop-blur [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.07),0_18px_40px_-24px_oklch(0.08_0.03_268_/_0.9)]">
        <span className="inline-flex items-center gap-1.5">
          <FlameIcon size={14} className="text-gold" />
          28
        </span>
      </div>
    </div>
  );
}

export default CommunityHero;
