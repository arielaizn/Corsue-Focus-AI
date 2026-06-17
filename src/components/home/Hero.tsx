"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import { easeOutExpo } from "@/lib/motion";
import type { HomeContent } from "@/content/home";

export function Hero({ t, locale }: { t: HomeContent["hero"]; locale: Locale }) {
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
  };
  const item = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: easeOutExpo },
        },
      };

  return (
    <section className="relative isolate">
      {/* flat true-black field — depth comes from type + space, not glow */}
      <div className="mx-auto flex min-h-[90vh] max-w-[1180px] flex-col justify-center px-6 pb-28 pt-32 sm:pt-40">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-[20ch] flex-col items-start text-start"
        >
          {/* wordmark with a thin gold accent */}
          <motion.div variants={item} className="mb-12 flex items-center gap-4">
            <Logo href={`/${locale}`} size={40} showWordmark={false} />
            <span aria-hidden className="h-9 w-px bg-gold-grad opacity-70" />
            <span className="text-gilt">{t.badge}</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-[family-name:var(--font-display)] text-balance text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.005em] text-ink [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold [.font-he_&]:tracking-normal"
          >
            {t.title}{" "}
            <span className="italic text-gold [.font-he_&]:not-italic">
              {t.titleAccent}
            </span>
          </motion.h1>

          {/* the single gilt thread */}
          <motion.span
            variants={item}
            aria-hidden
            className="gilt-rule mt-10 max-w-[220px] opacity-70"
          />

          <motion.p
            variants={item}
            className="mt-10 max-w-[52ch] text-pretty text-[length:var(--text-lead)] leading-[1.62] text-ink-soft"
          >
            {t.sub}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <Button href={`/${locale}/pricing`} size="lg" magnetic>
              {t.ctaBuild}
            </Button>
            <Button
              href={`/${locale}/features`}
              size="lg"
              variant="secondary"
              iconRight={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="rtl:rotate-180">
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
    </section>
  );
}

export default Hero;
