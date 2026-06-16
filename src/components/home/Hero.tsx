"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo, Constellation, NebulaBackground } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import { easeOutExpo } from "@/lib/motion";
import type { HomeContent } from "@/content/home";

export function Hero({ t, locale }: { t: HomeContent["hero"]; locale: Locale }) {
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const item = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: easeOutExpo },
        },
      };

  return (
    <section className="relative isolate overflow-hidden">
      {/* hero-scoped nebula, brighter than the global one */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <NebulaBackground variant="hero" />
      </div>
      {/* floor fade into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg))",
        }}
      />

      <div className="mx-auto flex min-h-[88vh] max-w-[1100px] flex-col items-center justify-center px-5 pb-20 pt-24 text-center sm:pt-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={item} className="mb-8">
            <Logo href={`/${locale}`} size={56} showWordmark={false} />
          </motion.div>

          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-surface/40 px-4 py-1.5 text-xs font-medium text-ink-soft backdrop-blur gilt-rim"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold [box-shadow:0_0_8px_oklch(0.83_0.13_88_/_0.8)]" />
            {t.badge}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-[family-name:var(--font-display)] text-balance text-[length:var(--text-display)] font-bold leading-[1.04] tracking-[-0.035em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold"
          >
            {t.title}{" "}
            <span className="relative inline-block text-gold">
              {t.titleAccent}
              {/* gilt underline swoosh echoing the logo */}
              <span
                aria-hidden
                className="absolute -bottom-1 start-0 h-[3px] w-full rounded-full bg-gold-grad opacity-90"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-[46ch] text-pretty text-[length:var(--text-lead)] leading-relaxed text-ink-soft"
          >
            {t.sub}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-11 flex flex-wrap items-center justify-center gap-4"
          >
            <Button href={`/${locale}/pricing`} size="lg" magnetic>
              {t.ctaBuild}
            </Button>
            <Button
              href={`/${locale}/features`}
              size="lg"
              variant="secondary"
              iconRight={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              {t.ctaTour}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* faint constellation, lower-corner accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 end-6 hidden opacity-50 lg:block"
      >
        <Constellation className="w-[150px]" />
      </div>
    </section>
  );
}

export default Hero;
