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
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:py-32">
      <span aria-hidden className="gilt-rule block mb-16 opacity-30" />
      <Reveal y={0} x={-28} duration={0.95}>
        <SectionHeading title={t.title} subtitle={t.sub} as="h2" />
      </Reveal>

      <div className="mt-14 grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
              className="group panel-premium relative flex h-full flex-col justify-between overflow-hidden p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:[box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.5),inset_0_1px_0_oklch(1_0_0_/_0.06),0_18px_50px_-26px_oklch(0.6_0.2_290_/_0.6)]"
            >
              {/* corner glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -end-12 h-40 w-40 rounded-full bg-[oklch(0.62_0.23_330_/_0.16)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative flex items-start justify-between">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-xl bg-bg text-lg text-gold gilt-rim"
                >
                  {glyph[c.key]}
                </span>
                <span className="text-gilt">
                  {c.tag}
                </span>
              </div>
              <div className="relative mt-6">
                <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold leading-[1.1] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold">
                  {c.title}
                </h3>
                <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-bright">
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
