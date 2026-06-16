"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/ui";
import { easeOutExpo } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";

// bento span map per key — deliberately uneven, not a uniform grid
const spans: Record<string, string> = {
  build: "lg:col-span-3 lg:row-span-2",
  ai: "lg:col-span-3",
  community: "lg:col-span-2",
  game: "lg:col-span-2 lg:row-span-2",
  money: "lg:col-span-2",
  platform: "lg:col-span-4",
};

const glyph: Record<string, string> = {
  build: "▤",
  ai: "✦",
  community: "❖",
  game: "◆",
  money: "₪",
  platform: "▣",
};

export function Pillars({
  t,
  locale,
}: {
  t: HomeContent["pillars"];
  locale: Locale;
}) {
  const reduced = useReducedMotion();
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-28">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.sub} as="h2" />
      </Reveal>

      <div className="mt-12 grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {t.cards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{
              duration: 0.6,
              ease: easeOutExpo,
              delay: reduced ? 0 : i * 0.05,
            }}
            className={spans[c.key]}
          >
            <Link
              href={`/${locale}/${c.href}`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-surface/30 p-6 transition-[transform,box-shadow] duration-300 [box-shadow:inset_0_0_0_1px_var(--color-line)] hover:-translate-y-1 hover:[box-shadow:inset_0_0_0_1px_oklch(0.62_0.2_264_/_0.5),0_18px_50px_-26px_oklch(0.6_0.25_300_/_0.6)]"
            >
              {/* corner glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -end-12 h-40 w-40 rounded-full bg-[oklch(0.6_0.25_300_/_0.16)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative flex items-start justify-between">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-xl bg-bg text-lg text-gold [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.3)]"
                >
                  {glyph[c.key]}
                </span>
                <span className="font-[family-name:var(--font-en)] text-xs text-muted">
                  {c.tag}
                </span>
              </div>
              <div className="relative mt-6">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink [.font-he_&]:font-[family-name:var(--font-he)]">
                  {c.title}
                </h3>
                <p className="mt-2 max-w-[46ch] text-sm text-ink-soft">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-bright">
                  {locale === "he" ? "גלה עוד" : "Explore"}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Pillars;
