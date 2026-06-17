"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { AppDict } from "@/lib/app-dictionary";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/shared/Logo";
import type { Role } from "@/lib/auth";
import { dashboardNavItems } from "./navItems";

export interface SidebarProps {
  locale: Locale;
  nav: AppDict["nav"];
  /** Active membership role — filters owner/admin-only nav items. */
  role: Role;
  /** Marketing-site label for the footer link. */
  backToSite: string;
}

export function Sidebar({ locale, nav, role, backToSite }: SidebarProps) {
  const pathname = usePathname();
  const base = `/${locale}/dashboard`;

  const items = dashboardNavItems(base, nav, role);

  return (
    <nav
      aria-label="Dashboard"
      className="flex h-full flex-col gap-6 border-line/60 bg-bg-deep/40 p-4 [border-inline-end:1px_solid_var(--color-line)]"
    >
      <div className="px-2 py-2">
        <Logo href={`/${locale}/dashboard`} size={30} />
      </div>

      <ul className="flex flex-1 flex-col gap-1">
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
                    active ? "text-gold" : "text-ink-soft/70 group-hover:text-ink-soft",
                  )}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={`/${locale}`}
        className="rounded-xl px-3 py-2 text-xs text-muted transition-colors hover:text-ink-soft"
      >
        ← {backToSite}
      </Link>
    </nav>
  );
}
