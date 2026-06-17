"use client";

import { Marquee } from "@/components/ui";
import { paymentChips, aiChips } from "@/lib/dictionary";
import type { HomeContent } from "@/content/home";

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-[6px] bg-surface px-4 py-2.5 text-sm text-ink-soft ring-line">
      <span aria-hidden className="h-1 w-1 rounded-full bg-muted/70" />
      {label}
    </span>
  );
}

function AiChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-[6px] bg-surface px-4 py-2.5 text-sm text-ink-soft gilt-rim">
      <span aria-hidden className="text-gold text-[0.7rem]">✦</span>
      {label}
    </span>
  );
}

const integrations = [
  ...paymentChips,
  "Zoom",
  "Google Meet",
  "Teams",
  "Webhooks",
];

export function TrustStrip({ t }: { t: HomeContent["trust"] }) {
  return (
    <section className="relative bg-bg-deep py-20">
      <span aria-hidden className="gilt-rule absolute inset-x-0 top-0 opacity-40" />
      <span aria-hidden className="gilt-rule absolute inset-x-0 bottom-0 opacity-40" />
      <div className="mx-auto max-w-[1240px] px-6">
        <p className="text-center text-gilt opacity-90">{t.eyebrow}</p>
      </div>
      <div className="mt-12 flex flex-col gap-4">
        <Marquee
          speed={42}
          items={integrations.map((n) => (
            <Chip key={n} label={n} />
          ))}
        />
        <Marquee
          reverse
          speed={38}
          items={aiChips.map((n) => (
            <AiChip key={n} label={n} />
          ))}
        />
      </div>
    </section>
  );
}

export default TrustStrip;
