import { Button, Counter, Tag } from "@/components/ui";
import { Constellation } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";

export function Hero({ locale }: { locale: Locale }) {
  const t = content[locale].hero;

  return (
    <section className="relative mx-auto max-w-[1240px] px-5 pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* soft aurora depth wash behind the hero — single material, no border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[460px] max-w-3xl"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 22%, oklch(0.30 0.12 300 / 0.5), transparent 64%), radial-gradient(50% 60% at 30% 8%, oklch(0.28 0.12 262 / 0.4), transparent 60%)",
        }}
      />
      {/* faint constellation accent, decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center opacity-60"
      >
        <Constellation className="max-w-[240px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Tag tone="gold">{t.badge}</Tag>
        <h1 className="mx-auto mt-7 max-w-[16ch] break-words [hyphens:auto] font-[family-name:var(--font-display)] text-balance text-[length:var(--text-display)] font-bold leading-[1.04] tracking-[-0.035em] text-ink [.font-he_&]:max-w-[18ch] [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold [.font-he_&]:tracking-[-0.02em]">
          {t.title}
        </h1>
        {/* gilt underline accent echoing the logo */}
        <span aria-hidden className="gilt-rule mx-auto mt-8 max-w-[180px] opacity-70" />
        <p className="mx-auto mt-7 max-w-[60ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
          {t.sub}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={`/${locale}/pricing`} size="lg" magnetic>
            {t.ctaPrimary}
          </Button>
          <Button href={`/${locale}/ai`} size="lg" variant="secondary">
            {t.ctaSecondary}
          </Button>
        </div>
      </div>

      {/* stat strip — raised premium panel with gilt dividers */}
      <div className="panel-premium glow-aurora mx-auto mt-16 grid max-w-2xl grid-cols-3 overflow-hidden">
        {t.stats.map((stat, i) => {
          const center = i === 1;
          return (
            <div
              key={stat.label}
              className={`relative px-4 py-7 text-center ${
                i > 0 ? "before:absolute before:inset-y-5 before:start-0 before:w-px before:bg-line/70" : ""
              } ${
                center
                  ? "[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.18),inset_0_0_44px_-18px_oklch(0.83_0.13_88_/_0.4)]"
                  : ""
              }`}
            >
              <div
                className={`font-[family-name:var(--font-display)] font-bold text-gold ${
                  center ? "text-[2.75rem] sm:text-[3.25rem]" : "text-4xl sm:text-[2.75rem]"
                }`}
              >
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-xs text-muted sm:text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Hero;
