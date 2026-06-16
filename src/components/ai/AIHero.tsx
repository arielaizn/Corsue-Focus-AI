"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, OrbitDiagram, Tag } from "@/components/ui";
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
    <section className="relative mx-auto max-w-[1240px] px-5 pb-12 pt-28 sm:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* copy column */}
        <div className="flex flex-col items-start gap-6">
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeOutExpo }}
          >
            <Tag tone="gold">{t.badge}</Tag>
          </motion.div>

          <motion.h1
            className="font-[family-name:var(--font-display)] text-balance text-[2.2rem] font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05] [.font-he_&]:font-[family-name:var(--font-he)]"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.7, ease: easeOutExpo, delay: 0.05 }
            }
          >
            {t.title}
          </motion.h1>

          <motion.p
            className="max-w-[56ch] text-pretty text-base text-ink-soft sm:text-lg"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.7, ease: easeOutExpo, delay: 0.12 }
            }
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            className="mt-1 flex flex-wrap items-center gap-3"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.7, ease: easeOutExpo, delay: 0.18 }
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

        {/* live chat panel */}
        <motion.div
          className="relative"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.8, ease: easeOutExpo, delay: 0.15 }
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

      {/* orbit — the signature central-AI motif */}
      <div className="relative mt-16 sm:mt-24">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, ease: easeOutExpo }}
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
