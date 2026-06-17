import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getCourse, getCourseTree } from "@/lib/data/courses";
import type { Course, Lesson, ModuleWithLessons } from "./courses.shared";
import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   LEARNER DATA LAYER — RLS-scoped reads/writes for the signed-in student.

   Every query runs AS the logged-in user (createClient(await cookies())), so
   Postgres RLS provides tenant + ownership isolation. We NEVER trust a
   client-passed user id: the user is always re-derived via auth.getUser().

   Defensive by design: every read is wrapped so a blocked/failed query
   degrades to [] / null instead of throwing out of the data layer.
--------------------------------------------------------------------------- */

type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type BookmarkRow = Database["public"]["Tables"]["bookmarks"]["Row"];
type LessonResourceRow =
  Database["public"]["Tables"]["lesson_resources"]["Row"];
type LessonProgressRow =
  Database["public"]["Tables"]["lesson_progress"]["Row"];

async function client() {
  return createClient(await cookies());
}

/** Re-derive the current user id (never trust a client-passed one). */
async function currentUserId(
  supabase: Awaited<ReturnType<typeof client>>,
): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Enrollment + my-courses
// ---------------------------------------------------------------------------

export interface EnrolledCourse {
  course: {
    id: string;
    title: string;
    short_desc: string | null;
    cover_url: string | null;
    academy_id: string;
    slug: string;
  };
  academy: {
    slug: string;
    name: string;
    logo_url: string | null;
  };
  status: string;
  progressPct: number;
  lessonCount: number;
  completedCount: number;
  lastLessonId: string | null;
}

/**
 * Enroll the signed-in user in a course. Inserts an `enrollments` row (a DB
 * trigger auto-creates the role='student' membership). UNIQUE(course_id,
 * user_id) means a second enroll conflicts — we treat that as `already`.
 */
export async function enroll(
  academyId: string,
  courseId: string,
): Promise<{
  ok: boolean;
  code?: "already" | "denied" | "error";
  enrollmentId?: string;
  academySlug?: string;
}> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false, code: "denied" };

    // Resolve the academy slug for redirect-back on a denied enroll.
    const { data: academy } = await supabase
      .from("academies")
      .select("slug")
      .eq("id", academyId)
      .maybeSingle();
    const academySlug = academy?.slug ?? undefined;

    // Paid-course gate: RLS can't see price, so self-enroll must be blocked
    // server-side for anything that isn't free. Only a `free` course with no
    // positive price may be self-enrolled here (paid access is provisioned via
    // checkout/grant flows, not this action).
    const { data: course } = await supabase
      .from("courses")
      .select("course_type, price")
      .eq("id", courseId)
      .maybeSingle();
    if (!course) return { ok: false, code: "denied", academySlug };
    const isPaid =
      course.course_type !== "free" && (course.price ?? 0) > 0;
    if (isPaid) return { ok: false, code: "denied", academySlug };

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        academy_id: academyId,
        course_id: courseId,
        user_id: userId,
        status: "active",
      })
      .select("id")
      .single();

    if (error) {
      // 23505 = unique_violation → already enrolled (idempotent success).
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("enrollments")
          .select("id")
          .eq("course_id", courseId)
          .eq("user_id", userId)
          .maybeSingle();
        return {
          ok: true,
          code: "already",
          enrollmentId: existing?.id,
          academySlug,
        };
      }
      return { ok: false, code: "denied", academySlug };
    }

    return { ok: true, enrollmentId: data?.id, academySlug };
  } catch {
    return { ok: false, code: "error" };
  }
}

/**
 * Published lesson ids for a course, in course position order (the progress
 * denominator + the basis for resolving the next lesson to resume).
 */
async function publishedLessonIds(
  supabase: Awaited<ReturnType<typeof client>>,
  courseId: string,
): Promise<string[]> {
  const { data } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("module_id", { ascending: true })
    .order("position", { ascending: true });
  return (data ?? []).map((l) => l.id);
}

/**
 * Every enrollment for the user, joined to its course + academy, with progress
 * computed from `lesson_progress` (completed / published lessonCount).
 */
export async function getMyEnrollments(): Promise<EnrolledCourse[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return [];

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("id, course_id, academy_id, status, updated_at, enrolled_at")
      .eq("user_id", userId)
      .in("status", ["active", "paused", "completed"])
      .order("updated_at", { ascending: false });

    if (!enrollments || enrollments.length === 0) return [];

    const courseIds = enrollments.map((e) => e.course_id);
    const academyIds = Array.from(
      new Set(enrollments.map((e) => e.academy_id)),
    );

    const [{ data: courses }, { data: academies }] = await Promise.all([
      supabase
        .from("courses")
        .select("id, title, short_desc, cover_url, academy_id, slug")
        .in("id", courseIds)
        .is("deleted_at", null),
      supabase
        .from("academies")
        .select("id, slug, name, logo_url")
        .in("id", academyIds),
    ]);

    const courseById = new Map((courses ?? []).map((c) => [c.id, c]));
    const academyById = new Map((academies ?? []).map((a) => [a.id, a]));

    const out: EnrolledCourse[] = [];
    for (const e of enrollments) {
      const c = courseById.get(e.course_id);
      if (!c) continue;
      const a = academyById.get(e.academy_id);

      const lessonIds = await publishedLessonIds(supabase, c.id);
      const lessonCount = lessonIds.length;

      let completedCount = 0;
      let lastLessonId: string | null = null;
      if (lessonCount > 0) {
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds);
        const statusByLesson = new Map(
          (progress ?? []).map((p) => [p.lesson_id, p.status]),
        );
        for (const status of statusByLesson.values()) {
          if (status === "completed") completedCount += 1;
        }
        // Resume target: first NOT-completed published lesson in position
        // order, falling back to the very first lesson (mirrors
        // getCoursePlayer.firstIncompleteLessonId).
        lastLessonId =
          lessonIds.find((id) => statusByLesson.get(id) !== "completed") ??
          lessonIds[0] ??
          null;
      }

      const progressPct =
        lessonCount > 0
          ? Math.min(100, Math.round((completedCount / lessonCount) * 100))
          : 0;

      out.push({
        course: {
          id: c.id,
          title: c.title,
          short_desc: c.short_desc,
          cover_url: c.cover_url,
          academy_id: c.academy_id,
          slug: c.slug,
        },
        academy: {
          slug: a?.slug ?? "",
          name: a?.name ?? "",
          logo_url: a?.logo_url ?? null,
        },
        status: e.status,
        progressPct,
        lessonCount,
        completedCount,
        lastLessonId,
      });
    }

    return out;
  } catch {
    return [];
  }
}

/** The most recently active, not-yet-completed enrollment (resume hero). */
export async function getContinueLearning(): Promise<EnrolledCourse | null> {
  try {
    const all = await getMyEnrollments();
    if (all.length === 0) return null;
    const inProgress = all.find(
      (e) => e.status !== "completed" && e.progressPct < 100,
    );
    return inProgress ?? all[0] ?? null;
  } catch {
    return null;
  }
}

/** Is the user enrolled in this course? Returns the enrollment id + status. */
export async function isEnrolled(courseId: string): Promise<{
  enrolled: boolean;
  enrollmentId: string | null;
  status: string | null;
}> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { enrolled: false, enrollmentId: null, status: null };

    const { data } = await supabase
      .from("enrollments")
      .select("id, status")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) return { enrolled: false, enrollmentId: null, status: null };
    return { enrolled: true, enrollmentId: data.id, status: data.status };
  } catch {
    return { enrolled: false, enrollmentId: null, status: null };
  }
}

// ---------------------------------------------------------------------------
// Course player
// ---------------------------------------------------------------------------

export interface CoursePlayer {
  course: Course;
  modules: ModuleWithLessons[];
  progressByLesson: Record<
    string,
    { status: string; last_position_s: number; watch_percent: number }
  >;
  enrollment: { id: string; status: string };
  firstIncompleteLessonId: string | null;
}

/**
 * Everything the lesson player needs: course meta, the module/lesson tree, the
 * user's per-lesson progress, the enrollment, and the first incomplete lesson
 * to deep-link into. Returns null if the user is not enrolled.
 */
export async function getCoursePlayer(
  courseId: string,
): Promise<CoursePlayer | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    // Verify enrollment first (and resolve academy_id from it).
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id, status, academy_id")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!enrollment) return null;
    // Deny deep-links into a refunded/expired course (only active/paused/
    // completed enrollments may open the player).
    if (!["active", "paused", "completed"].includes(enrollment.status)) {
      return null;
    }

    const academyId = enrollment.academy_id;

    const [course, modules] = await Promise.all([
      getCourse(academyId, courseId),
      getCourseTree(academyId, courseId),
    ]);
    if (!course) return null;

    // Only published lessons are playable.
    const publishedModules: ModuleWithLessons[] = modules.map((m) => ({
      ...m,
      lessons: m.lessons.filter((l) => l.is_published && !l.deleted_at),
    }));

    const lessonIds = publishedModules.flatMap((m) =>
      m.lessons.map((l) => l.id),
    );

    const progressByLesson: CoursePlayer["progressByLesson"] = {};
    if (lessonIds.length > 0) {
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id, status, last_position_s, watch_percent")
        .eq("user_id", userId)
        .in("lesson_id", lessonIds);
      for (const p of progress ?? []) {
        progressByLesson[p.lesson_id] = {
          status: p.status,
          last_position_s: p.last_position_s,
          watch_percent: p.watch_percent,
        };
      }
    }

    // First lesson (in order) the user hasn't completed yet.
    let firstIncompleteLessonId: string | null = null;
    for (const m of publishedModules) {
      for (const l of m.lessons) {
        if (progressByLesson[l.id]?.status !== "completed") {
          firstIncompleteLessonId = l.id;
          break;
        }
      }
      if (firstIncompleteLessonId) break;
    }
    // All complete (or empty) → fall back to the very first lesson.
    if (!firstIncompleteLessonId && lessonIds.length > 0) {
      firstIncompleteLessonId = lessonIds[0];
    }

    return {
      course,
      modules: publishedModules,
      progressByLesson,
      enrollment: { id: enrollment.id, status: enrollment.status },
      firstIncompleteLessonId,
    };
  } catch {
    return null;
  }
}

/** The single lesson + its resources + any quiz tied to that lesson. */
export async function getLessonForPlayer(
  courseId: string,
  lessonId: string,
): Promise<{
  lesson: Lesson;
  resources: LessonResourceRow[];
  quiz: { id: string } | null;
} | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    const { data: lesson } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!lesson) return null;

    const [{ data: resources }, { data: quiz }] = await Promise.all([
      supabase
        .from("lesson_resources")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("position", { ascending: true }),
      supabase
        .from("quizzes")
        .select("id")
        .eq("lesson_id", lessonId)
        .limit(1)
        .maybeSingle(),
    ]);

    return {
      lesson,
      resources: resources ?? [],
      quiz: quiz ? { id: quiz.id } : null,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Progress writes
// ---------------------------------------------------------------------------

/** Resolve a lesson's academy_id + course_id, and the user's enrollment_id. */
async function resolveLessonContext(
  supabase: Awaited<ReturnType<typeof client>>,
  userId: string,
  lessonId: string,
): Promise<{
  academyId: string;
  courseId: string;
  enrollmentId: string | null;
} | null> {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("academy_id, course_id")
    .eq("id", lessonId)
    .maybeSingle();
  if (!lesson) return null;

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", lesson.course_id)
    .eq("user_id", userId)
    .maybeSingle();

  return {
    academyId: lesson.academy_id,
    courseId: lesson.course_id,
    enrollmentId: enrollment?.id ?? null,
  };
}

/**
 * Record watch progress for a lesson. Status becomes 'in_progress' unless the
 * lesson is already 'completed' (we don't regress a completion). Upserts on the
 * (lesson_id,user_id) unique key.
 */
export async function markLessonProgress({
  lessonId,
  positionS,
  watchPercent,
}: {
  lessonId: string;
  positionS: number;
  watchPercent: number;
}): Promise<{ ok: boolean }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false };

    const ctx = await resolveLessonContext(supabase, userId, lessonId);
    if (!ctx) return { ok: false };
    // No enrollment → don't write progress for a course the user isn't in.
    if (!ctx.enrollmentId) return { ok: false };

    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("status")
      .eq("lesson_id", lessonId)
      .eq("user_id", userId)
      .maybeSingle();

    const alreadyComplete = existing?.status === "completed";
    const status: LessonProgressRow["status"] = alreadyComplete
      ? "completed"
      : "in_progress";

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        academy_id: ctx.academyId,
        user_id: userId,
        enrollment_id: ctx.enrollmentId,
        lesson_id: lessonId,
        status,
        last_position_s: Math.max(0, Math.round(positionS)),
        watch_percent: Math.min(100, Math.max(0, Math.round(watchPercent))),
      },
      { onConflict: "lesson_id,user_id" },
    );

    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

/**
 * Mark a lesson complete. Upserts lesson_progress status='completed' +
 * completed_at=now (a DB trigger handles course completion). Also awards XP via
 * an xp_events row (source 'lesson_complete', amount 20) — best-effort.
 */
export async function completeLesson(
  lessonId: string,
): Promise<{ ok: boolean }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false };

    const ctx = await resolveLessonContext(supabase, userId, lessonId);
    if (!ctx) return { ok: false };
    // No enrollment → don't write progress for a course the user isn't in.
    if (!ctx.enrollmentId) return { ok: false };

    // Read prior status BEFORE the upsert so XP is awarded once, not on every
    // re-complete (otherwise the +20 'lesson_complete' grant is gameable).
    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("status")
      .eq("lesson_id", lessonId)
      .eq("user_id", userId)
      .maybeSingle();
    const wasComplete = existing?.status === "completed";

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        academy_id: ctx.academyId,
        user_id: userId,
        enrollment_id: ctx.enrollmentId,
        lesson_id: lessonId,
        status: "completed",
        watch_percent: 100,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "lesson_id,user_id" },
    );
    if (error) return { ok: false };

    // Best-effort XP award — only on the FIRST completion. A failure here must
    // never block the completion.
    if (!wasComplete) {
      try {
        await supabase.from("xp_events").insert({
          academy_id: ctx.academyId,
          user_id: userId,
          source: "lesson_complete",
          amount: 20,
          entity_id: lessonId,
        });
      } catch {
        // swallow — XP is non-critical
      }
    }

    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// ---------------------------------------------------------------------------
// Notes + bookmarks (self read/write)
// ---------------------------------------------------------------------------

/** Notes the user wrote on a lesson, newest first. */
export async function getLessonNotes(lessonId: string): Promise<NoteRow[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return [];

    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

/** Add a note to a lesson (academy_id resolved from the lesson). */
export async function addNote({
  lessonId,
  body,
  positionS,
}: {
  lessonId: string;
  body: string;
  positionS?: number | null;
}): Promise<{ ok: boolean; noteId?: string }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false };

    const trimmed = body.trim();
    if (!trimmed) return { ok: false };

    const { data: lesson } = await supabase
      .from("lessons")
      .select("academy_id")
      .eq("id", lessonId)
      .maybeSingle();
    if (!lesson) return { ok: false };

    const { data, error } = await supabase
      .from("notes")
      .insert({
        academy_id: lesson.academy_id,
        lesson_id: lessonId,
        user_id: userId,
        body: trimmed,
        position_s: positionS ?? null,
      })
      .select("id")
      .single();

    return { ok: !error, noteId: data?.id };
  } catch {
    return { ok: false };
  }
}

/** Delete one of the user's own notes (RLS guarantees ownership). */
export async function deleteNote(
  noteId: string,
): Promise<{ ok: boolean }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false };

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", userId);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

/** Bookmarks the user placed on a lesson, newest first. */
export async function getLessonBookmarks(
  lessonId: string,
): Promise<BookmarkRow[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return [];

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

/**
 * Toggle a bookmark on a lesson. With a `positionS` we treat it as a timestamp
 * bookmark (always added). Without one, it toggles a single lesson-level
 * bookmark (add if none, remove if present).
 */
export async function toggleBookmark({
  lessonId,
  positionS,
  label,
}: {
  lessonId: string;
  positionS?: number | null;
  label?: string | null;
}): Promise<{ ok: boolean; bookmarked: boolean }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false, bookmarked: false };

    const { data: lesson } = await supabase
      .from("lessons")
      .select("academy_id")
      .eq("id", lessonId)
      .maybeSingle();
    if (!lesson) return { ok: false, bookmarked: false };

    // Lesson-level toggle (no timestamp): remove if one already exists.
    if (positionS === undefined || positionS === null) {
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("lesson_id", lessonId)
        .eq("user_id", userId)
        .is("position_s", null)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", existing.id)
          .eq("user_id", userId);
        return { ok: !error, bookmarked: false };
      }
    }

    const { error } = await supabase.from("bookmarks").insert({
      academy_id: lesson.academy_id,
      lesson_id: lessonId,
      user_id: userId,
      position_s: positionS ?? null,
      label: label ?? null,
    });
    return { ok: !error, bookmarked: true };
  } catch {
    return { ok: false, bookmarked: false };
  }
}
