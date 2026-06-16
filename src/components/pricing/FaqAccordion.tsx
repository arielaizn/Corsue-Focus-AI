"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import type { FaqItem } from "@/content/pricing";

interface Props {
  items: FaqItem[];
}

export function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <div className="panel-premium divide-y divide-[oklch(0.4_0.04_268_/_0.45)] overflow-hidden">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-btn-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-6 text-start transition-colors hover:bg-surface/50"
              >
                <span className="text-base font-medium text-ink">{item.q}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full transition-[transform,color,box-shadow] duration-300",
                    isOpen
                      ? "rotate-45 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]"
                      : "text-ink-soft ring-line",
                  )}
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduced ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: easeOutExpo }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[68ch] px-6 pb-6 text-pretty text-[0.95rem] leading-[1.7] text-ink-soft">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
