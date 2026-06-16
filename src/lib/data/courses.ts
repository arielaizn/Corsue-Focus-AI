import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type {
  CourseListItem,
  Course,
  Lesson,
  ModuleWithLessons,
} from "./courses.shared";

/* ---------------------------------------------------------------------------
   COURSES data layer — typed, RLS-safe reads for the course builder.
   All queries run AS the logged-in user; RLS isolates by tenant. Every read
   is additionally scoped to an explicit academy_id (defence in depth + clear
   intent). Writes live in the page-local Server Actions (actions.ts).

   Pure types/enums/constants live in `courses.shared.ts` (client-safe) and are
   re-exported here so existing server imports keep working unchanged.
--------------------------------------------------------------------------- */

export * from "./courses.shared";

async function client() {
  return createClient(await cookies());
}

/**
 * List courses for an academy with module + lesson counts.
 * RLS-scoped; the partial-column select avoids the academies/courses full-row
 * recursion caveat noted in the foundation manifest.
 */
export async function listCourses(
  academyId: string,
): Promise<CourseListItem[]> {
  const supabase = await client();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, short_desc, course_type, price, currency, is_published, enrolled_count, created_at",
    )
    .eq("academy_id", academyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Per-course counts (head queries read cleanly under RLS).
  const items = await Promise.all(
    data.map(async (c): Promise<CourseListItem> => {
      const [{ count: lessonCount }, { count: moduleCount }] =
        await Promise.all([
          supabase
            .from("lessons")
            .select("id", { count: "exact", head: true })
            .eq("course_id", c.id)
            .is("deleted_at", null),
          supabase
            .from("modules")
            .select("id", { count: "exact", head: true })
            .eq("course_id", c.id),
        ]);
      return {
        ...c,
        lessonCount: lessonCount ?? null,
        moduleCount: moduleCount ?? null,
      };
    }),
  );

  return items;
}

/** Fetch a single course (meta) scoped to an academy. */
export async function getCourse(
  academyId: string,
  courseId: string,
): Promise<Course | null> {
  const supabase = await client();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("academy_id", academyId)
    .is("deleted_at", null)
    .maybeSingle();
  return data ?? null;
}

/**
 * Fetch the full module + lesson tree for a course, ordered by position.
 * Lessons read cleanly under RLS (per the manifest).
 */
export async function getCourseTree(
  academyId: string,
  courseId: string,
): Promise<ModuleWithLessons[]> {
  const supabase = await client();

  const [{ data: modules }, { data: lessons }] = await Promise.all([
    supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .eq("academy_id", academyId)
      .order("position", { ascending: true }),
    supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .eq("academy_id", academyId)
      .is("deleted_at", null)
      .order("position", { ascending: true }),
  ]);

  const byModule = new Map<string, Lesson[]>();
  for (const l of lessons ?? []) {
    const arr = byModule.get(l.module_id) ?? [];
    arr.push(l);
    byModule.set(l.module_id, arr);
  }

  return (modules ?? []).map((m) => ({
    ...m,
    lessons: byModule.get(m.id) ?? [],
  }));
}
