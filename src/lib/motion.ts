import type { Variants } from "motion/react";

/** ease-out-expo — the brand easing (no bounce, no elastic) */
export const easeOutExpo: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];
export const easeOutQuint: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutExpo } },
};

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/**
 * Register GSAP ScrollTrigger on the client. Returns the gsap + ScrollTrigger
 * pair, or null on the server. Call inside useEffect.
 */
export async function registerScrollTrigger() {
  if (typeof window === "undefined") return null;
  const gsapMod = await import("gsap");
  const stMod = await import("gsap/ScrollTrigger");
  const gsap = gsapMod.gsap ?? gsapMod.default;
  const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
