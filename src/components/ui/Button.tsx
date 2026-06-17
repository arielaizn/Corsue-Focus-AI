"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  magnetic?: boolean;
  iconRight?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[6px] font-semibold tracking-[0.01em] transition-[transform,box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  // primary — solid warm bone on near-black. Quiet, no glow, no fill colour.
  primary:
    "bg-ink text-bg-deep [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px",
  // secondary — gilt hairline outline; foil warms on hover. No glow.
  secondary:
    "text-ink [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.45)] hover:-translate-y-px hover:[box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.85)]",
  ghost: "text-ink-soft hover:text-ink",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  magnetic = false,
  iconRight,
  children,
  className,
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  function handleMove(e: React.MouseEvent) {
    if (!magnetic || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  }
  function handleLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  const classes = cn(base, sizes[size], variants[variant], className);
  const inner = (
    <>
      <span className="relative z-[1]">{children}</span>
      {iconRight && (
        <span className="relative z-[1] transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
          {iconRight}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        {...rest}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={classes}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {inner}
    </button>
  );
}

export default Button;
