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
  "group relative inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-tight transition-[transform,box-shadow,background-color,color] duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-aurora text-ink shadow-[0_8px_30px_-10px_oklch(0.6_0.25_300_/_0.6)] hover:shadow-[0_0_0_1px_oklch(0.82_0.135_84_/_0.7),0_12px_40px_-8px_oklch(0.6_0.25_300_/_0.6)] hover:-translate-y-0.5",
  secondary:
    "text-ink ring-line hover:bg-surface/60 hover:-translate-y-0.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]",
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
