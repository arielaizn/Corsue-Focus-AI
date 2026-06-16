import { Reveal } from "@/components/ui";
import { Constellation } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/ai";

export interface ClosingLineProps {
  locale: Locale;
}

/**
 * Quiet closing statement before the shared CTA — restates the "one mind runs
 * everything" thesis with a constellation accent. Solid ink/gold, no gradient text.
 */
export function ClosingLine({ locale }: ClosingLineProps) {
  const t = content[locale].closing;
  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-8 pt-16 sm:pt-24">
      <Reveal>
        <div className="relative mx-auto max-w-[48rem] text-center">
          <div className="pointer-events-none mx-auto mb-7 flex justify-center opacity-75">
            <Constellation className="max-w-[168px]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-balance text-[length:var(--text-h1)] font-bold leading-[1.06] tracking-[-0.03em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold [.font-he_&]:tracking-normal">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[54ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft">
            {t.body}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default ClosingLine;
