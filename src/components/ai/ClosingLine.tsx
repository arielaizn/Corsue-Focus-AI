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
    <section className="mx-auto max-w-[1240px] px-6 pb-12 pt-24 sm:pt-36">
      <Reveal>
        <div className="relative mx-auto max-w-[48rem] text-center">
          <div className="pointer-events-none mx-auto mb-9 flex justify-center opacity-70">
            <Constellation className="max-w-[150px]" />
          </div>
          <h2 className="text-balance text-[length:var(--text-h1)] font-medium leading-[1.1] tracking-[-0.005em] text-ink [.font-he_&]:font-bold [.font-he_&]:tracking-normal">
            {t.title}
          </h2>
          <span aria-hidden className="gilt-rule mx-auto mt-9 max-w-[140px] opacity-60" />
          <p className="mx-auto mt-7 max-w-[54ch] text-pretty text-[length:var(--text-lead)] leading-[1.65] text-ink-soft">
            {t.body}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default ClosingLine;
