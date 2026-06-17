"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { AIContent } from "@/content/ai";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/ai";
import { easeOutExpo } from "@/lib/motion";
import { IconLayers, IconSpark } from "./icons";

export interface ModelSelectorProps {
  locale: Locale;
}

// couture-neutral: every engine routes through the same gilt-on-charcoal
// treatment — no colour-coding, the selection itself is the signal.
const TONE_FILL: Record<string, string> = {
  violet: "var(--color-surface-2)",
  primary: "var(--color-surface-2)",
  gold: "oklch(0.76 0.105 80 / 0.1)",
};
const TONE_RIM: Record<string, string> = {
  violet: "oklch(0.76 0.105 80 / 0.4)",
  primary: "oklch(0.76 0.105 80 / 0.4)",
  gold: "oklch(0.76 0.105 80 / 0.5)",
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const len = data.models.length;
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % len;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + len) % len;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = len - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="panel-couture grain p-6 sm:p-9">
      {/* engine picker */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label={data.tag}
        onKeyDown={onTabKey}
      >
        {data.models.map((m, i) => {
          const selected = i === active;
          return (
            <button
              key={m.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`model-tab-${i}`}
              aria-selected={selected}
              aria-controls="model-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className="rounded-md px-3.5 py-2 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
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
      <div
        className="mt-6 grid gap-4 md:grid-cols-[1fr_1.1fr]"
        role="tabpanel"
        id="model-panel"
        aria-labelledby={`model-tab-${active}`}
      >
        {/* active model detail */}
        <div
          className="rounded-lg p-5"
          style={{
            backgroundColor: TONE_FILL[model.tone],
            boxShadow: `inset 0 0 0 1px ${TONE_RIM[model.tone]}, inset 0 1px 0 oklch(1 0 0 / 0.04)`,
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
              <p className="mt-4 text-[length:var(--text-h3)] font-medium tracking-[-0.005em] text-ink [.font-he_&]:font-bold [.font-he_&]:tracking-normal">
                {model.name}
              </p>
              <p className="mt-1.5 text-sm text-ink-soft">{model.trait}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* mock prompt routed to the engine */}
        <div className="rounded-lg bg-bg-deep/50 p-5 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
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
          <AnimatePresence mode="wait">
            <motion.p
              key={model.name}
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.25 }}
              className="mt-3 text-xs leading-relaxed text-ink-soft"
            >
              <span className="font-medium text-ink">{model.name}</span>
              <span className="text-muted"> · {model.trait}</span> — {data.routeNote}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ModelSelector;
