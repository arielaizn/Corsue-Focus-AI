import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { storefrontDict, type StorefrontDict } from "@/components/storefront/dictionary";
import {
  getAcademyBySlug,
  getPublicCatalog,
  type PublicCourseCard,
} from "@/lib/data/storefront";

export const dynamic = "force-dynamic";

/* ---------------------------------------------------------------------------
   ACADEMY LANDING — public, anonymous-accessible. Cover + name + tagline +
   social proof, then a grid of published courses (featured first). Each card
   links to ./c/[courseId].
--------------------------------------------------------------------------- */

export default async function AcademyLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = storefrontDict[locale];

  const academy = await getAcademyBySlug(slug);
  if (!academy) notFound();

  const courses = await getPublicCatalog(academy.id);
  const featured = courses.filter((c) => c.is_featured);
  const rest = courses.filter((c) => !c.is_featured);

  const cover = academy.listing?.cover_url ?? academy.cover_url;
  const tagline = academy.listing?.tagline ?? academy.description;
  const studentCount = academy.listing?.student_count ?? 0;
  const nf = locale === "he" ? "he-IL" : "en-US";

  return (
    <div className="flex flex-col gap-10">
      {/* Hero. */}
      <section className="panel-couture relative overflow-hidden rounded-[8px]">
        {cover && (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              className="size-full object-cover opacity-30"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/30"
            />
          </div>
        )}
        <div className="relative z-10 flex flex-col gap-5 p-7 sm:p-10">
          <div className="flex items-center gap-4">
            {academy.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={academy.logo_url}
                alt=""
                className="size-14 shrink-0 rounded-[8px] object-cover [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              />
            ) : (
              <span
                aria-hidden
                className="grid size-14 shrink-0 place-items-center rounded-[8px] bg-surface-2 font-[family-name:var(--font-display)] text-xl font-bold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.35)]"
              >
                {academy.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-[family-name:var(--font-display)] text-h2 font-bold tracking-tight text-ink">
                {academy.name}
              </h1>
              {tagline && (
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {tagline}
                </p>
              )}
            </div>
          </div>

          {/* Social proof strip. */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums text-ink">
                {courses.length.toLocaleString(nf)}
              </span>
              {dict.landing.courses}
            </span>
            {studentCount > 0 && (
              <span className="inline-flex items-baseline gap-1.5">
                <span className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums text-ink">
                  {studentCount.toLocaleString(nf)}
                </span>
                {dict.landing.students}
              </span>
            )}
            {academy.listing?.rating_avg != null &&
              academy.listing.rating_count > 0 && (
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums text-gold">
                    {academy.listing.rating_avg.toFixed(1)}
                  </span>
                  ★
                </span>
              )}
          </div>
        </div>
      </section>

      {/* No courses yet. */}
      {courses.length === 0 ? (
        <div className="panel-premium glow-aurora flex flex-col items-center gap-2 px-6 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
            {dict.catalog.noCourses}
          </h2>
        </div>
      ) : (
        <>
          {/* Featured. */}
          {featured.length > 0 && (
            <CourseSection
              title={dict.landing.featured}
              locale={locale}
              slug={academy.slug}
              dict={dict}
              courses={featured}
            />
          )}

          {/* All / remaining published. */}
          {rest.length > 0 && (
            <section className="flex flex-col gap-5">
              <div className="flex items-end justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
                  {featured.length > 0
                    ? dict.catalog.allCourses
                    : dict.landing.exploreCourses}
                </h2>
                <Link
                  href={`/${locale}/a/${academy.slug}/courses`}
                  className="text-sm font-medium text-gold transition-colors hover:text-gilt"
                >
                  {dict.landing.viewAll}{" "}
                  <span aria-hidden className="inline-block rtl:-scale-x-100">
                    →
                  </span>
                </Link>
              </div>
              <CourseGrid
                locale={locale}
                slug={academy.slug}
                dict={dict}
                courses={rest}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function CourseSection({
  title,
  locale,
  slug,
  dict,
  courses,
}: {
  title: string;
  locale: Locale;
  slug: string;
  dict: StorefrontDict;
  courses: PublicCourseCard[];
}) {
  return (
    <section className="flex flex-col gap-5">
      <p className="text-gilt">{title}</p>
      <CourseGrid locale={locale} slug={slug} dict={dict} courses={courses} />
    </section>
  );
}

function CourseGrid({
  locale,
  slug,
  dict,
  courses,
}: {
  locale: Locale;
  slug: string;
  dict: StorefrontDict;
  courses: PublicCourseCard[];
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => (
        <li key={c.id}>
          <StoreCourseCard
            locale={locale}
            slug={slug}
            dict={dict}
            course={c}
          />
        </li>
      ))}
    </ul>
  );
}

/** A premium storefront course card (links to the course detail page). */
function StoreCourseCard({
  locale,
  slug,
  dict,
  course,
}: {
  locale: Locale;
  slug: string;
  dict: StorefrontDict;
  course: PublicCourseCard;
}) {
  const nf = locale === "he" ? "he-IL" : "en-US";
  // Only `free` courses are actually free — paid types (subscription/vip/private/
  // cohort) with a null price are members-only, not free.
  const isFree = course.course_type === "free";
  const price = isFree
    ? dict.course.free
    : course.price != null
      ? new Intl.NumberFormat(nf, {
          style: "currency",
          currency: course.currency || "ILS",
          maximumFractionDigits: 0,
        }).format(course.price)
      : dict.course.membersOnly;

  return (
    <Link
      href={`/${locale}/a/${slug}/c/${course.id}`}
      className="panel-premium group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        {course.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.cover_url}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="grid size-full place-items-center font-[family-name:var(--font-display)] text-3xl font-bold text-ink-soft/30"
          >
            {course.title.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-ink">
          {course.title}
        </h3>
        {course.short_desc && (
          <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {course.short_desc}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted">
          <span>
            {course.lessonCount.toLocaleString(nf)} {dict.course.lessons}
          </span>
          <span className="font-semibold text-gold">{price}</span>
        </div>
      </div>
    </Link>
  );
}
