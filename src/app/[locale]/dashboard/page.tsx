import Link from "next/link";
import type { ReactElement } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { appDictionary, greetingFor } from "@/lib/app-dictionary";
import {
  getUserAndAcademies,
  safeCount,
  type MembershipWithAcademy,
} from "@/lib/auth";
import { PageHeader, StatCard, EmptyState, Panel } from "@/components/dashboard/ui";
import {
  AcademyIcon,
  CoursesIcon,
  CommunityIcon,
  StudentsIcon,
  SparkIcon,
} from "@/components/dashboard/icons";

export const dynamic = "force-dynamic";

export default async function DashboardOverview({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const dict = appDictionary[locale];
  const d = dict.dashboard;

  const { user, profile, memberships } = await getUserAndAcademies();
  const greeting = greetingFor(locale, new Date().getHours());
  const name =
    profile?.display_name ||
    (typeof user?.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : user?.email?.split("@")[0]) ||
    "";

  // No academies at all -> the create CTA.
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          kicker={dict.auth.brandKicker}
          title={`${greeting}${name ? `, ${name}` : ""}`}
          subtitle={d.overviewSub}
        />
        <EmptyState
          icon={<AcademyIcon width={26} height={26} />}
          title={d.createTitle}
          body={d.createBody}
          cta={{ label: d.createCta, href: `/${locale}/dashboard/academy` }}
        />
      </div>
    );
  }

  const active: MembershipWithAcademy =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];
  const academyId = active.academy.id;

  // RLS-scoped counts (head + exact count = no rows transferred). `safeCount`
  // returns null if a table's policy blocks the read, rendered as "—".
  const [courses, lessons, students, members] = await Promise.all([
    safeCount((s) =>
      s
        .from("courses")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId),
    ),
    safeCount((s) =>
      s
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId),
    ),
    safeCount((s) =>
      s
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId)
        .eq("role", "student"),
    ),
    safeCount((s) =>
      s
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId)
        .in("role", ["owner", "admin", "instructor"]),
    ),
  ]);

  const fmt = (n: number | null) => (n === null ? "—" : n);
  const stats = [
    { label: d.stats.courses, value: fmt(courses), Icon: CoursesIcon },
    { label: d.stats.lessons, value: fmt(lessons), Icon: SparkIcon },
    {
      label: d.stats.students,
      value: fmt(students),
      Icon: StudentsIcon,
      accent: true,
    },
    { label: d.stats.members, value: fmt(members), Icon: CommunityIcon },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={`${greeting}${name ? `, ${name}` : ""}`}
        subtitle={d.overviewSub}
      />

      <section
        aria-label={dict.auth.brandKicker}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            accent={s.accent}
            icon={<s.Icon width={18} height={18} />}
          />
        ))}
      </section>

      <Panel title={d.quickLinks}>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickLink
            href={`/${locale}/dashboard/courses`}
            label={d.manageCourses}
            Icon={CoursesIcon}
          />
          <QuickLink
            href={`/${locale}/dashboard/community`}
            label={d.manageCommunity}
            Icon={CommunityIcon}
          />
          <QuickLink
            href={`/${locale}/dashboard/students`}
            label={d.manageStudents}
            Icon={StudentsIcon}
          />
        </div>
        <p className="mt-5 text-sm text-muted">
          {d.rolePrefix}: <span className="text-gold">{dict.roles[active.role]}</span>
        </p>
      </Panel>
    </div>
  );
}

function QuickLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: (p: { width?: number; height?: number }) => ReactElement;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl bg-surface-2/40 px-4 py-3.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2/70 hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]"
    >
      <span className="text-gold/80 transition-colors group-hover:text-gold">
        <Icon width={18} height={18} />
      </span>
      {label}
    </Link>
  );
}
