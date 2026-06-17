import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { getCoursePlayer } from "@/lib/data/learn";

export const dynamic = "force-dynamic";

/**
 * Course player entry. Resolves the player and deep-links into the first
 * incomplete lesson. If the user isn't enrolled (player === null), bounce to
 * the public storefront course page so they can enroll.
 */
export default async function CoursePlayerEntry({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale: raw, courseId } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  await requireStudent(locale, `/${locale}/learn/c/${courseId}`);

  const player = await getCoursePlayer(courseId);

  if (!player) {
    // Not enrolled (or unreadable) → send to the storefront course page.
    await redirectToStorefront(locale, courseId);
    return null;
  }

  if (player.firstIncompleteLessonId) {
    redirect(
      `/${locale}/learn/c/${courseId}/${player.firstIncompleteLessonId}`,
    );
  }

  // No playable lessons yet → back to My Courses.
  redirect(`/${locale}/learn/courses`);
}

/** Resolve the academy slug for a course and redirect to its storefront page. */
async function redirectToStorefront(
  locale: Locale,
  courseId: string,
): Promise<never> {
  let slug: string | null = null;
  try {
    const supabase = createClient(await cookies());
    const { data: course } = await supabase
      .from("courses")
      .select("academy_id")
      .eq("id", courseId)
      .maybeSingle();
    if (course) {
      const { data: academy } = await supabase
        .from("academies")
        .select("slug")
        .eq("id", course.academy_id)
        .maybeSingle();
      slug = academy?.slug ?? null;
    }
  } catch {
    slug = null;
  }

  if (slug) redirect(`/${locale}/a/${slug}/c/${courseId}`);
  // Couldn't resolve a storefront → land on My Courses instead.
  redirect(`/${locale}/learn/courses`);
}
