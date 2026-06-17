import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { learnDict } from "@/components/learn/dictionary";
import { PageHeader, Panel, EmptyState } from "@/components/dashboard/ui";
import { CoursesIcon } from "@/components/dashboard/icons";
import { getMyEnrollments, type EnrolledCourse } from "@/lib/data/learn";

export const dynamic = "force-dynamic";

export default async function MyCourses({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = learnDict[locale];
  const d = dict.courses;

  await requireStudent(locale, `/${locale}/learn/courses`);

  const enrollments = await getMyEnrollments();

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={dict.nav.courses} title={d.title} subtitle={d.subtitle} />
        <EmptyState
          icon={<CoursesIcon width={26} height={26} />}
          title={d.empty}
          body={d.subtitle}
          cta={{ label: d.emptyCta, href: `/${locale}` }}
        />
      </div>
    );
  }

  const inProgress = enrollments.filter(
    (e) => e.status !== "completed" && e.progressPct < 100,
  );
  const completed = enrollments.filter(
    (e) => e.status === "completed" || e.progressPct >= 100,
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader kicker={dict.nav.courses} title={d.title} subtitle={d.subtitle} />

      {inProgress.length > 0 && (
        <Panel title={d.inProgress}>
          <CourseGrid locale={locale} items={inProgress} dict={dict} />
        </Panel>
      )}

      {completed.length > 0 && (
        <Panel title={d.completed}>
          <CourseGrid locale={locale} items={completed} dict={dict} done />
        </Panel>
      )}
    </div>
  );
}

function CourseGrid({
  locale,
  items,
  dict,
  done = false,
}: {
  locale: Locale;
  items: EnrolledCourse[];
  dict: (typeof learnDict)[Locale];
  done?: boolean;
}) {
  const d = dict.courses;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => (
        <li key={e.course.id}>
          <Link
            href={`/${locale}/learn/c/${e.course.id}`}
            className="panel-premium group flex h-full flex-col gap-3 p-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-ink">
                {e.course.title}
              </h3>
              {done && (
                <span className="shrink-0 text-xs font-semibold text-gold">
                  {d.completed}
                </span>
              )}
            </div>
            {e.course.short_desc && (
              <p className="line-clamp-2 text-xs text-ink-soft">
                {e.course.short_desc}
              </p>
            )}
            <div className="mt-auto">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
                <span>
                  {e.completedCount}/{e.lessonCount} {d.lessons}
                </span>
                <span className="tabular-nums">{e.progressPct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${
                    done ? "bg-gold" : "bg-gold/80"
                  }`}
                  style={{ width: `${e.progressPct}%` }}
                />
              </div>
              <span className="mt-3 inline-block text-xs font-medium text-gold transition-colors group-hover:text-gilt">
                {done ? d.review : d.continue} →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
