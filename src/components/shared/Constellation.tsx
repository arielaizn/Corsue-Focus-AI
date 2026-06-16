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
      <defs>
        {/* gilt gradient stroke — solid gold ramp, never on text */}
        <linearGradient id="cf-gilt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.13 78)" />
          <stop offset="42%" stopColor="oklch(0.83 0.13 88)" />
          <stop offset="68%" stopColor="oklch(0.92 0.09 93)" />
          <stop offset="100%" stopColor="oklch(0.74 0.13 80)" />
        </linearGradient>
        {/* subtle gold glow */}
        <filter id="cf-gilt-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#cf-gilt-glow)">
        {/* cap outline */}
        <path
          data-draw
          d="M100 26 36 50l64 24 64-24-64-24Z"
          stroke="url(#cf-gilt)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          opacity="0.97"
        />
        <path
          data-draw
          d="M62 60v22c0 0 16 14 38 14s38-14 38-14V60"
          stroke="url(#cf-gilt)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.88"
        />
        {/* tassel */}
        <path
          data-draw
          d="M164 50v30"
          stroke="url(#cf-gilt)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.88"
        />
        {/* wand from cap to star */}
        <path
          data-draw
          d="M100 96l24 22"
          stroke="oklch(0.72 0.13 78)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.75"
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
            fill="oklch(0.9 0.1 92)"
          />
        ))}
        {/* the star tip */}
        <path
          d="m124 110 2 5 5 .8-3.8 3.5 1 5.2-4.2-2.6-4.2 2.6 1-5.2-3.8-3.5 5-.8 2-5Z"
          fill="oklch(0.9 0.1 92)"
        />
      </g>
    </svg>
  );
}

export default Constellation;
