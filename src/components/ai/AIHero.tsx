"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, OrbitDiagram } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/ai";
import { easeOutExpo } from "@/lib/motion";
import { ChatPanel } from "./ChatPanel";
import {
  IconArrow,
  IconBuild,
  IconBook,
  IconChart,
  IconCommunity,
  IconExam,
  IconMic,
  IconReview,
  IconStudio,
  IconTutor,
} from "./icons";

export interface AIHeroProps {
  locale: Locale;
}

const ORBIT_ICONS = [
  IconBuild,
  IconBook,
  IconTutor,
  IconReview,
  IconExam,
  IconChart,
  IconCommunity,
  IconStudio,
  IconMic,
];

export function AIHero({ locale }: AIHeroProps) {
  const t = content[locale].hero;
  const reduced = useReducedMotion();

  const orbitItems = useMemo(
    () =>
      t.orbitItems.map((label, i) => {
        const Icon = ORBIT_ICONS[i % ORBIT_ICONS.length];
        return { label, icon: <Icon width={14} height={14} /> };
      }),
    [t.orbitItems],
  );

  return (
    <section className="relative mx-auto max-w-[1240px] px-6 pb-16 pt-32 sm:pt-40">
      <div className="grid items-end gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* copy column */}
        <div className="flex flex-col items-start gap-7">
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeOutExpo }}
          >
            <span className="text-gilt">{t.badge}</span>
          </motion.div>

          <motion.h1
            className="text-balance text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.01em] text-ink [.font-he_&]:font-bold [.font-he_&]:tracking-normal"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.9, ease: easeOutExpo, delay: 0.05 }
            }
          >
            {t.title}
          </motion.h1>

          <motion.span
            aria-hidden
            className="gilt-rule max-w-[160px] opacity-70"
            initial={reduced ? { opacity: 0.7 } : { opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 0.7, scaleX: 1 }}
            style={{ transformOrigin: "left" }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.8, ease: easeOutExpo, delay: 0.2 }
            }
          />

          <motion.p
            className="max-w-[60ch] text-pretty text-[length:var(--text-lead)] leading-[1.65] text-ink-soft"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.8, ease: easeOutExpo, delay: 0.16 }
            }
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            className="mt-3 flex flex-wrap items-center gap-4"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.7, ease: easeOutExpo, delay: 0.22 }
            }
          >
            <Button href={`/${locale}/pricing`} size="lg" magnetic iconRight={<IconArrow width={18} height={18} />}>
              {t.primaryCta}
            </Button>
            <Button href={`/${locale}/features`} size="lg" variant="secondary">
              {t.secondaryCta}
            </Button>
          </motion.div>
        </div>

        {/* live chat panel — gallery-framed, no glow */}
        <motion.div
          className="frame relative"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.95, ease: easeOutExpo, delay: 0.22 }
          }
        >
          <ChatPanel
            title={t.panelTitle}
            subtitle={t.panelSubtitle}
            turns={t.chat}
            placeholder={t.promptPlaceholder}
            headerRight={<TypingDot reduced={!!reduced} />}
          />
        </motion.div>
      </div>

      {/* orbit — the signature central-AI motif, quiet gold-line diagram */}
      <div className="relative mt-28 sm:mt-44">
        <span aria-hidden className="gilt-rule mx-auto mb-20 max-w-[18rem] opacity-50" />
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduced ? { duration: 0 } : { duration: 1, ease: easeOutExpo }}
        >
          <OrbitDiagram centerLabel={t.orbitCenter} items={orbitItems} />
        </motion.div>
      </div>
    </section>
  );
}

function TypingDot({ reduced }: { reduced: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-deep/70 px-2.5 py-1 text-[11px] font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-gold"
        animate={reduced ? {} : { opacity: [0.3, 1, 0.3] }}
        transition={reduced ? {} : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span aria-hidden>·</span>
    </span>
  );
}

export default AIHero;
