"use server";

import { revalidatePath } from "next/cache";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  startAttempt,
  submitAttempt,
  type SubmitResult,
  type SubmittedAnswer,
} from "@/lib/data/quiz-taker";

/* ---------------------------------------------------------------------------
   QUIZ TAKER server actions. Each re-derives the user server-side (the data
   layer does this internally) and NEVER trusts a client-passed user/academy
   id. The client posts only an attemptId + per-question answers; correctness
   is computed server-side from the DB answer key.
--------------------------------------------------------------------------- */

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}
function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export interface StartAttemptState {
  ok: boolean;
  attemptId?: string;
  code?: "max_attempts" | "denied";
}

/**
 * Begin a fresh attempt. Shaped for useActionState — returns the new attempt
 * id (or a denial code) so the client can flip into the in-progress view.
 */
export async function startAttemptAction(
  _prev: StartAttemptState,
  formData: FormData,
): Promise<StartAttemptState> {
  const quizId = str(formData.get("quizId"));
  if (!quizId) return { ok: false, code: "denied" };

  const res = await startAttempt(quizId);
  return {
    ok: res.ok,
    attemptId: res.attemptId,
    code: res.code,
  };
}

export interface SubmitQuizState {
  status: "idle" | "graded" | "error";
  result?: SubmitResult;
}

/**
 * Grade + persist an attempt. Shaped for useActionState — returns the full
 * per-question result so the taker can render the review inline (no redirect).
 *
 * The client serializes its answers into a single JSON field `answers` so we
 * keep one stable wire shape regardless of question count/type.
 */
export async function submitQuizAction(
  _prev: SubmitQuizState,
  formData: FormData,
): Promise<SubmitQuizState> {
  const locale = resolveLocale(formData.get("locale"));
  const courseId = str(formData.get("courseId"));
  const attemptId = str(formData.get("attemptId"));
  const rawAnswers = str(formData.get("answers"));
  if (!attemptId) return { status: "error" };

  let answers: SubmittedAnswer[] = [];
  try {
    const parsed = rawAnswers ? JSON.parse(rawAnswers) : [];
    if (Array.isArray(parsed)) {
      answers = parsed
        .filter((a): a is Record<string, unknown> => !!a && typeof a === "object")
        .map((a) => ({
          questionId: String(a.questionId ?? ""),
          selectedOptionId:
            typeof a.selectedOptionId === "string" ? a.selectedOptionId : null,
          openAnswer: typeof a.openAnswer === "string" ? a.openAnswer : null,
        }))
        .filter((a) => a.questionId);
    }
  } catch {
    answers = [];
  }

  const result = await submitAttempt({ attemptId, answers });
  if (!result.ok) return { status: "error", result };

  // A pass may have completed a gated lesson + moved course progress — refresh
  // the player + course views so the UI reflects it on next navigation.
  if (courseId) {
    revalidatePath(`/${locale}/learn/c/${courseId}`);
    revalidatePath(`/${locale}/learn`);
    revalidatePath(`/${locale}/learn/courses`);
  }

  return { status: "graded", result };
}
