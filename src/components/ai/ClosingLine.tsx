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
    <section className="mx-auto max-w-[1240px] px-5 pb-4 pt-8">
      <Reveal>
        <div className="relative mx-auto max-w-[46rem] text-center">
          <div className="pointer-events-none mx-auto mb-6 flex justify-center opacity-70">
            <Constellation className="max-w-[160px]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-balance text-3xl font-semibold text-ink sm:text-4xl [.font-he_&]:font-[family-name:var(--font-he)]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-pretty text-base text-ink-soft sm:text-lg">
            {t.body}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default ClosingLine;
