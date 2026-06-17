import type { SVGProps } from "react";

/* ---------------------------------------------------------------------------
   Local icons for the platform moderation surface. Stroke-only, currentColor —
   they inherit the steel/critical accent of the platform chrome (distinct from
   the gold academy dashboard).
--------------------------------------------------------------------------- */

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

/** Shield — the moderation/queue glyph. */
export function ShieldIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} aria-hidden {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}

/** Flag — a reported item. */
export function FlagIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} aria-hidden {...p}>
      <path d="M5 21V4" />
      <path d="M5 5h11l-2 3 2 3H5" />
    </svg>
  );
}

/** Trash — remove content (destructive). */
export function TrashIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} aria-hidden {...p}>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    </svg>
  );
}

/** Check — mark actioned / resolve. */
export function CheckIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} aria-hidden {...p}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

/** X — dismiss the report. */
export function DismissIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} aria-hidden {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
