import { Reveal, SectionHeading, OrbitDiagram, Button } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { IconSpark } from "./icons";

/** C2 — The AI Suite. OrbitDiagram (signature) + a full chip cloud of all 16. */
export function C2AISuite({ locale }: { locale: Locale }) {
  const t = content[locale].c2;

  // Curated 8 around the orbit; full 16 listed as chips.
  const orbitItems = t.items
    .filter((it) => [2, 3, 4, 9, 11, 29, 46, 47].includes(it.n))
    .map((it) => ({ label: it.label, icon: <IconSpark size={12} /> }));

  return (
    <Section tint className="py-24 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal y={28}>
          <OrbitDiagram centerLabel={t.coreLabel} items={orbitItems} />
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading title={t.title} subtitle={t.subtitle} />
          </Reveal>
          <span aria-hidden className="gilt-rule mt-8 max-w-[140px] opacity-60" />

          <Reveal delay={0.08} className="mt-8 flex flex-wrap gap-2">
            {t.items.map((it) => (
              <span
                key={it.n}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              >
                <span className="text-gold">
                  <IconSpark size={12} />
                </span>
                {it.label}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <Button href={`/${locale}/ai`} variant="ghost" iconRight={<span aria-hidden>→</span>}>
              {t.aiLink}
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export default C2AISuite;
