import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/* ---------------------------------------------------------------------------
   GRADING data layer — typed, RLS-safe reads for the instructor grading queue.
   All queries run AS the logged-in user; RLS isolates by tenant. Every read is
   additionally scoped to an explicit academy_id (defence in depth + clear
   intent). Every fetch is wrapped so a blocked/recursive policy degrades to an
   empty list instead of throwing — the page always renders.

   Joins are resolved manually (assignment titles + student names looked up in a
   second pass keyed by id) rather than via embedded selects, to dodge the
   academies/courses RLS-recursion caveat noted in the foundation manifest and
   to keep each query reading from a table that responds cleanly.
--------------------------------------------------------------------------- */

export type SubmissionType = "text" | "file" | "video" | "url";

/** A submission flattened with the human labels the grader needs. */
export interface GradingSubmission {
  id: string;
  academy_id: string;
  assignment_id: string;
  user_id: string;
  submission_type: SubmissionType;
  body: string | null;
  file_url: string | null;
  video_url: string | null;
  score: number | null;
  max_score: number | null;
  feedback: string | null;
  graded_at: string | null;
  graded_by: string | null;
  submitted_at: string;
  ai_review_id: string | null;
  /** Joined labels (best-effort; fall back to a placeholder). */
  assignmentTitle: string;
  assignmentMaxScore: number;
  courseId: string | null;
  studentName: string;
}

/** A recent quiz attempt, flattened for the read-only insight strip. */
export interface QuizAttemptInsight {
  id: string;
  quizTitle: string;
  studentName: string;
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  submittedAt: string | null;
}

async function client() {
  return createClient(await cookies());
}

/** Display name for a set of user ids → Map(id → name). Falls back to a short id. */
async function namesByUser(
  supabase: Awaited<ReturnType<typeof client>>,
  userIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(userIds.filter(Boolean))];
  if (unique.length === 0) return map;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", unique);
    for (const p of data ?? []) {
      map.set(p.id, (p.display_name ?? "").trim() || shortId(p.id));
    }
  } catch {
    // keep whatever resolved
  }
  return map;
}

/** Assignment meta for a set of ids → Map(id → {title, maxScore, courseId}). */
async function assignmentsById(
  supabase: Awaited<ReturnType<typeof client>>,
  ids: string[],
): Promise<Map<string, { title: string; maxScore: number; courseId: string | null }>> {
  const map = new Map<
    string,
    { title: string; maxScore: number; courseId: string | null }
  >();
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return map;
  try {
    const { data } = await supabase
      .from("assignments")
      .select("id, title, max_score, course_id")
      .in("id", unique);
    for (const a of data ?? []) {
      map.set(a.id, {
        title: a.title,
        maxScore: a.max_score ?? 100,
        courseId: a.course_id ?? null,
      });
    }
  } catch {
    // keep whatever resolved
  }
  return map;
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

/** Map a raw submissions row + lookups into the flattened grading shape. */
function toGradingSubmission(
  row: {
    id: string;
    academy_id: string;
    assignment_id: string;
    user_id: string;
    submission_type: SubmissionType;
    body: string | null;
    file_url: string | null;
    video_url: string | null;
    score: number | null;
    max_score: number | null;
    feedback: string | null;
    graded_at: string | null;
    graded_by: string | null;
    submitted_at: string;
    ai_review_id: string | null;
  },
  assignments: Map<string, { title: string; maxScore: number; courseId: string | null }>,
  names: Map<string, string>,
): GradingSubmission {
  const a = assignments.get(row.assignment_id);
  return {
    ...row,
    assignmentTitle: a?.title ?? "—",
    // Prefer the submission's own max_score snapshot; fall back to the
    // assignment's current max; default 100 so a /0 division never happens.
    assignmentMaxScore: row.max_score ?? a?.maxScore ?? 100,
    courseId: a?.courseId ?? null,
    studentName: names.get(row.user_id) ?? shortId(row.user_id),
  };
}

const SUBMISSION_COLS =
  "id, academy_id, assignment_id, user_id, submission_type, body, file_url, video_url, score, max_score, feedback, graded_at, graded_by, submitted_at, ai_review_id";

/**
 * Submissions awaiting a grade (graded_at IS NULL), newest first, with the
 * assignment title + student name resolved. RLS-scoped; failures → [].
 */
export async function listPendingSubmissions(
  academyId: string,
): Promise<GradingSubmission[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("submissions")
      .select(SUBMISSION_COLS)
      .eq("academy_id", academyId)
      .is("graded_at", null)
      .order("submitted_at", { ascending: true })
      .limit(50);

    if (error || !data || data.length === 0) return [];

    const [assignments, names] = await Promise.all([
      assignmentsById(
        supabase,
        data.map((r) => r.assignment_id),
      ),
      namesByUser(
        supabase,
        data.map((r) => r.user_id),
      ),
    ]);

    return data.map((r) => toGradingSubmission(r, assignments, names));
  } catch {
    return [];
  }
}

/**
 * Recently graded submissions (graded_at IS NOT NULL), newest first — the
 * "already done" tab. RLS-scoped; failures → [].
 */
export async function listGradedSubmissions(
  academyId: string,
): Promise<GradingSubmission[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("submissions")
      .select(SUBMISSION_COLS)
      .eq("academy_id", academyId)
      .not("graded_at", "is", null)
      .order("graded_at", { ascending: false })
      .limit(25);

    if (error || !data || data.length === 0) return [];

    const [assignments, names] = await Promise.all([
      assignmentsById(
        supabase,
        data.map((r) => r.assignment_id),
      ),
      namesByUser(
        supabase,
        data.map((r) => r.user_id),
      ),
    ]);

    return data.map((r) => toGradingSubmission(r, assignments, names));
  } catch {
    return [];
  }
}

/**
 * Recent quiz attempts (submitted) joined to the quiz title + student name —
 * read-only insight, newest first. RLS-scoped; failures → [].
 */
export async function recentQuizAttempts(
  academyId: string,
): Promise<QuizAttemptInsight[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("attempts")
      .select("id, quiz_id, user_id, score, max_score, passed, submitted_at")
      .eq("academy_id", academyId)
      .not("submitted_at", "is", null)
      .order("submitted_at", { ascending: false })
      .limit(12);

    if (error || !data || data.length === 0) return [];

    const quizTitles = new Map<string, string>();
    try {
      const quizIds = [...new Set(data.map((r) => r.quiz_id).filter(Boolean))];
      if (quizIds.length) {
        const { data: quizzes } = await supabase
          .from("quizzes")
          .select("id, title")
          .in("id", quizIds);
        for (const q of quizzes ?? []) quizTitles.set(q.id, q.title);
      }
    } catch {
      // titles optional
    }

    const names = await namesByUser(
      supabase,
      data.map((r) => r.user_id),
    );

    return data.map((r) => ({
      id: r.id,
      quizTitle: quizTitles.get(r.quiz_id) ?? "—",
      studentName: names.get(r.user_id) ?? shortId(r.user_id),
      score: r.score,
      maxScore: r.max_score,
      passed: r.passed,
      submittedAt: r.submitted_at,
    }));
  } catch {
    return [];
  }
}
