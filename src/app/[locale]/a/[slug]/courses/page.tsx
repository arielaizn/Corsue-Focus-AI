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
   ACADEMY CATALOG — the full published-course grid. Public/anonymous.
--------------------------------------------------------------------------- */

export default async function AcademyCatalogPage({
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
  const nf = locale === "he" ? "he-IL" : "en-US";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href={`/${locale}/a/${academy.slug}`}
          className="text-sm font-medium text-muted transition-colors hover:text-ink-soft"
        >
          <span aria-hidden className="inline-block rtl:-scale-x-100">
            ←
          </span>{" "}
          {academy.name}
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-h2 font-bold tracking-tight text-ink">
          {dict.catalog.title}
        </h1>
        {courses.length > 0 && (
          <p className="text-sm text-muted">
            {courses.length.toLocaleString(nf)} {dict.landing.coursesCount}
          </p>
        )}
      </header>

      {courses.length === 0 ? (
        <div className="panel-premium glow-aurora flex flex-col items-center gap-2 px-6 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
            {dict.catalog.noCourses}
          </h2>
          <Link
            href={`/${locale}/a/${academy.slug}`}
            className="mt-2 text-sm font-medium text-gold transition-colors hover:text-gilt"
          >
            <span aria-hidden className="inline-block rtl:-scale-x-100">
              ←
            </span>{" "}
            {dict.common.backToAcademy}
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <StoreCourseCard
                locale={locale}
                slug={academy.slug}
                dict={dict}
                course={c}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
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
        {course.is_featured && (
          <span className="absolute inset-block-start-3 inset-inline-start-3 rounded-full bg-bg-deep/80 px-2.5 py-0.5 text-[0.7rem] font-semibold text-gold backdrop-blur-sm [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]">
            {dict.landing.featured}
          </span>
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
