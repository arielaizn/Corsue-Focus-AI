"use client";

import { Reveal, SectionHeading, OrbitDiagram } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

// small inline glyphs (not the banned rounded-icon-above-every-heading template;
// these live inside orbit nodes, as the OrbitDiagram contract intends)
const glyphs: React.ReactNode[] = [
  "◈", "✎", "⌖", "✦", "✓", "❖", "◇", "↑", "➶", "▣",
];

export function OrbitSection({
  t,
  locale,
}: {
  t: HomeContent["orbit"];
  locale: Locale;
}) {
  const items = t.items.map((label, i) => ({
    label,
    icon: glyphs[i % glyphs.length],
  }));

  return (
    <section className="relative py-32 sm:py-44">
      <div className="mx-auto max-w-[1240px] px-6">
        <span aria-hidden className="gilt-rule mx-auto mb-20 block max-w-[160px] opacity-60" />
        <Reveal>
          <SectionHeading
            kicker="Academy OS"
            title={t.title}
            subtitle={t.sub}
            align="center"
            as="h2"
            className="mx-auto max-w-2xl"
          />
        </Reveal>
        <Reveal y={20} delay={0.1}>
          <div className="mt-16">
            <OrbitDiagram centerLabel={t.centerLabel} items={items} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default OrbitSection;
