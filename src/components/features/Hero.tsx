import { Button, Counter, Tag } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";

export function Hero({ locale }: { locale: Locale }) {
  const t = content[locale].hero;

  return (
    <section className="relative mx-auto max-w-[1240px] px-5 pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Editorial title block — leading left, no centred-everything reflex on wide */}
      <div className="max-w-[60rem]">
        <Tag tone="gold">{t.badge}</Tag>
        <h1 className="mt-8 max-w-[18ch] break-words [hyphens:auto] font-[family-name:var(--font-display)] text-balance text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.01em] text-ink [.font-he_&]:max-w-[20ch] [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold [.font-he_&]:tracking-normal">
          {t.title}
        </h1>
        {/* gilt-rule — the single thread, echoing the wordmark */}
        <span aria-hidden className="gilt-rule mt-10 max-w-[200px] opacity-70" />
        <p className="mt-8 max-w-[62ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
          {t.sub}
        </p>
        <div className="mt-11 flex flex-wrap items-center gap-4">
          <Button href={`/${locale}/pricing`} size="lg" magnetic>
            {t.ctaPrimary}
          </Button>
          <Button href={`/${locale}/ai`} size="lg" variant="secondary">
            {t.ctaSecondary}
          </Button>
        </div>
      </div>

      {/* stat strip — editorial figures, gilt hairline dividers, flat field */}
      <div className="mt-20 border-t border-line pt-12 sm:mt-24">
        <div className="grid grid-cols-3 gap-px">
          {t.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative px-5 sm:px-8 ${
                i > 0
                  ? "before:absolute before:inset-y-1 before:start-0 before:w-px before:bg-line"
                  : ""
              }`}
            >
              <div className="font-[family-name:var(--font-display)] text-[2.75rem] font-medium leading-none text-ink sm:text-[3.25rem] [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold">
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.12em] text-muted [.font-he_&]:tracking-[0.04em] sm:text-[13px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
