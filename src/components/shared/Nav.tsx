"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { LocaleToggle } from "./LocaleToggle";

export interface NavProps {
  locale: Locale;
}

export function Nav({ locale }: NavProps) {
  const t = dictionary[locale].nav;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hrefFor = (slug: string) => `/${locale}${slug ? `/${slug}` : ""}`;
  const isActive = (slug: string) => {
    const target = hrefFor(slug);
    return slug === "" ? pathname === target : pathname.startsWith(target);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc + focus trap + return focus
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(
      "a, button, [tabindex]:not([tabindex='-1'])",
    );
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "a, button, [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,padding] duration-300",
        scrolled ? "bg-bg/95 py-2.5" : "py-5",
      )}
    >
      {/* gilt hairline — only once scrolled, the gold edge of the floating bar */}
      <span
        aria-hidden
        className={cn(
          "gilt-rule pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-300",
          scrolled ? "opacity-50" : "opacity-0",
        )}
      />
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5">
        <Logo href={hrefFor("")} size={scrolled ? 30 : 34} />

        <ul className="hidden items-center gap-1 lg:flex">
          {t.links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.label}>
                <Link
                  href={hrefFor(link.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-[4px] px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-ink"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleToggle current={locale} />
          <Button href={hrefFor("pricing")} size="md" magnetic>
            {t.cta}
          </Button>
        </div>

        {/* mobile trigger */}
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.close : t.menu}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-[4px] text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={cn(
                "absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform duration-300",
                open && "top-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 top-3 h-0.5 rounded bg-current transition-transform duration-300",
                open && "top-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className={cn(
          "lg:hidden overflow-hidden border-t border-line bg-bg transition-[max-height,opacity] duration-300",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 py-4">
          {t.links.map((link) => (
            <li key={link.label}>
              <Link
                href={hrefFor(link.href)}
                className={cn(
                  "block rounded-[4px] px-4 py-3 text-base font-medium",
                  isActive(link.href)
                    ? "bg-surface text-ink"
                    : "text-ink-soft hover:bg-surface hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 flex items-center justify-between gap-3 px-1">
            <LocaleToggle current={locale} />
            <Button href={hrefFor("pricing")} size="md" className="flex-1">
              {t.cta}
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Nav;
