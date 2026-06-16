"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { AIContent } from "@/content/ai";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/ai";
import { easeOutExpo } from "@/lib/motion";
import { IconLayers, IconSpark } from "./icons";

export interface ModelSelectorProps {
  locale: Locale;
}

const TONE_FILL: Record<string, string> = {
  violet: "oklch(0.62 0.215 294 / 0.16)",
  primary: "oklch(0.6 0.18 262 / 0.16)",
  gold: "oklch(0.83 0.13 88 / 0.13)",
};
const TONE_RIM: Record<string, string> = {
  violet: "oklch(0.62 0.215 294 / 0.42)",
  primary: "oklch(0.6 0.18 262 / 0.42)",
  gold: "oklch(0.83 0.13 88 / 0.44)",
};

/**
 * Multi-AI Layer (#46). Selectable chips for the seven engines; selecting one
 * routes the mock interface to that model and updates the live detail card.
 * Keyboard-operable (real buttons), reduced-motion safe.
 */
export function ModelSelector({ locale }: ModelSelectorProps) {
  const data: AIContent["multiAI"] = content[locale].multiAI;
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const model = data.models[active];

  return (
    <div className="panel-premium glow-aurora p-5 sm:p-7">
      {/* engine picker */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={data.tag}>
        {data.models.map((m, i) => {
          const selected = i === active;
          return (
            <button
              key={m.name}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className="rounded-xl px-3.5 py-2 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                color: selected ? "var(--color-ink)" : "var(--color-ink-soft)",
                backgroundColor: selected ? TONE_FILL[m.tone] : "transparent",
                boxShadow: `inset 0 0 0 1px ${selected ? TONE_RIM[m.tone] : "var(--color-line)"}`,
              }}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      {/* routed interface preview */}
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.1fr]">
        {/* active model detail */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: TONE_FILL[model.tone],
            boxShadow: `inset 0 0 0 1px ${TONE_RIM[model.tone]}, inset 0 1px 0 oklch(1 0 0 / 0.06)`,
          }}
        >
          <div className="text-gilt flex items-center gap-2">
            <IconSpark width={13} height={13} className="text-gold" />
            <span>{data.tag}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={model.name}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={reduced ? { duration: 0 } : { duration: 0.32, ease: easeOutExpo }}
            >
              <p className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold tracking-[-0.02em] text-ink [.font-he_&]:font-[family-name:var(--font-he)] [.font-he_&]:font-extrabold [.font-he_&]:tracking-normal">
                {model.name}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{model.trait}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* mock prompt routed to the engine */}
        <div className="rounded-xl bg-bg-deep/50 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2.5">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <IconLayers width={13} height={13} />
              {locale === "he" ? "מנותב אל" : "Routed to"}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={model.name}
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.25 }}
                className="rounded-md bg-surface/60 px-2 py-0.5 text-xs font-medium text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              >
                {model.name}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">{data.routeNote}</p>
        </div>
      </div>
    </div>
  );
}

export default ModelSelector;
