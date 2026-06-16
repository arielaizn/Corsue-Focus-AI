"use client";

import { Marquee } from "@/components/ui";
import { paymentChips, aiChips } from "@/lib/dictionary";
import type { HomeContent } from "@/content/home";

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-surface/30 px-4 py-2.5 text-sm font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary-bright" />
      {label}
    </span>
  );
}

function AiChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-surface/30 px-4 py-2.5 text-sm font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.28)]">
      <span aria-hidden className="text-gold">✦</span>
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
    <section className="relative border-y border-line/60 bg-bg-deep/40 py-14">
      <div className="mx-auto max-w-[1240px] px-5">
        <p className="text-center text-sm font-medium text-muted">{t.eyebrow}</p>
      </div>
      <div className="mt-9 flex flex-col gap-4">
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
