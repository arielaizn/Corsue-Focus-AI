"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import type { Locale } from "@/lib/i18n";
import type { LearnDict } from "./dictionary";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/shared/Logo";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import { signOut } from "@/app/[locale]/(auth)/actions";
import {
  OverviewIcon,
  CoursesIcon,
  CommunityIcon,
  SettingsIcon,
  SignOutIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/dashboard/icons";

const iconBase = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function TrophyIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} {...p}>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
    </svg>
  );
}

function UserIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export interface TopbarProps {
  locale: Locale;
  dict: LearnDict;
  email: string;
  displayName: string;
}

export function Topbar({ locale, dict, email, displayName }: TopbarProps) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex items-center justify-between gap-3 border-line/60 bg-bg/80 px-4 py-3 backdrop-blur-xl [border-block-end:1px_solid_var(--color-line)] sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav locale={locale} dict={dict} />
        <span className="flex items-center gap-2.5 truncate">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {dict.shell.learner}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LocaleToggle current={locale} />
        <UserMenu
          locale={locale}
          dict={dict}
          email={email}
          displayName={displayName}
        />
      </div>
    </header>
  );
}

function useDismiss(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", key);
    };
  }, [onClose]);
  return ref;
}

function UserMenu({
  locale,
  dict,
  email,
  displayName,
}: {
  locale: Locale;
  dict: LearnDict;
  email: string;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(() => setOpen(false));
  const initial = (displayName || email).trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.shell.account}
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-full bg-aurora text-sm font-bold text-ink [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.18)] transition-transform hover:-translate-y-0.5"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="panel-premium absolute z-[var(--z-nav)] mt-2 w-60 overflow-hidden p-1.5 [inset-inline-end:0]"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink">
              {displayName || email.split("@")[0]}
            </p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <hr className="my-1 border-line/60" />
          <Link
            role="menuitem"
            href={`/${locale}/learn/profile`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
          >
            {dict.nav.profile}
          </Link>
          <Link
            role="menuitem"
            href={`/${locale}/learn/settings`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
          >
            {dict.nav.settings}
          </Link>
          <Link
            role="menuitem"
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
          >
            {dict.shell.backToSite}
          </Link>
          <hr className="my-1 border-line/60" />
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
            >
              <SignOutIcon className="text-ink-soft/70" />
              {dict.shell.signOut}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile/tablet navigation: a hamburger (lg:hidden) opening a focus-trapped,
 * RTL-aware slide-in drawer mirroring the learner Sidebar's item list. Without
 * it the learner surface is unnavigable below 1024px (the desktop <aside> is
 * hidden lg:block). Closes on Escape, backdrop click, and route change.
 */
function MobileNav({ locale, dict }: { locale: Locale; dict: LearnDict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const base = `/${locale}/learn`;

  const items = [
    { href: base, label: dict.nav.overview, Icon: OverviewIcon, exact: true },
    { href: `${base}/courses`, label: dict.nav.courses, Icon: CoursesIcon },
    { href: `${base}/community`, label: dict.nav.community, Icon: CommunityIcon },
    { href: `${base}/leaderboard`, label: dict.nav.leaderboard, Icon: TrophyIcon },
    { href: `${base}/profile`, label: dict.nav.profile, Icon: UserIcon },
    { href: `${base}/settings`, label: dict.nav.settings, Icon: SettingsIcon },
  ];

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

    panel?.querySelector<HTMLElement>(focusableSel)?.focus();

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
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.overview}
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
            aria-label={dict.shell.learner}
            className="panel-premium absolute flex h-dvh w-[18rem] max-w-[85vw] flex-col gap-6 rounded-none p-4 [inset-block:0] [inset-inline-start:0]"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <Logo href={`/${locale}/learn`} size={30} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={dict.player.backToCourses}
                className="grid size-9 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            <nav aria-label={dict.shell.learner} className="flex-1">
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
              ← {dict.shell.backToSite}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
