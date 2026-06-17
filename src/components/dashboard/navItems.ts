import type { SVGProps, ReactElement } from "react";
import type { AppDict } from "@/lib/app-dictionary";
import type { Role } from "@/lib/auth";
import {
  OverviewIcon,
  AcademyIcon,
  CoursesIcon,
  AnalyticsIcon,
  GradingIcon,
  CommunityIcon,
  StudentsIcon,
  SettingsIcon,
} from "./icons";

export interface DashboardNavItem {
  href: string;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  exact?: boolean;
}

/**
 * The dashboard nav, filtered to the manager role so we don't advertise
 * owner/admin-only surfaces (analytics, members management) to instructors or
 * students — those pages are also server-gated, this just keeps the nav honest.
 * Shared by the desktop Sidebar and the MobileNav so the two never drift.
 */
export function dashboardNavItems(
  base: string,
  nav: AppDict["nav"],
  role: Role,
): DashboardNavItem[] {
  const isManager = role === "owner" || role === "admin";
  const isGrader = isManager || role === "instructor";

  const all: (DashboardNavItem & { show: boolean })[] = [
    { href: base, label: nav.overview, Icon: OverviewIcon, exact: true, show: true },
    { href: `${base}/academy`, label: nav.academy, Icon: AcademyIcon, show: true },
    { href: `${base}/courses`, label: nav.courses, Icon: CoursesIcon, show: true },
    { href: `${base}/community`, label: nav.community, Icon: CommunityIcon, show: true },
    { href: `${base}/students`, label: nav.students, Icon: StudentsIcon, show: isManager },
    { href: `${base}/grading`, label: nav.grading, Icon: GradingIcon, show: isGrader },
    { href: `${base}/analytics`, label: nav.analytics, Icon: AnalyticsIcon, show: isManager },
    { href: `${base}/settings`, label: nav.settings, Icon: SettingsIcon, show: true },
  ];

  return all.filter((it) => it.show).map(({ show: _show, ...it }) => it);
}
