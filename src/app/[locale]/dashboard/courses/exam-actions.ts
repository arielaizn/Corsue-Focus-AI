"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { generateExam } from "@/lib/ai/exam-generator";
import { persistGeneratedExam } from "@/lib/data/quizzes";
import { aiConfigured, AiError } from "@/lib/ai";

/* ---------------------------------------------------------------------------
   AI EXAM GENERATOR (#13) — server action. Owner/admin/instructor only (RLS
   enforces it too). Generates a structured quiz via the LLM gateway and writes
   it to quizzes/questions/question_options.
--------------------------------------------------------------------------- */

export interface ExamGenState {
  error?: string;
  notice?: string;
  quizId?: string;
}

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

async function assertAuthor(academyId: string): Promise<boolean> {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("academy_id", academyId)
    .maybeSingle();
  return (
    data?.role === "owner" ||
    data?.role === "admin" ||
    data?.role === "instructor"
  );
}

const MSG = {
  he: {
    notConfigured: "מנוע ה-AI עדיין לא הוגדר (חסר מפתח API).",
    denied: "אין לך הרשאה ליצור מבחן באקדמיה זו.",
    topicRequired: "יש להזין נושא למבחן.",
    generic: "יצירת המבחן נכשלה. נסה שוב.",
    refused: "הבקשה נדחתה. נסח את הנושא אחרת.",
    saved: (n: number) => `נוצר מבחן עם ${n} שאלות. אפשר לערוך אותו.`,
  },
  en: {
    notConfigured: "The AI engine is not configured yet (missing API key).",
    denied: "You don't have permission to create exams in this academy.",
    topicRequired: "Please enter an exam topic.",
    generic: "Exam generation failed. Try again.",
    refused: "The request was declined. Rephrase the topic.",
    saved: (n: number) => `Created an exam with ${n} questions. You can edit it.`,
  },
} as const;

export async function generateExamAction(
  _prev: ExamGenState,
  formData: FormData,
): Promise<ExamGenState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = MSG[locale];

  if (!aiConfigured()) return { error: t.notConfigured };

  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const lessonId = str(formData.get("lessonId")) || null;
  const topic = str(formData.get("topic"));
  const countRaw = Number(str(formData.get("count")) || "5");
  const difficulty = str(formData.get("difficulty")) || "intermediate";

  if (!topic) return { error: t.topicRequired };
  if (!academyId || !courseId) return { error: t.generic };

  if (!(await assertAuthor(academyId))) return { error: t.denied };

  let exam;
  try {
    exam = await generateExam({
      topic,
      count: Number.isFinite(countRaw) ? countRaw : 5,
      language: locale,
      difficulty:
        difficulty === "beginner" || difficulty === "advanced"
          ? difficulty
          : "intermediate",
    });
  } catch (err) {
    if (err instanceof AiError && err.code === "refused") {
      return { error: t.refused };
    }
    if (err instanceof AiError && err.code === "not_configured") {
      return { error: t.notConfigured };
    }
    return { error: t.generic };
  }

  const res = await persistGeneratedExam({
    academyId,
    courseId,
    lessonId,
    exam,
  });

  if (!res.ok || !res.quizId) {
    return { error: res.code === "denied" ? t.denied : t.generic };
  }

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
  return { notice: t.saved(exam.questions.length), quizId: res.quizId };
}
