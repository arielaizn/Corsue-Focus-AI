import { cn } from "@/lib/cn";

const palettes = [
  "bg-[oklch(0.62_0.2_264_/_0.22)] text-[oklch(0.82_0.12_262)]",
  "bg-[oklch(0.6_0.25_300_/_0.22)] text-[oklch(0.82_0.15_300)]",
  "bg-[oklch(0.82_0.135_84_/_0.18)] text-[oklch(0.86_0.1_86)]",
  "bg-[oklch(0.62_0.12_200_/_0.2)] text-[oklch(0.82_0.1_200)]",
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
