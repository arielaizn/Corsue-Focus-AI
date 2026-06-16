"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { AppDict } from "@/lib/app-dictionary";
import type { MembershipWithAcademy } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import { signOut } from "@/app/[locale]/(auth)/actions";
import { MobileNav } from "./MobileNav";
import { ChevronIcon, SignOutIcon } from "./icons";

export interface TopbarProps {
  locale: Locale;
  shell: AppDict["shell"];
  nav: AppDict["nav"];
  roles: AppDict["roles"];
  email: string;
  displayName: string;
  memberships: MembershipWithAcademy[];
  activeAcademyId: string | null;
}

export function Topbar({
  locale,
  shell,
  nav,
  roles,
  email,
  displayName,
  memberships,
  activeAcademyId,
}: TopbarProps) {
  const params = useSearchParams();
  const fromQuery = params.get("academy");
  const active =
    memberships.find((m) => m.academy.id === fromQuery) ??
    memberships.find((m) => m.academy.id === activeAcademyId) ??
    memberships[0] ??
    null;

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex items-center justify-between gap-3 border-line/60 bg-bg/80 px-4 py-3 backdrop-blur-xl [border-block-end:1px_solid_var(--color-line)] sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav locale={locale} nav={nav} shell={shell} />
        {memberships.length > 1 ? (
          <AcademySwitcher
            shell={shell}
            roles={roles}
            memberships={memberships}
            active={active}
          />
        ) : active ? (
          <span className="flex items-center gap-2.5 truncate">
            <AcademyMark name={active.academy.name} />
            <span className="truncate text-sm font-semibold text-ink">
              {active.academy.name}
            </span>
          </span>
        ) : (
          <span className="text-sm text-muted">{shell.noAcademy}</span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LocaleToggle current={locale} />
        <UserMenu
          locale={locale}
          shell={shell}
          email={email}
          displayName={displayName}
        />
      </div>
    </header>
  );
}

function AcademyMark({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-[0.7rem] font-bold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
    >
      {name.trim().charAt(0).toUpperCase() || "A"}
    </span>
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

function AcademySwitcher({
  shell,
  roles,
  memberships,
  active,
}: {
  shell: AppDict["shell"];
  roles: AppDict["roles"];
  memberships: MembershipWithAcademy[];
  active: MembershipWithAcademy | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={shell.switchAcademy}
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-[16rem] items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-surface/60"
      >
        <AcademyMark name={active?.academy.name ?? "A"} />
        <span className="truncate text-sm font-semibold text-ink">
          {active?.academy.name ?? shell.noAcademy}
        </span>
        <ChevronIcon
          className={cn(
            "shrink-0 text-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="panel-premium absolute z-[var(--z-nav)] mt-2 w-72 overflow-hidden p-1.5 [inset-inline-start:0]"
        >
          <p className="px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {shell.yourAcademies}
          </p>
          {memberships.map((m) => {
            const isActive = m.academy.id === active?.academy.id;
            return (
              <Link
                key={m.academy.id}
                role="menuitem"
                href={`?academy=${m.academy.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-surface-2/70 text-ink"
                    : "text-ink-soft hover:bg-surface/60 hover:text-ink",
                )}
              >
                <AcademyMark name={m.academy.name} />
                <span className="flex-1 truncate">{m.academy.name}</span>
                <span className="text-[0.7rem] text-muted">
                  {roles[m.role]}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserMenu({
  locale,
  shell,
  email,
  displayName,
}: {
  locale: Locale;
  shell: AppDict["shell"];
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
        aria-label={shell.account}
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
            href={`/${locale}/dashboard/settings`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
          >
            {shell.account}
          </Link>
          <Link
            role="menuitem"
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
          >
            {shell.backToSite}
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
              {shell.signOut}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
