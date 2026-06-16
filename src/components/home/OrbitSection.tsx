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
    <section className="relative overflow-hidden py-28 sm:py-40">
      {/* radial spotlight behind the orbit — aurora into magenta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 52% at 50% 50%, oklch(0.62 0.215 294 / 0.18), transparent 68%), radial-gradient(34% 40% at 62% 42%, oklch(0.62 0.23 330 / 0.12), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-[1240px] px-5">
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
        <Reveal y={28} delay={0.1}>
          <div className="mt-14">
            <OrbitDiagram centerLabel={t.centerLabel} items={items} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default OrbitSection;
