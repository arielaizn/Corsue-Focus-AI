import { initials } from "./util";

/** Small premium avatar — image when present, gilt-rimmed initials otherwise. */
export function Avatar({
  name,
  url,
  size = 32,
}: {
  name: string | null | undefined;
  url?: string | null;
  size?: number;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-surface-2/70 text-[0.7rem] font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </span>
  );
}
