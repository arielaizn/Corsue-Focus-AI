"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { gradingDict } from "@/components/dashboard/grading/dict";
import { aiGenerate, aiConfigured } from "@/lib/ai/gateway";

/* ---------------------------------------------------------------------------
   GRADING — Server Actions. All writes run AS the logged-in user; RLS is the
   backstop. We re-resolve the membership role server-side (owner/admin/
   instructor may grade) so a forged academy_id can't target another tenant.
   Every write is additionally scoped to an explicit academy_id.
--------------------------------------------------------------------------- */

export interface GradeActionState {
  error?: string;
  notice?: string;
}

export interface AiDraftState {
  error?: string;
  draft?: string;
  /** The persisted ai_reviews row id, so the grader can link it on save. */
  aiReviewId?: string;
  configured: boolean;
}

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

async function clientFrom() {
  return createClient(await cookies());
}

/**
 * Confirm the user is a grader (owner/admin/instructor) of the academy and
 * return the server client + the resolved user id. Callers check `ok`.
 */
async function assertGrader(academyId: string): Promise<{
  ok: boolean;
  userId: string | null;
  supabase: Awaited<ReturnType<typeof clientFrom>>;
}> {
  const supabase = await clientFrom();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, userId: null, supabase };

  const { data } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("academy_id", academyId)
    .maybeSingle();

  const ok =
    data?.role === "owner" ||
    data?.role === "admin" ||
    data?.role === "instructor";
  return { ok, userId: user.id, supabase };
}

/** Parse a score into a number within [0, max], or null when blank/invalid. */
function parseScore(v: FormDataEntryValue | null, max: number): number | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
}

/* ---------------------------- GRADE ------------------------------------ */

export async function gradeSubmission(
  _prev: GradeActionState,
  formData: FormData,
): Promise<GradeActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = gradingDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const submissionId = str(formData.get("submissionId"));
  const feedback = str(formData.get("feedback"));
  const aiReviewId = str(formData.get("aiReviewId"));

  if (!academyId || !submissionId) return { error: t.generic };

  const { ok, userId, supabase } = await assertGrader(academyId);
  if (!ok || !userId) return { error: t.notGrader };

  // Re-read the submission's max so we validate against the real ceiling
  // (never trust a max posted by the client).
  const { data: row, error: readErr } = await supabase
    .from("submissions")
    .select("id, max_score, assignment_id")
    .eq("id", submissionId)
    .eq("academy_id", academyId)
    .maybeSingle();
  if (readErr || !row) return { error: t.notFound };

  let max = row.max_score ?? null;
  if (max == null) {
    const { data: a } = await supabase
      .from("assignments")
      .select("max_score")
      .eq("id", row.assignment_id)
      .eq("academy_id", academyId)
      .maybeSingle();
    max = a?.max_score ?? 100;
  }

  const score = parseScore(formData.get("score"), max);
  if (score == null) return { error: t.scoreInvalid };

  const { error } = await supabase
    .from("submissions")
    .update({
      score,
      max_score: max,
      feedback: feedback || null,
      graded_by: userId,
      graded_at: new Date().toISOString(),
      ai_review_id: aiReviewId || null,
    })
    .eq("id", submissionId)
    .eq("academy_id", academyId);

  if (error) return { error: t.generic };

  revalidatePath(`/${locale}/dashboard/grading`);
  return { notice: gradingDict[locale].form.saved };
}

/* ---------------------------- AI DRAFT --------------------------------- */

const HE_GRADER = `אתה מרצה ישראלי מנוסה שכותב משוב בונה לתלמיד על הגשת מטלה, בעברית רהוטה וטבעית — לא תרגומית.
כללים:
- עברית אנושית וזורמת. בלי "עברית של AI", בלי מקפים ארוכים (—), בלי "חשוב לציין" / "בעולם של היום".
- פנה אל התלמיד באופן ישיר ומכבד.
- ציין קודם מה נעשה טוב (חוזקות), ואז 2-3 נקודות קונקרטיות לשיפור.
- היה ספציפי לתוכן ההגשה, לא כללי. סיים בעידוד קצר.
- זו טיוטה שהמרצה יערוך — אל תמציא ציון מספרי, רק משוב מילולי.`;

const EN_GRADER = `You are an experienced instructor writing constructive feedback to a student on an assignment submission, in clear natural English.
Rules:
- Address the student directly and respectfully.
- Lead with what they did well (strengths), then 2-3 concrete points to improve.
- Be specific to the submission's content, not generic. End with a short encouragement.
- This is a draft the instructor will edit — do not invent a numeric grade, only written feedback.`;

/**
 * Draft feedback for a submission via the gateway (task "review"). Returns the
 * draft text for the grader to edit; also persists an ai_reviews row so the
 * review is auditable and can be linked on save. Degrades gracefully when no
 * provider key is configured.
 */
export async function aiDraftFeedback(formData: FormData): Promise<AiDraftState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = gradingDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const submissionId = str(formData.get("submissionId"));

  if (!academyId || !submissionId) {
    return { error: t.generic, configured: aiConfigured() };
  }

  if (!aiConfigured()) {
    // No provider key — caller renders an "AI unavailable" hint, manual still works.
    return { configured: false };
  }

  const { ok, supabase } = await assertGrader(academyId);
  if (!ok) return { error: t.notGrader, configured: true };

  // Load the submission + its assignment context to ground the feedback.
  const { data: sub, error: subErr } = await supabase
    .from("submissions")
    .select("id, assignment_id, submission_type, body, file_url, video_url")
    .eq("id", submissionId)
    .eq("academy_id", academyId)
    .maybeSingle();
  if (subErr || !sub) return { error: t.notFound, configured: true };

  const { data: assignment } = await supabase
    .from("assignments")
    .select("title, instructions, description, max_score")
    .eq("id", sub.assignment_id)
    .eq("academy_id", academyId)
    .maybeSingle();

  const persona = locale === "he" ? HE_GRADER : EN_GRADER;
  const bodyText = (sub.body ?? "").slice(0, 12000);
  const links = [
    sub.file_url ? `file: ${sub.file_url}` : "",
    sub.video_url ? `video: ${sub.video_url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const ask =
    locale === "he"
      ? `מטלה: "${assignment?.title ?? "—"}".
${assignment?.instructions || assignment?.description ? `הנחיות המטלה: ${(assignment.instructions || assignment.description || "").slice(0, 2000)}` : ""}
סוג ההגשה: ${sub.submission_type}.
תוכן ההגשה:
"""
${bodyText || "(אין טקסט — הגשת קובץ/קישור)"}
"""
${links ? `קישורים: ${links}` : ""}
כתוב טיוטת משוב בונה לתלמיד. החזר טקסט בלבד.`
      : `Assignment: "${assignment?.title ?? "—"}".
${assignment?.instructions || assignment?.description ? `Assignment brief: ${(assignment.instructions || assignment.description || "").slice(0, 2000)}` : ""}
Submission type: ${sub.submission_type}.
Submission content:
"""
${bodyText || "(no text — file/link submission)"}
"""
${links ? `Links: ${links}` : ""}
Write a constructive feedback draft for the student. Return text only.`;

  let draft = "";
  let modelKey: "claude" | "gpt" | "gemini" | "grok" | "deepseek" | "mistral" | "llama" =
    "claude";
  try {
    const result = await aiGenerate(
      {
        system: persona,
        messages: [{ role: "user", content: ask }],
        maxTokens: 1024,
        effort: "medium",
      },
      "review",
    );
    draft = result.text.trim();
    modelKey = result.modelKey;
  } catch {
    return { error: t.aiFailed, configured: true };
  }

  if (!draft) return { error: t.aiFailed, configured: true };

  // Persist an ai_reviews row (best-effort; the draft is still returned even if
  // the audit insert is blocked). ai_reviews insert = is_member_of per RLS.
  let aiReviewId: string | undefined;
  try {
    const { data: review } = await supabase
      .from("ai_reviews")
      .insert({
        academy_id: academyId,
        submission_id: submissionId,
        model: modelKey,
        feedback: draft,
      })
      .select("id")
      .single();
    aiReviewId = review?.id;
  } catch {
    // non-fatal — grading still works without the audit row
  }

  return { draft, aiReviewId, configured: true };
}
