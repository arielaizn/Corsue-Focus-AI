import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getUser } from "@/lib/auth";
import { enrollAction } from "@/app/[locale]/learn/actions";
import { isEnrolled } from "@/lib/data/learn";
import {
  storefrontDict,
  type StorefrontDict,
} from "@/components/storefront/dictionary";
import {
  getPublicCourse,
  type PublicModuleOutline,
} from "@/lib/data/storefront";

export const dynamic = "force-dynamic";

/* ---------------------------------------------------------------------------
   PUBLIC COURSE DETAIL — anonymous-accessible. Cover, description, curriculum
   outline (modules + lessons, free-preview marked) and an Enroll CTA.

   CTA: signed-in visitors enroll via a server-action <form> (enrollAction,
   which re-derives the user + re-checks ownership server-side and never trusts
   the client-passed ids). Anonymous visitors get a sign-in link with a `next`
   back to this page.
--------------------------------------------------------------------------- */

function fmtDuration(totalS: number | null): string | null {
  if (!totalS || totalS <= 0) return null;
  const m = Math.round(totalS / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export default async function PublicCoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; courseId: string }>;
}) {
  const { locale: raw, slug, courseId } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = storefrontDict[locale];

  const data = await getPublicCourse(slug, courseId);
  if (!data) notFound();

  const { academy, course, modules } = data;

  // Is there a signed-in user, and are they already enrolled?
  const user = await getUser();
  const enrollment = user ? await isEnrolled(course.id) : null;
  const alreadyEnrolled = Boolean(enrollment?.enrolled);

  const nf = locale === "he" ? "he-IL" : "en-US";
  // Only `free` courses are actually free — subscription/vip/private/cohort with
  // a null price are members-only, NOT free.
  const isFree = course.course_type === "free";
  const priceLabel = isFree
    ? dict.course.free
    : course.price != null
      ? new Intl.NumberFormat(nf, {
          style: "currency",
          currency: course.currency || "ILS",
          maximumFractionDigits: 0,
        }).format(course.price)
      : dict.course.membersOnly;

  const courseHref = `/${locale}/a/${academy.slug}/c/${course.id}`;
  const loginHref = `/${locale}/login?next=${encodeURIComponent(courseHref)}`;
  const playerHref = `/${locale}/learn/c/${course.id}`;

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb. */}
      <Link
        href={`/${locale}/a/${academy.slug}`}
        className="text-sm font-medium text-muted transition-colors hover:text-ink-soft"
      >
        <span aria-hidden className="inline-block rtl:-scale-x-100">
          ←
        </span>{" "}
        {academy.name}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* Main column. */}
        <div className="flex flex-col gap-8">
          {/* Header. */}
          <header className="flex flex-col gap-4">
            <h1 className="font-[family-name:var(--font-display)] text-h1 font-bold tracking-tight text-ink">
              {course.title}
            </h1>
            {course.short_desc && (
              <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
                {course.short_desc}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted">
              {course.instructorName && (
                <span>
                  {dict.landing.by}{" "}
                  <span className="text-ink-soft">{course.instructorName}</span>
                </span>
              )}
              <span>
                {data.lessonCount.toLocaleString(nf)} {dict.course.lessons}
              </span>
              <span>
                {modules.length.toLocaleString(nf)} {dict.course.modules}
              </span>
              {course.rating_avg != null && course.rating_count > 0 && (
                <span className="text-gold">
                  {course.rating_avg.toFixed(1)} ★
                </span>
              )}
            </div>
          </header>

          {/* Cover. */}
          {course.cover_url && (
            <div className="overflow-hidden rounded-[8px] [box-shadow:inset_0_0_0_1px_var(--color-line)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.cover_url}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          {/* About. */}
          {course.description && (
            <section className="panel-couture p-6 sm:p-7">
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
                {dict.course.about}
              </h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {course.description}
              </div>
            </section>
          )}

          {/* Curriculum. */}
          <section className="flex flex-col gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
              {dict.course.curriculum}
            </h2>
            {modules.length === 0 ? (
              <p className="text-sm text-muted">{dict.catalog.noCourses}</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {modules.map((m, i) => (
                  <ModuleBlock
                    key={m.id}
                    index={i + 1}
                    module={m}
                    dict={dict}
                  />
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Enroll rail. */}
        <aside className="lg:sticky lg:top-6">
          <div className="panel-couture gilt-rim flex flex-col gap-4 p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
                {priceLabel}
              </span>
              {data.freePreviewCount > 0 && (
                <span className="text-xs text-gold">
                  {data.freePreviewCount.toLocaleString(nf)}{" "}
                  {dict.course.freePreview}
                </span>
              )}
            </div>

            {alreadyEnrolled ? (
              <Link
                href={playerHref}
                className="bg-ink text-bg-deep inline-flex w-full items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold transition-colors hover:bg-ink-soft"
              >
                {dict.course.goToCourse}
              </Link>
            ) : !isFree ? (
              // Paid / members-only course: never the free-enroll server action.
              // Render a disabled members-only CTA (purchase/membership flow TBD).
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-[6px] bg-surface-2 px-6 py-3 text-sm font-semibold text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              >
                {dict.course.membersOnly}
              </button>
            ) : user ? (
              <form action={enrollAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="academyId" value={academy.id} />
                <input type="hidden" name="courseId" value={course.id} />
                <button
                  type="submit"
                  className="bg-gold inline-flex w-full items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold text-bg-deep transition-[transform,filter] duration-300 hover:-translate-y-px hover:brightness-110 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)]"
                >
                  {dict.course.enroll}
                </button>
              </form>
            ) : (
              <Link
                href={loginHref}
                className="bg-gold inline-flex w-full items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold text-bg-deep transition-[transform,filter] duration-300 hover:-translate-y-px hover:brightness-110 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)]"
              >
                {dict.course.signInToEnroll}
              </Link>
            )}

            <ul className="flex flex-col gap-1.5 text-xs text-muted">
              <li>
                {data.lessonCount.toLocaleString(nf)} {dict.course.lessons}
              </li>
              <li>
                {modules.length.toLocaleString(nf)} {dict.course.modules}
              </li>
              {course.enrolled_count > 0 && (
                <li>
                  {course.enrolled_count.toLocaleString(nf)}{" "}
                  {dict.landing.students}
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ModuleBlock({
  index,
  module,
  dict,
}: {
  index: number;
  module: PublicModuleOutline;
  dict: StorefrontDict;
}) {
  return (
    <li className="panel-premium overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--color-line)]/60 px-5 py-3.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold tabular-nums text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]">
          {index}
        </span>
        <h3 className="min-w-0 truncate font-[family-name:var(--font-display)] text-sm font-semibold text-ink">
          {module.title}
        </h3>
        <span className="ms-auto shrink-0 text-xs text-muted">
          {module.lessons.length} {dict.course.lessons}
        </span>
      </div>
      {module.lessons.length > 0 && (
        <ul className="divide-y divide-[var(--color-line)]/40">
          {module.lessons.map((l) => {
            const duration = fmtDuration(l.duration_s);
            return (
              <li
                key={l.id}
                className="flex items-center gap-3 px-5 py-2.5 text-sm"
              >
                <span aria-hidden className="text-ink-soft/50">
                  {l.is_free_preview ? "▶" : "•"}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink-soft">
                  {l.title}
                </span>
                {l.is_free_preview && (
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]">
                    {dict.course.preview}
                  </span>
                )}
                {duration && (
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {duration}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
