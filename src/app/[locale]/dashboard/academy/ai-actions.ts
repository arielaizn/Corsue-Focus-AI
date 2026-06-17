"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { generateAcademyPlan } from "@/lib/ai/academy-builder";
import { persistAcademyPlan } from "@/lib/data/courses";
import { aiConfigured, AiError } from "@/lib/ai";

/* ---------------------------------------------------------------------------
   AI ACADEMY BUILDER (#2) — server action. Owner/admin only.
   Prompt -> categories + courses (+ modules + lessons) + pricing -> catalog.
--------------------------------------------------------------------------- */

export interface AcademyBuildState {
  error?: string;
}

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}
function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

async function assertOwnerAdmin(academyId: string): Promise<boolean> {
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
  return data?.role === "owner" || data?.role === "admin";
}

const MSG = {
  he: {
    notConfigured: "מנוע ה-AI עדיין לא הוגדר (חסר מפתח API).",
    denied: "רק בעלים ומנהלים יכולים לבנות קטלוג אקדמיה.",
    promptRequired: "יש לתאר את האקדמיה.",
    generic: "בניית האקדמיה נכשלה. נסה שוב.",
    refused: "הבקשה נדחתה. נסח אחרת.",
  },
  en: {
    notConfigured: "The AI engine is not configured yet (missing API key).",
    denied: "Only owners and admins can build an academy catalog.",
    promptRequired: "Please describe the academy.",
    generic: "Academy build failed. Try again.",
    refused: "The request was declined. Rephrase it.",
  },
} as const;

export async function buildAcademyAction(
  _prev: AcademyBuildState,
  formData: FormData,
): Promise<AcademyBuildState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = MSG[locale];

  if (!aiConfigured()) return { error: t.notConfigured };

  const academyId = str(formData.get("academyId"));
  const prompt = str(formData.get("prompt"));
  const currency = str(formData.get("currency")) || "ILS";

  if (!prompt) return { error: t.promptRequired };
  if (!academyId) return { error: t.generic };
  if (!(await assertOwnerAdmin(academyId))) return { error: t.denied };

  let plan;
  try {
    plan = await generateAcademyPlan({ prompt, language: locale, currency });
  } catch (err) {
    if (err instanceof AiError && err.code === "refused") return { error: t.refused };
    if (err instanceof AiError && err.code === "not_configured")
      return { error: t.notConfigured };
    return { error: t.generic };
  }

  const res = await persistAcademyPlan({ academyId, plan, currency });
  if (!res.ok) {
    return { error: res.code === "denied" ? t.denied : t.generic };
  }

  revalidatePath(`/${locale}/dashboard/courses`);
  revalidatePath(`/${locale}/dashboard`, "layout");
  redirect(`/${locale}/dashboard/courses?academy=${academyId}`);
}
