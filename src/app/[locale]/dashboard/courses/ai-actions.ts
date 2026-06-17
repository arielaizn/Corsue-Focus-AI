"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { generateCourseOutline } from "@/lib/ai/course-generator";
import { persistGeneratedCourse } from "@/lib/data/courses";
import { aiConfigured, AiError } from "@/lib/ai";

/* ---------------------------------------------------------------------------
   AI COURSE GENERATOR (#3) — server action. Owner/admin/instructor only.
   Prompt -> full course (modules + lessons) -> redirect into the builder.
--------------------------------------------------------------------------- */

export interface CourseGenState {
  error?: string;
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
    denied: "אין לך הרשאה ליצור קורס באקדמיה זו.",
    topicRequired: "יש להזין נושא לקורס.",
    generic: "יצירת הקורס נכשלה. נסה שוב.",
    refused: "הבקשה נדחתה. נסח את הנושא אחרת.",
  },
  en: {
    notConfigured: "The AI engine is not configured yet (missing API key).",
    denied: "You don't have permission to create courses in this academy.",
    topicRequired: "Please enter a course topic.",
    generic: "Course generation failed. Try again.",
    refused: "The request was declined. Rephrase the topic.",
  },
} as const;

function asAudience(v: string): "beginners" | "intermediate" | "advanced" {
  return v === "intermediate" || v === "advanced" ? v : "beginners";
}

export async function generateCourseAction(
  _prev: CourseGenState,
  formData: FormData,
): Promise<CourseGenState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = MSG[locale];

  if (!aiConfigured()) return { error: t.notConfigured };

  const academyId = str(formData.get("academyId"));
  const topic = str(formData.get("topic"));
  const audience = asAudience(str(formData.get("audience")));
  const moduleCount = Number(str(formData.get("moduleCount")) || "5");
  const lessonsPerModule = Number(str(formData.get("lessonsPerModule")) || "4");

  if (!topic) return { error: t.topicRequired };
  if (!academyId) return { error: t.generic };
  if (!(await assertAuthor(academyId))) return { error: t.denied };

  let course;
  try {
    course = await generateCourseOutline({
      topic,
      language: locale,
      audience,
      moduleCount: Number.isFinite(moduleCount) ? moduleCount : 5,
      lessonsPerModule: Number.isFinite(lessonsPerModule)
        ? lessonsPerModule
        : 4,
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

  const res = await persistGeneratedCourse({ academyId, course });
  if (!res.ok || !res.courseId) {
    return { error: res.code === "denied" ? t.denied : t.generic };
  }

  revalidatePath(`/${locale}/dashboard/courses`);
  redirect(`/${locale}/dashboard/courses/${res.courseId}?academy=${academyId}`);
}
