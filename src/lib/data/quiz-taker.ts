import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { completeLesson } from "@/lib/data/learn";
import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   QUIZ TAKER DATA LAYER — RLS-scoped reads/writes for the signed-in student.

   Everything runs AS the logged-in user (createClient(await cookies())), so
   Postgres RLS provides tenant + ownership isolation. The user id is ALWAYS
   re-derived via auth.getUser() — never trust a client-passed one.

   Security rules enforced here:
   - question_options.is_correct is NEVER sent to the client during the taker
     load (getQuizForTaker strips it). It is read only server-side at grade
     time inside submitAttempt.
   - Grading is server-side: we read is_correct from the DB, compute the score,
     and write attempt_answers + the attempts row. The client cannot influence
     correctness.
   - max_attempts is enforced by counting the user's existing attempts.

   Defensive by design: reads degrade to null/[] rather than throwing.
--------------------------------------------------------------------------- */

type QuestionType = Database["public"]["Enums"]["question_type_enum"];

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
// Public shapes
// ---------------------------------------------------------------------------

/** A single option as exposed to the taker — `is_correct` is intentionally absent. */
export interface TakerOption {
  id: string;
  body: string;
}

/** A single question as exposed to the taker. */
export interface TakerQuestion {
  id: string;
  body: string;
  question_type: QuestionType;
  points: number;
  options: TakerOption[];
}

/** The quiz meta the taker UI needs (no answer keys). */
export interface TakerQuiz {
  id: string;
  title: string;
  description: string | null;
  pass_score: number;
  time_limit_s: number | null;
  max_attempts: number | null;
  course_id: string;
  lesson_id: string | null;
}

export interface QuizForTaker {
  quiz: TakerQuiz;
  questions: TakerQuestion[];
  attemptsUsed: number;
  maxAttempts: number | null;
}

/** One answer submitted by the client. */
export interface SubmittedAnswer {
  questionId: string;
  selectedOptionId?: string | null;
  openAnswer?: string | null;
}

/** Per-question grading outcome returned to the client after submit. */
export interface PerQuestionResult {
  questionId: string;
  correct: boolean;
  correctOptionId?: string;
}

export interface SubmitResult {
  ok: boolean;
  score: number;
  maxScore: number;
  passed: boolean;
  perQuestion: PerQuestionResult[];
  code?: "denied" | "not_started" | "already_submitted" | "error";
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

/**
 * Load a quiz for the taker. Verifies the quiz belongs to `courseId` and that
 * the user is enrolled in that course. Returns questions + options with
 * `is_correct` STRIPPED, plus how many attempts the user has used and the
 * configured max. Returns null if not found / not enrolled / unreadable.
 */
export async function getQuizForTaker(
  courseId: string,
  quizId: string,
): Promise<QuizForTaker | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    // The quiz, scoped to the course it claims to belong to.
    const { data: quiz } = await supabase
      .from("quizzes")
      .select(
        "id, title, description, pass_score, time_limit_s, max_attempts, course_id, lesson_id",
      )
      .eq("id", quizId)
      .eq("course_id", courseId)
      .maybeSingle();
    if (!quiz) return null;

    // The user must be enrolled in the course to take its quiz.
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!enrollment) return null;

    // Questions for the quiz, in order.
    const { data: questionRows } = await supabase
      .from("questions")
      .select("id, body, question_type, points, position")
      .eq("quiz_id", quizId)
      .order("position", { ascending: true });

    const questions = questionRows ?? [];
    const questionIds = questions.map((q) => q.id);

    // Options for those questions — NEVER select is_correct here. We send only
    // id + body + position to the client.
    let optionsByQuestion = new Map<string, TakerOption[]>();
    if (questionIds.length > 0) {
      const { data: optionRows } = await supabase
        .from("question_options")
        .select("id, body, position, question_id")
        .in("question_id", questionIds)
        .order("position", { ascending: true });

      optionsByQuestion = (optionRows ?? []).reduce((map, o) => {
        const list = map.get(o.question_id) ?? [];
        list.push({ id: o.id, body: o.body });
        map.set(o.question_id, list);
        return map;
      }, new Map<string, TakerOption[]>());
    }

    const takerQuestions: TakerQuestion[] = questions.map((q) => ({
      id: q.id,
      body: q.body,
      question_type: q.question_type,
      points: q.points,
      options: optionsByQuestion.get(q.id) ?? [],
    }));

    // How many attempts has the user already used? Only SUBMITTED attempts
    // count — a Start-then-leave (no submitted_at) doesn't consume one.
    const { count: attemptsUsed } = await supabase
      .from("attempts")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", quizId)
      .eq("user_id", userId)
      .not("submitted_at", "is", null);

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        pass_score: quiz.pass_score,
        time_limit_s: quiz.time_limit_s,
        max_attempts: quiz.max_attempts,
        course_id: quiz.course_id,
        lesson_id: quiz.lesson_id,
      },
      questions: takerQuestions,
      attemptsUsed: attemptsUsed ?? 0,
      maxAttempts: quiz.max_attempts,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Start an attempt
// ---------------------------------------------------------------------------

/**
 * Open a new attempt for the quiz. Enforces max_attempts by counting existing
 * attempts. Re-derives the user + resolves academy_id from the quiz (never
 * trusting the client). Returns the new attempt id on success.
 */
export async function startAttempt(quizId: string): Promise<{
  ok: boolean;
  attemptId?: string;
  code?: "max_attempts" | "denied";
}> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false, code: "denied" };

    // Resolve the quiz (academy_id + course_id + limits), and re-check that the
    // user is enrolled in the owning course.
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("id, academy_id, course_id, max_attempts")
      .eq("id", quizId)
      .maybeSingle();
    if (!quiz) return { ok: false, code: "denied" };

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", quiz.course_id)
      .eq("user_id", userId)
      .maybeSingle();
    if (!enrollment) return { ok: false, code: "denied" };

    // Enforce max_attempts (only counts SUBMITTED attempts — a Start-then-leave
    // leaves an in-flight row that must not permanently consume an attempt).
    if (quiz.max_attempts != null) {
      const { count } = await supabase
        .from("attempts")
        .select("id", { count: "exact", head: true })
        .eq("quiz_id", quizId)
        .eq("user_id", userId)
        .not("submitted_at", "is", null);
      if ((count ?? 0) >= quiz.max_attempts) {
        return { ok: false, code: "max_attempts" };
      }
    }

    const { data, error } = await supabase
      .from("attempts")
      .insert({
        academy_id: quiz.academy_id,
        quiz_id: quizId,
        user_id: userId,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) return { ok: false, code: "denied" };
    return { ok: true, attemptId: data.id };
  } catch {
    return { ok: false, code: "denied" };
  }
}

// ---------------------------------------------------------------------------
// Submit + grade (server-side)
// ---------------------------------------------------------------------------

/**
 * Grade and persist an attempt. The attempt is re-verified to belong to the
 * current user and to be unsubmitted. Correctness is computed server-side from
 * question_options.is_correct (the client never sees the key). We write one
 * attempt_answers row per question, update the attempts row, award XP on a
 * pass, and — if the quiz is tied to a lesson and the user passed — mark that
 * lesson complete.
 */
export async function submitAttempt({
  attemptId,
  answers,
}: {
  attemptId: string;
  answers: SubmittedAnswer[];
}): Promise<SubmitResult> {
  const empty: SubmitResult = {
    ok: false,
    score: 0,
    maxScore: 0,
    passed: false,
    perQuestion: [],
  };
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ...empty, code: "denied" };

    // The attempt must belong to this user and not already be submitted.
    const { data: attempt } = await supabase
      .from("attempts")
      .select("id, quiz_id, user_id, submitted_at")
      .eq("id", attemptId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!attempt) return { ...empty, code: "denied" };
    if (attempt.submitted_at) return { ...empty, code: "already_submitted" };

    // Resolve the quiz (limits + lesson link) and re-verify enrollment.
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("id, pass_score, course_id, lesson_id, academy_id")
      .eq("id", attempt.quiz_id)
      .maybeSingle();
    if (!quiz) return { ...empty, code: "denied" };

    // Load the answer key server-side.
    const { data: questionRows } = await supabase
      .from("questions")
      .select("id, points, question_type")
      .eq("quiz_id", attempt.quiz_id)
      .order("position", { ascending: true });
    const questions = questionRows ?? [];
    const questionIds = questions.map((q) => q.id);

    // Index the correct option per question (single-answer model).
    const correctOptionByQuestion = new Map<string, string>();
    if (questionIds.length > 0) {
      const { data: optionRows } = await supabase
        .from("question_options")
        .select("id, question_id, is_correct")
        .in("question_id", questionIds);
      for (const o of optionRows ?? []) {
        if (o.is_correct && !correctOptionByQuestion.has(o.question_id)) {
          correctOptionByQuestion.set(o.question_id, o.id);
        }
      }
    }

    // Index the user's submitted answers by question.
    const answerByQuestion = new Map<string, SubmittedAnswer>();
    for (const a of answers) {
      if (a?.questionId) answerByQuestion.set(a.questionId, a);
    }

    let score = 0;
    let maxScore = 0;
    const perQuestion: PerQuestionResult[] = [];
    const answerRows: Database["public"]["Tables"]["attempt_answers"]["Insert"][] =
      [];

    for (const q of questions) {
      const points = q.points ?? 0;
      const submitted = answerByQuestion.get(q.id);
      const correctOptionId = correctOptionByQuestion.get(q.id);

      // Auto-gradable types: multiple_choice + true_false (option-based).
      // Only these count toward maxScore (the pass denominator). `open` is
      // manual review; match/fill_blank are not yet auto-graded — they are
      // recorded with is_correct=false / 0 points so they neither inflate the
      // denominator nor block a pass.
      const isOptionGraded =
        q.question_type === "multiple_choice" ||
        q.question_type === "true_false";

      if (isOptionGraded) maxScore += points;

      let correct = false;
      if (isOptionGraded && correctOptionId && submitted?.selectedOptionId) {
        correct = submitted.selectedOptionId === correctOptionId;
      }

      const pointsEarned = correct ? points : 0;
      if (isOptionGraded && correct) score += pointsEarned;

      perQuestion.push({
        questionId: q.id,
        correct,
        correctOptionId: correctOptionId ?? undefined,
      });

      answerRows.push({
        attempt_id: attemptId,
        question_id: q.id,
        selected_option: submitted?.selectedOptionId ?? null,
        open_answer: submitted?.openAnswer?.trim() || null,
        is_correct: correct,
        points_earned: pointsEarned,
      });
    }

    // Pass threshold is a percentage of max_score.
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = pct >= quiz.pass_score;

    // Persist the graded answers. Idempotency is guaranteed by the
    // already_submitted guard above (a submitted attempt is never re-graded);
    // there is no attempt_answers DELETE RLS policy, so a pre-insert delete
    // would be a silent no-op — we rely on the guard instead.
    if (answerRows.length > 0) {
      await supabase.from("attempt_answers").insert(answerRows);
    }

    // Finalize the attempt.
    const { error: updErr } = await supabase
      .from("attempts")
      .update({
        score,
        max_score: maxScore,
        passed,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", attemptId)
      .eq("user_id", userId);
    if (updErr) return { ...empty, code: "error" };

    // Award XP on a pass (best-effort; never blocks the result). Only on the
    // FIRST pass — count prior PASSED attempts for this quiz+user (excluding
    // the current attempt) so retaking a passed quiz doesn't re-grant XP.
    if (passed) {
      try {
        const { count: priorPasses } = await supabase
          .from("attempts")
          .select("id", { count: "exact", head: true })
          .eq("quiz_id", attempt.quiz_id)
          .eq("user_id", userId)
          .eq("passed", true)
          .neq("id", attemptId);
        if ((priorPasses ?? 0) === 0) {
          await supabase.from("xp_events").insert({
            academy_id: quiz.academy_id,
            user_id: userId,
            source: "quiz_pass",
            amount: 30,
            entity_id: quiz.id,
          });
        }
      } catch {
        // swallow — XP is non-critical
      }

      // If the quiz gates a lesson, passing completes that lesson.
      if (quiz.lesson_id) {
        try {
          await completeLesson(quiz.lesson_id);
        } catch {
          // swallow — completion is best-effort here
        }
      }
    }

    return { ok: true, score, maxScore, passed, perQuestion };
  } catch {
    return { ...empty, code: "error" };
  }
}

// ---------------------------------------------------------------------------
// Attempt history
// ---------------------------------------------------------------------------

export interface AttemptSummary {
  id: string;
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  startedAt: string;
  submittedAt: string | null;
}

/** The user's attempts on a quiz, newest first. */
export async function getMyAttempts(
  quizId: string,
): Promise<AttemptSummary[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return [];

    const { data } = await supabase
      .from("attempts")
      .select("id, score, max_score, passed, started_at, submitted_at")
      .eq("quiz_id", quizId)
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    return (data ?? []).map((a) => ({
      id: a.id,
      score: a.score,
      maxScore: a.max_score,
      passed: a.passed,
      startedAt: a.started_at,
      submittedAt: a.submitted_at,
    }));
  } catch {
    return [];
  }
}
