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
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold tracking-[-0.01em] transition-[transform,box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  // richer multi-stop aurora fill, gilt rim, lit edge, soft colored depth
  primary:
    "bg-aurora text-ink [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.18),0_18px_48px_-18px_oklch(0.6_0.2_290_/_0.6)] hover:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.65),inset_0_1px_0_oklch(1_0_0_/_0.22),0_22px_56px_-16px_oklch(0.6_0.2_290_/_0.65)] hover:-translate-y-0.5",
  // gilt/hairline outline — gold rim warms on hover
  secondary:
    "text-ink [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.04)] hover:bg-surface/50 hover:-translate-y-0.5 hover:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4),inset_0_1px_0_oklch(1_0_0_/_0.06)]",
  ghost: "text-ink-soft hover:text-ink hover:bg-surface/50",
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
      {variant === "primary" && (
        // restrained gold shimmer sweep on hover
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -inset-x-1 z-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:hidden"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,oklch(0.95_0.08_92_/_0.45),transparent)] group-hover:animate-[gilt-sweep_0.9s_cubic-bezier(0.16,1,0.3,1)]" />
        </span>
      )}
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
