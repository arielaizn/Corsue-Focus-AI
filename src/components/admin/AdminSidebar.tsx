"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { AdminDict } from "@/lib/admin-dictionary";
import { cn } from "@/lib/cn";

export interface AdminSidebarProps {
  locale: Locale;
  dict: AdminDict;
}

/** Platform-admin left nav. Distinct "PLATFORM" badge so it never reads as the
 *  gold academy dashboard. */
export function AdminSidebar({ locale, dict }: AdminSidebarProps) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;

  const items = [
    { href: base, label: dict.nav.overview, exact: true },
    { href: `${base}/academies`, label: dict.nav.academies },
    { href: `${base}/users`, label: dict.nav.users },
    { href: `${base}/moderation`, label: dict.nav.moderation },
    { href: `${base}/system`, label: dict.nav.system },
    { href: `${base}/billing`, label: dict.nav.billing },
  ];

  return (
    <nav
      aria-label={dict.shell.platform}
      className="flex h-full flex-col gap-6 border-line/60 bg-bg-deep/40 p-4 [border-inline-end:1px_solid_var(--color-line)]"
    >
      <div className="px-2 py-2">
        <span className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]">
          <span aria-hidden className="size-1.5 rounded-full bg-gold" />
          {dict.shell.platform}
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-1">
        {items.map(({ href, label, exact }) => {
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
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
