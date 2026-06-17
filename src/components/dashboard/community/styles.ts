/* Shared input/control classes for the COMMUNITY feature, matching the courses
   feature convention (Midnight Atelier / Obsidian Couture). Locally owned. */

export const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";

export const labelCls =
  "text-xs font-semibold uppercase tracking-[0.1em] text-muted";

// Couture primary action — solid warm bone on near-black, gilt inset hairline.
export const primaryBtn =
  "bg-ink text-bg-deep inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px disabled:opacity-50";

export const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]";

// Small inline secondary control (pin/unpin, view thread).
export const chipBtn =
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-ink-soft transition-colors hover:text-ink hover:bg-surface-3/50 [box-shadow:inset_0_0_0_1px_var(--color-line)] disabled:opacity-50";

// Danger label token — kept >=4.5 WCAG-AA against surface tints.
export const dangerText = "text-[oklch(0.78_0.16_22)]";

export const dangerBtn =
  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors text-[oklch(0.78_0.16_22)] hover:bg-[oklch(0.78_0.16_22_/_0.12)]";

export const noticeText = "text-[oklch(0.82_0.13_150)]";
