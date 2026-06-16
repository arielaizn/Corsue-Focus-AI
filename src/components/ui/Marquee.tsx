"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  items: ReactNode[];
  reverse?: boolean;
  speed?: number; // seconds for one full loop
  className?: string;
}

/**
 * Infinite horizontal scroll. Pauses on hover. Under reduced-motion the CSS
 * animation is neutralized globally and the (duplicated) row simply sits static.
 */
export function Marquee({
  items,
  reverse = false,
  speed = 32,
  className,
}: MarqueeProps) {
  const row = (
    <div
      className="flex shrink-0 items-center gap-10 pe-10"
      aria-hidden="false"
    >
      {items.map((item, i) => (
        <div key={i} className="shrink-0">
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max animate-[marquee-x_var(--mq-dur)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={
          {
            "--mq-dur": `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {row}
        <div aria-hidden className="flex shrink-0 items-center gap-10 pe-10">
          {items.map((item, i) => (
            <div key={`dup-${i}`} className="shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
