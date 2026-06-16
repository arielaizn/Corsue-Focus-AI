import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/** Dark device frame for mobile UI mockups. */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[300px] rounded-[2.25rem] bg-bg-deep p-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line),0_30px_80px_-30px_oklch(0.6_0.25_300_/_0.4)]",
        className,
      )}
    >
      {/* notch */}
      <div className="absolute left-1/2 top-2.5 z-[2] h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-bg-deep" />
      <div className="relative overflow-hidden rounded-[1.75rem] bg-bg [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        {children}
      </div>
    </div>
  );
}

export default PhoneFrame;
