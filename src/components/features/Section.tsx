import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A lightweight section shell. `tint` adds a faint band so adjacent clusters
 * don't read as one flat scroll. Spacing is intentionally NOT identical across
 * clusters — callers pass their own padding when they want a different rhythm.
 */
export function Section({
  children,
  className,
  tint = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  tint?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative", tint && "bg-bg-deep/40", className)}
    >
      <div className="mx-auto max-w-[1240px] px-5">{children}</div>
    </section>
  );
}

export default Section;
