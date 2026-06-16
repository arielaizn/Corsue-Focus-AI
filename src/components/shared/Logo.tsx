"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps {
  /** pixel height of the mark */
  size?: number;
  href?: string;
  className?: string;
  showWordmark?: boolean;
}

/**
 * Renders /logo.png (user's transparent PNG). If absent/broken, falls back to
 * an inline SVG wordmark so the build never breaks.
 */
export function Logo({
  size = 36,
  href,
  className,
  showWordmark = true,
}: LogoProps) {
  const [broken, setBroken] = useState(false);

  const mark = broken ? (
    <WordmarkSVG height={size} />
  ) : (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="CourseFocus AI"
        height={size}
        style={{ height: size, width: "auto" }}
        onError={() => setBroken(true)}
        className="block"
      />
      {showWordmark && <Wordtext />}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="CourseFocus AI"
        className={cn("inline-flex items-center", className)}
      >
        {mark}
      </Link>
    );
  }
  return (
    <span className={cn("inline-flex items-center", className)}>{mark}</span>
  );
}

function Wordtext() {
  return (
    <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-ink">
      CourseFocus<span className="text-gold"> AI</span>
    </span>
  );
}

/** Pure SVG fallback (also exported as /public/wordmark.svg). */
function WordmarkSVG({ height }: { height: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 220 48"
      fill="none"
      role="img"
      aria-label="CourseFocus AI"
    >
      {/* cap + wand star glyph */}
      <g transform="translate(2,4)">
        <path
          d="M20 4 2 13l18 9 18-9-18-9Z"
          fill="oklch(0.21 0.05 265)"
          stroke="oklch(0.82 0.135 84)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 19v8c0 0 4 4 10 4s10-4 10-4v-8"
          stroke="oklch(0.82 0.135 84)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M38 13v9"
          stroke="oklch(0.82 0.135 84)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="m38 24 1.4 3.2L42.8 28l-2.6 2.3.7 3.5-2.9-1.7-2.9 1.7.7-3.5L34 28l3.4-.8L38 24Z"
          fill="oklch(0.88 0.09 88)"
        />
      </g>
      <text
        x="56"
        y="31"
        fontFamily="'Clash Display', system-ui, sans-serif"
        fontSize="20"
        fontWeight="600"
        fill="oklch(0.97 0.012 250)"
      >
        CourseFocus
      </text>
      <text
        x="184"
        y="31"
        fontFamily="'Clash Display', system-ui, sans-serif"
        fontSize="20"
        fontWeight="600"
        fill="oklch(0.82 0.135 84)"
      >
        AI
      </text>
    </svg>
  );
}

export default Logo;
