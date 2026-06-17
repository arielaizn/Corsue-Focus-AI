"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion";

export interface RevealProps {
  children: ReactNode;
  /** vertical offset of the enter animation (px). */
  y?: number;
  /** horizontal offset of the enter animation (px). Used to vary a few headings
   *  off the uniform y-rise. Kept small so RTL mirroring stays imperceptible. */
  x?: number;
  /** override the enter duration (s) to break the uniform timing on a few sections. */
  duration?: number;
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Intersection reveal that ENHANCES already-visible content. whileInView only
 * adds an opacity+transform enter; under reduced-motion the transform is
 * dropped and content is shown instantly. Never gates visibility on a class.
 */
export function Reveal({
  children,
  y = 16,
  x = 0,
  duration = 0.9,
  delay = 0,
  as,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion(as ?? "div");

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration, ease: easeOutExpo, delay }
      }
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
