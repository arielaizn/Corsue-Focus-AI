import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies } from "@/lib/auth";
import { getCourse, getCourseTree } from "@/lib/data/courses";
import { coursesDict } from "@/components/dashboard/courses/dictionary";
import { PageHeader, Pill, EmptyState } from "@/components/dashboard/ui";
import { ChevronIcon, AcademyIcon } from "@/components/dashboard/icons";
import { CourseMetaForm } from "@/components/dashboard/courses/CourseMetaForm";
import { CurriculumBuilder } from "@/components/dashboard/courses/CurriculumBuilder";
import { ExamGeneratorPanel } from "@/components/dashboard/courses/ExamGeneratorPanel";
import { VideoStudioPanel } from "@/components/dashboard/courses/VideoStudioPanel";

export const dynamic = "force-dynamic";

export default async function CourseBuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; courseId: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw, courseId } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = coursesDict[locale];

  const { memberships } = await getUserAndAcademies();

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

  const course = await getCourse(academyId, courseId);
  if (!course) notFound();

  const modules = await getCourseTree(academyId, courseId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href={`/${locale}/dashboard/courses?academy=${academyId}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <ChevronIcon width={16} height={16} className="rotate-90 rtl:-rotate-90" />
          {t.builder.back}
        </Link>

        <PageHeader
          kicker={active.academy.name}
          title={course.title}
          actions={
            <Pill tone={course.is_published ? "gold" : "neutral"}>
              {course.is_published ? t.builder.publishedOn : t.builder.publishedOff}
            </Pill>
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
        <CourseMetaForm locale={locale} academyId={academyId} course={course} />
        <CurriculumBuilder
          locale={locale}
          academyId={academyId}
          courseId={course.id}
          modules={modules}
        />
      </div>

      <ExamGeneratorPanel
        locale={locale}
        academyId={academyId}
        courseId={course.id}
      />

      <VideoStudioPanel
        locale={locale}
        academyId={academyId}
        courseId={course.id}
        modules={modules}
      />
    </div>
  );
}
