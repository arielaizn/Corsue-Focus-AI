/* Shared input/control classes for the MEMBERS / STUDENTS feature, matching the
   COURSES feature convention (Midnight Atelier / Obsidian Couture). */

export const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";

export const labelCls =
  "text-xs font-semibold uppercase tracking-[0.1em] text-muted";

// Couture primary action — solid warm bone on near-black, gilt inset hairline.
export const auroraBtn =
  "bg-ink text-bg-deep inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px disabled:opacity-50";

export const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]";

// Small inline ghost (table-row actions).
export const ghostBtnSm =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]";

// WCAG-AA red for inline delete labels on surface tints.
export const dangerText = "text-[oklch(0.78_0.16_22)]";

export const dangerBtnSm =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[oklch(0.78_0.16_22)] transition-colors hover:text-[oklch(0.84_0.16_22)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.3)]";

export const selectSm =
  "rounded-lg bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-ink outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";
