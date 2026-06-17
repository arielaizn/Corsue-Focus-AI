"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export interface ConstellationProps {
  className?: string;
}

/**
 * A single fine gilt line motif — a graduation cap traced as a thin gold
 * hairline, drawn in once on scroll-in (stroke-dashoffset). NO glow, NO blur,
 * NO fills. Reduced-motion shows the final drawn state. Couture restraint:
 * one precious foil line, nothing more.
 */
export function Constellation({ className }: ConstellationProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const paths = Array.from(
      svg.querySelectorAll<SVGPathElement>("[data-draw]"),
    );

    if (reduced) {
      paths.forEach((p) => {
        p.style.strokeDashoffset = "0";
        p.style.transition = "none";
      });
      return;
    }

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.style.transition = "none";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          paths.forEach((p, i) => {
            p.style.transition = `stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.14}s`;
            p.style.strokeDashoffset = "0";
          });
          io.disconnect();
        });
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden
      className={cn("w-full max-w-[220px]", className)}
    >
      {/* cap — single fine gold hairline, no glow, no fill */}
      <path
        data-draw
        d="M100 28 38 50l62 22 62-22-62-22Z"
        stroke="var(--color-gold)"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        data-draw
        d="M64 60v20c0 0 15 12 36 12s36-12 36-12V60"
        stroke="var(--color-gold)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        data-draw
        d="M162 50v28"
        stroke="var(--color-gold)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* tassel terminal — a small solid foil dot */}
      <circle cx="162" cy="80" r="1.8" fill="var(--color-gold)" />
    </svg>
  );
}

export default Constellation;
