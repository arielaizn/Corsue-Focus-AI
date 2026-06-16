import { cn } from "@/lib/cn";

/**
 * Small presentational helpers shared by the FEATURES mock UIs.
 * Deterministic (SSR-safe) — no randomness.
 */

/** Initial-based avatar with a deterministic aurora/gold tint from the name. */
export function Avatar({
  name,
  small = false,
  className,
}: {
  name: string;
  small?: boolean;
  className?: string;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  // deterministic hue pick from char codes
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tints = [
    "bg-[oklch(0.6_0.18_262_/_0.9)]",
    "bg-[oklch(0.62_0.215_294_/_0.9)]",
    "bg-[oklch(0.72_0.13_78_/_0.9)]",
    "bg-[oklch(0.62_0.23_330_/_0.9)]",
  ];
  const tint = tints[sum % tints.length];

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-ink ring-line",
        small ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-xs",
        tint,
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Tiny heart / comment glyphs sized for inline feed counters. */
export function IconHeartChat({ kind }: { kind: "heart" | "comment" }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  return kind === "heart" ? (
    <svg {...common}>
      <path d="M12 20S4 14.5 4 9.2A4 4 0 0 1 12 7a4 4 0 0 1 8 2.2C20 14.5 12 20 12 20z" />
    </svg>
  ) : (
    <svg {...common}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" />
    </svg>
  );
}

/** A thin labelled progress bar (aurora fill). value is 0–100. */
export function ProgressBar({
  value,
  className,
  tone = "aurora",
}: {
  value: number;
  className?: string;
  tone?: "aurora" | "gold";
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[oklch(0.34_0.06_267_/_0.6)]",
        className,
      )}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full", tone === "aurora" ? "bg-aurora" : "bg-gold-grad")}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
