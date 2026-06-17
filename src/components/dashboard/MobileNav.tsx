"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { AppDict } from "@/lib/app-dictionary";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/shared/Logo";
import { MenuIcon, CloseIcon } from "./icons";
import type { Role } from "@/lib/auth";
import { dashboardNavItems } from "./navItems";

export interface MobileNavProps {
  locale: Locale;
  nav: AppDict["nav"];
  shell: AppDict["shell"];
  role: Role;
}

/**
 * Mobile/tablet navigation: a hamburger (lg:hidden) that opens a focus-trapped,
 * RTL-aware slide-in drawer reusing the Sidebar's item list. Without this the
 * whole app is unnavigable below 1024px (the desktop <aside> is hidden lg:block).
 * Closes on Escape, on backdrop click, and on route change (pathname effect).
 */
export function MobileNav({ locale, nav, shell, role }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const base = `/${locale}/dashboard`;

  const items = dashboardNavItems(base, nav, role);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Focus trap + scroll lock + focus restore while open.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusableSel =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Move focus into the panel on open.
    panel
      ?.querySelector<HTMLElement>(focusableSel)
      ?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSel),
      ).filter((el) => el.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey) {
        if (activeEl === first || !panel.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !panel.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={shell.openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink lg:hidden"
      >
        <MenuIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[var(--z-modal,60)] lg:hidden">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-bg-deep/70 backdrop-blur-sm"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={nav.overview}
            className="panel-premium absolute flex h-dvh w-[18rem] max-w-[85vw] flex-col gap-6 rounded-none p-4 [inset-block:0] [inset-inline-start:0]"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <Logo href={`/${locale}/dashboard`} size={30} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={shell.closeMenu}
                className="grid size-9 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            <nav aria-label="Dashboard" className="flex-1">
              <ul className="flex flex-col gap-1">
                {items.map(({ href, label, Icon, exact }) => {
                  const active = exact
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-surface-2/70 text-ink [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.22),inset_0_1px_0_oklch(1_0_0_/_0.05)]"
                            : "text-ink-soft hover:bg-surface/50 hover:text-ink",
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-gold"
                          />
                        )}
                        <Icon
                          className={cn(
                            "shrink-0 transition-colors",
                            active
                              ? "text-gold"
                              : "text-ink-soft/70 group-hover:text-ink-soft",
                          )}
                        />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Link
              href={`/${locale}`}
              className="rounded-xl px-3 py-2 text-xs text-muted transition-colors hover:text-ink-soft"
            >
              ← {shell.backToSite}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
