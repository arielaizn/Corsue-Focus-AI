"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";

export interface LogoProps {
  /** pixel height of the mark */
  size?: number;
  href?: string;
  className?: string;
  showWordmark?: boolean;
  /**
   * When true, the mark's strokes draw themselves on — the lines connect to
   * form the cap — and the wordmark fades in after. Use on big, hero-scale
   * placements. Defaults to a static mark (small / frequent placements).
   */
  draw?: boolean;
}

const GOLD = "var(--color-gold)";

/* The mark is a pure inline SVG — it always renders (no /logo.png request, no
 * broken-image flash), so the logo can never fail to load. */
const BOARD = "M28 7 L53 18 L28 29 L3 18 Z"; // mortarboard (diamond)
const BAND = "M14 22 V33 C14 33 19.5 39 28 39 C36.5 39 42 33 42 33 V22"; // head band
const CORD = "M53 18 V37"; // tassel cord
const STAR =
  "M53 35.4 L54.3 38.7 L57.6 40 L54.3 41.3 L53 44.6 L51.7 41.3 L48.4 40 L51.7 38.7 Z"; // tassel sparkle

export function Logo({
  size = 36,
  href,
  className,
  showWordmark = true,
  draw = false,
}: LogoProps) {
  const reduced = useReducedMotion();
  const play = draw && !reduced;

  // stroke draw-on: pathLength 0 → 1, staggered so the cap assembles itself.
  const strokeProps = (delay: number) => ({
    initial: { pathLength: play ? 0 : 1 },
    animate: { pathLength: 1 },
    transition: play
      ? { duration: 0.6, ease: easeOutExpo, delay }
      : { duration: 0 },
  });

  const mark = (
    <span className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 60 48"
        fill="none"
        role="img"
        aria-label="CourseFocus AI"
        style={{ height: size, width: size * 1.25 }}
        className="block shrink-0 overflow-visible"
      >
        <motion.path
          d={BOARD}
          stroke={GOLD}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          {...strokeProps(0)}
        />
        <motion.path
          d={BAND}
          stroke={GOLD}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          {...strokeProps(0.4)}
        />
        <motion.path
          d={CORD}
          stroke={GOLD}
          strokeWidth={2}
          strokeLinecap="round"
          {...strokeProps(0.8)}
        />
        <motion.path
          d={STAR}
          fill={GOLD}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ opacity: play ? 0 : 1, scale: play ? 0.3 : 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            play
              ? { duration: 0.42, ease: easeOutExpo, delay: 1.05 }
              : { duration: 0 }
          }
        />
      </svg>
      {showWordmark && (
        <motion.span
          initial={{ opacity: play ? 0 : 1, x: play ? -6 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            play ? { duration: 0.5, ease: easeOutExpo, delay: 1.15 } : { duration: 0 }
          }
          className="font-[family-name:var(--font-display)] text-[1.35rem] font-medium leading-none tracking-[0] text-ink [.font-he_&]:font-[family-name:var(--font-he-display)]"
        >
          CourseFocus<span className="text-gold"> AI</span>
        </motion.span>
      )}
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
  return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
}

export default Logo;
