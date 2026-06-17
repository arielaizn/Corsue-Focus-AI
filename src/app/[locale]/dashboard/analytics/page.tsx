import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies, type MembershipWithAcademy } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai/gateway";
import { getAcademyMetrics } from "@/lib/data/analytics";
import { analyticsDict } from "@/components/dashboard/analytics/dict";
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/ui";
import {
  AnalyticsIcon,
  StudentsIcon,
  CoursesIcon,
  SparkIcon,
} from "@/components/dashboard/icons";
import {
  BarChart,
  TopCoursesBars,
  TrendPanel,
} from "@/components/dashboard/analytics/Charts";
import { AdvisorPanel } from "@/components/dashboard/analytics/AdvisorPanel";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = analyticsDict[locale];

  const { user, memberships } = await getUserAndAcademies();
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard/analytics`);
  }

  // No academy yet -> prompt to create one first.
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={t.index.title} title={t.index.title} />
        <EmptyState
          icon={<AnalyticsIcon width={26} height={26} />}
          title={t.index.noAcademyTitle}
          body={t.index.noAcademyBody}
          cta={{
            label: t.index.noAcademyCta,
            href: `/${locale}/dashboard/academy`,
          }}
        />
      </div>
    );
  }

  const active: MembershipWithAcademy =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];
  const academyId = active.academy.id;
  const canWrite = active.role === "owner" || active.role === "admin";

  // Role-gate the whole page. RLS confines payments/enrollments/memberships to
  // the caller's OWN rows, so a non-owner member would see misleading personal
  // figures presented as academy-wide totals. Stop before any metric is read.
  if (!canWrite) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={active.academy.name} title={t.index.title} />
        <EmptyState
          icon={<AnalyticsIcon width={26} height={26} />}
          title={t.index.notAuthorizedTitle}
          body={t.index.notAuthorizedBody}
        />
      </div>
    );
  }

  const m = await getAcademyMetrics(academyId);
  const advisorLive = aiConfigured();

  const money = (v: number) =>
    `${v.toLocaleString(locale === "he" ? "he-IL" : "en-US")} ${m.currency}`;

  const stats = [
    {
      label: t.stats.students,
      value: m.students.toLocaleString(),
      hint: `${m.activeStudents} ${t.stats.studentsHint}`,
      Icon: StudentsIcon,
      accent: true,
    },
    {
      label: t.stats.completionRate,
      value: `${m.completionRate}%`,
      hint: t.stats.completionHint,
      Icon: SparkIcon,
    },
    {
      label: t.stats.revenue,
      value: money(m.revenue),
      hint: t.stats.revenueHint,
      Icon: AnalyticsIcon,
    },
    {
      label: t.stats.enrollments,
      value: m.enrollments.toLocaleString(),
      hint: t.stats.enrollmentsHint,
      Icon: CoursesIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={t.index.title}
        subtitle={t.index.subtitle}
      />

      <section
        aria-label={t.index.title}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            hint={s.hint}
            accent={s.accent}
            icon={<s.Icon width={18} height={18} />}
          />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <TrendPanel title={t.trends.revenueTitle} subtitle={t.trends.revenueSub}>
          <BarChart
            data={m.revenueByMonth.map((d) => ({
              month: d.month,
              value: d.amount,
            }))}
            monthsShort={t.monthsShort}
            emptyLabel={t.trends.empty}
            format={(v) => money(v)}
            accent
          />
        </TrendPanel>

        <TrendPanel
          title={t.trends.enrollmentsTitle}
          subtitle={t.trends.enrollmentsSub}
        >
          <BarChart
            data={m.enrollmentsByMonth.map((d) => ({
              month: d.month,
              value: d.count,
            }))}
            monthsShort={t.monthsShort}
            emptyLabel={t.trends.empty}
          />
        </TrendPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <TrendPanel
          title={t.trends.topCoursesTitle}
          subtitle={t.trends.topCoursesSub}
        >
          <TopCoursesBars
            data={m.topCourses}
            unit={t.trends.enrolledUnit}
            emptyLabel={t.trends.empty}
          />
        </TrendPanel>

        {/* AI Business Advisor — owner/admin only; degrades when no key. */}
        {canWrite && advisorLive ? (
          <AdvisorPanel locale={locale} academyId={academyId} />
        ) : canWrite ? (
          <section className="gilt-rim relative flex flex-col gap-3 overflow-hidden rounded-[12px] bg-surface p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-[8px] bg-surface-2/70 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.35)]"
              >
                <SparkIcon width={16} height={16} />
              </span>
              <p className="text-sm font-semibold text-ink">
                {t.advisor.disabledTitle}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">
              {t.advisor.disabledBody}
            </p>
            <p className="mt-auto pt-6 text-[11px] text-muted">
              {t.advisor.footnote}
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
