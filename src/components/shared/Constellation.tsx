"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export interface ConstellationProps {
  className?: string;
}

/**
 * Gold lines tracing a graduation-cap + wand-star figure, drawn via
 * stroke-dashoffset on scroll-in (IntersectionObserver). Reduced-motion shows
 * the final drawn state. Static stars are always visible.
 */
export function Constellation({ className }: ConstellationProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-draw]"));

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
            p.style.transition = `stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
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
      viewBox="0 0 200 140"
      fill="none"
      aria-hidden
      className={cn("w-full max-w-[260px]", className)}
    >
      {/* cap outline */}
      <path
        data-draw
        d="M100 26 36 50l64 24 64-24-64-24Z"
        stroke="oklch(0.82 0.135 84)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        data-draw
        d="M62 60v22c0 0 16 14 38 14s38-14 38-14V60"
        stroke="oklch(0.82 0.135 84)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* tassel */}
      <path
        data-draw
        d="M164 50v30"
        stroke="oklch(0.82 0.135 84)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* wand from cap to star */}
      <path
        data-draw
        d="M100 96l24 22"
        stroke="oklch(0.7 0.14 70)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* nodes */}
      {[
        [36, 50],
        [100, 26],
        [164, 50],
        [164, 80],
        [100, 96],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.4"
          fill="oklch(0.88 0.09 88)"
        />
      ))}
      {/* the star tip */}
      <path
        d="m124 110 2 5 5 .8-3.8 3.5 1 5.2-4.2-2.6-4.2 2.6 1-5.2-3.8-3.5 5-.8 2-5Z"
        fill="oklch(0.88 0.09 88)"
      />
    </svg>
  );
}

export default Constellation;
