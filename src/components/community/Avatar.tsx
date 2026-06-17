import { cn } from "@/lib/cn";

/* Couture: tonal bone/charcoal initials with a single restrained gilt variant.
   No blue/violet/magenta — avatars are part of page chrome. */
const palettes = [
  "bg-[oklch(0.24_0.003_60)] text-[oklch(0.86_0.008_75)]",
  "bg-[oklch(0.30_0.004_60)] text-[oklch(0.90_0.01_78)]",
  "bg-[oklch(0.76_0.105_80_/_0.16)] text-[oklch(0.86_0.085_85)]",
  "bg-[oklch(0.19_0.002_60)] text-[oklch(0.82_0.012_75)]",
];

function pick(seed: string) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n + seed.charCodeAt(i)) % palettes.length;
  return palettes[n];
}

export function Avatar({
  initials,
  size = 40,
  className,
  ring,
}: {
  initials: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-semibold leading-none",
        pick(initials),
        ring && "[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_3px_oklch(0.82_0.135_84_/_0.5)]",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}

export default Avatar;
