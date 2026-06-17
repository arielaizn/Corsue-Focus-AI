/* Shared input/control classes for the COURSES feature, matching the auth
   form convention (Midnight Atelier). Reused across builder client components. */

export const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";

export const labelCls =
  "text-xs font-semibold uppercase tracking-[0.1em] text-muted";

// Couture primary action — solid warm bone on near-black, gilt inset hairline.
// No colored glow (the old violet 48px aura is killed). Matches ui/Button primary.
export const auroraBtn =
  "bg-ink text-bg-deep inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px disabled:opacity-50";

export const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]";

// Lightened from oklch(0.72 0.17 25) so small inline delete labels stay >=4.5
// WCAG-AA against surface-2 / surface-3 hover tints (the old value dipped to
// ~4.43 on surface-3). Matches the AuthForm Notice token (clears AA on bg).
export const dangerText = "text-[oklch(0.78_0.16_22)]";
