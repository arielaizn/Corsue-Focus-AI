"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface OrbitItem {
  label: string;
  icon?: ReactNode;
}

export interface OrbitDiagramProps {
  centerLabel: string;
  items: OrbitItem[];
  className?: string;
}

/**
 * Central labeled AI core with N capability nodes orbiting on rings. Nodes are
 * counter-rotated so labels stay upright while rings spin. Reduced-motion =
 * static arranged. On small screens the orbit collapses to a clean wrap grid.
 */
export function OrbitDiagram({
  centerLabel,
  items,
  className,
}: OrbitDiagramProps) {
  const reduced = useReducedMotion();

  // distribute items across up to two rings
  const ringCount = items.length > 6 ? 2 : 1;
  const rings: OrbitItem[][] = [[], []];
  items.forEach((it, i) => rings[i % ringCount].push(it));

  const ringRadii = ringCount === 2 ? [33, 48] : [44];
  const ringDur = [38, 56];

  return (
    <div className={cn("w-full", className)}>
      {/* Orbit view — md and up */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block">
        {/* faint orbit rings */}
        {ringRadii.map((r, i) => (
          <div
            key={`ring-${i}`}
            aria-hidden
            className="absolute left-1/2 top-1/2 rounded-full border border-line/60"
            style={{
              width: `${r * 2}%`,
              height: `${r * 2}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* center AI core */}
        <div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
          <div className="bg-aurora glow-gold grid h-28 w-28 place-items-center rounded-full text-center [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.5),0_0_60px_-6px_oklch(0.6_0.25_300_/_0.7)]">
            <span className="px-2 text-sm font-semibold leading-tight text-ink">
              {centerLabel}
            </span>
          </div>
        </div>

        {/* rotating ring groups */}
        {rings.map((ring, ri) =>
          ring.length === 0 ? null : (
            <div
              key={`grp-${ri}`}
              className={cn(
                "absolute inset-0",
                !reduced &&
                  "animate-[orbit-spin_var(--d)_linear_infinite] motion-reduce:animate-none",
              )}
              style={{ "--d": `${ringDur[ri]}s` } as React.CSSProperties}
            >
              {ring.map((item, ii) => {
                const angle = (360 / ring.length) * ii;
                const r = ringRadii[ri];
                return (
                  <div
                    key={item.label}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translateX(${r}%) rotate(-${angle}deg)`,
                    }}
                  >
                    {/* counter-spin to keep node upright */}
                    <div
                      className={cn(
                        "-translate-x-1/2 -translate-y-1/2",
                        !reduced &&
                          "animate-[orbit-spin_var(--d)_linear_infinite_reverse] motion-reduce:animate-none",
                      )}
                      style={
                        { "--d": `${ringDur[ri]}s` } as React.CSSProperties
                      }
                    >
                      <OrbitNode item={item} />
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        )}
      </div>

      {/* Collapsed grid — mobile */}
      <div className="md:hidden">
        <div className="mx-auto mb-6 grid w-fit place-items-center">
          <div className="bg-aurora grid h-24 w-24 place-items-center rounded-full text-center [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.5)]">
            <span className="px-2 text-sm font-semibold leading-tight text-ink">
              {centerLabel}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <OrbitNode key={item.label} item={item} block />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrbitNode({ item, block }: { item: OrbitItem; block?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-surface/80 px-3 py-2 text-xs font-medium text-ink-soft backdrop-blur [box-shadow:inset_0_0_0_1px_var(--color-line)]",
        block ? "w-full justify-center" : "whitespace-nowrap",
      )}
    >
      {item.icon && <span className="text-gold">{item.icon}</span>}
      <span>{item.label}</span>
    </div>
  );
}

export default OrbitDiagram;
