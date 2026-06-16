import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies } from "@/lib/auth";
import { listCourses } from "@/lib/data/courses";
import { coursesDict } from "@/components/dashboard/courses/dictionary";
import { PageHeader, EmptyState, Pill } from "@/components/dashboard/ui";
import { CoursesIcon, AcademyIcon, ChevronIcon } from "@/components/dashboard/icons";
import { CreateCourseDialog } from "@/components/dashboard/courses/CreateCourseDialog";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = coursesDict[locale];

  const { memberships } = await getUserAndAcademies();

  // No academy yet -> prompt to create one first.
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={t.index.kicker} title={t.index.title} />
        <EmptyState
          icon={<AcademyIcon width={26} height={26} />}
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

  const active =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];
  const academyId = active.academy.id;
  const canWrite = active.role === "owner" || active.role === "admin";

  const courses = await listCourses(academyId);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={t.index.title}
        subtitle={t.index.subtitle}
        actions={
          canWrite ? (
            <CreateCourseDialog locale={locale} academyId={academyId} />
          ) : undefined
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={<CoursesIcon width={26} height={26} />}
          title={t.index.empty.title}
          body={t.index.empty.body}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${locale}/dashboard/courses/${c.id}?academy=${academyId}`}
                className="panel-premium group relative flex h-full flex-col gap-4 p-5 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2/70 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
                  >
                    <CoursesIcon width={18} height={18} />
                  </span>
                  <Pill tone={c.is_published ? "gold" : "neutral"}>
                    {c.is_published ? t.index.published : t.index.draft}
                  </Pill>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-[family-name:var(--font-display)] text-base font-semibold text-ink">
                    {c.title}
                  </h3>
                  {c.short_desc && (
                    <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                      {c.short_desc}
                    </p>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/50 pt-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-3">
                    <span>{t.courseType[c.course_type]}</span>
                    <span aria-hidden>·</span>
                    <span>
                      {c.lessonCount ?? "—"} {t.index.lessons}
                    </span>
                  </span>
                  <span className="tabular-nums">
                    {c.course_type === "free" || c.price == null
                      ? t.index.free
                      : `${c.price} ${c.currency}`}
                  </span>
                </div>

                <span
                  aria-hidden
                  className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-ink-soft/0 transition-colors group-hover:text-ink-soft/60 rtl:rotate-180"
                >
                  <ChevronIcon width={16} height={16} className="-rotate-90" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
