import { Button, Counter, Tag } from "@/components/ui";
import { Constellation } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";

export function Hero({ locale }: { locale: Locale }) {
  const t = content[locale].hero;

  return (
    <section className="relative mx-auto max-w-[1240px] px-5 pt-28 pb-16 sm:pt-32 sm:pb-20">
      {/* faint constellation accent, decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 flex justify-center opacity-50"
      >
        <Constellation className="max-w-[220px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Tag tone="gold">{t.badge}</Tag>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-balance text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[3.75rem] [.font-he_&]:font-[family-name:var(--font-he)]">
          {t.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[58ch] text-pretty text-base text-ink-soft sm:text-lg">
          {t.sub}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href={`/${locale}/pricing`} size="lg" magnetic>
            {t.ctaPrimary}
          </Button>
          <Button href={`/${locale}/ai`} size="lg" variant="secondary">
            {t.ctaSecondary}
          </Button>
        </div>
      </div>

      {/* stat strip */}
      <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl ring-line">
        {t.stats.map((stat) => (
          <div key={stat.label} className="bg-surface/40 px-4 py-6 text-center">
            <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-gold sm:text-4xl">
              <Counter to={stat.value} suffix={stat.suffix} />
            </div>
            <div className="mt-1.5 text-xs text-muted sm:text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;
