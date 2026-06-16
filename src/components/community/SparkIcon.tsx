import type { SVGProps } from "react";

/** AI spark/star glyph — used by the AI Community Manager + gamification panels. */
export function SparkIcon({ size = 18, ...p }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      {...p}
    >
      <path
        d="M12 2.5c.5 3.8 1.7 5 5.5 5.5-3.8.5-5 1.7-5.5 5.5-.5-3.8-1.7-5-5.5-5.5 3.8-.5 5-1.7 5.5-5.5ZM18.5 14c.3 2 .9 2.6 2.9 2.9-2 .3-2.6.9-2.9 2.9-.3-2-.9-2.6-2.9-2.9 2-.3 2.6-.9 2.9-2.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SparkIcon;
