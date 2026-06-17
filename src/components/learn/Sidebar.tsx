"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import type { Locale } from "@/lib/i18n";
import type { LearnDict } from "./dictionary";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/shared/Logo";
import {
  OverviewIcon,
  CoursesIcon,
  CommunityIcon,
  SettingsIcon,
} from "@/components/dashboard/icons";

/* ---- Learner-only icons (leaderboard + profile) — matched to the dashboard
   icon system: 18px, 24-grid, currentColor stroke, round caps/joins. ---- */
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

export interface SidebarProps {
  locale: Locale;
  dict: LearnDict;
  /** Marketing-site label for the footer link. */
  backToSite: string;
}

export function Sidebar({ locale, dict, backToSite }: SidebarProps) {
  const pathname = usePathname();
  const base = `/${locale}/learn`;

  const items = [
    { href: base, label: dict.nav.overview, Icon: OverviewIcon, exact: true },
    { href: `${base}/courses`, label: dict.nav.courses, Icon: CoursesIcon },
    { href: `${base}/community`, label: dict.nav.community, Icon: CommunityIcon },
    { href: `${base}/leaderboard`, label: dict.nav.leaderboard, Icon: TrophyIcon },
    { href: `${base}/profile`, label: dict.nav.profile, Icon: UserIcon },
    { href: `${base}/settings`, label: dict.nav.settings, Icon: SettingsIcon },
  ];

  return (
    <nav
      aria-label={dict.shell.learner}
      className="flex h-full flex-col gap-6 border-line/60 bg-bg-deep/40 p-4 [border-inline-end:1px_solid_var(--color-line)]"
    >
      <div className="px-2 py-2">
        <Logo href={`/${locale}/learn`} size={30} />
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
