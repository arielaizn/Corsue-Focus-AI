"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { aiGenerate, aiConfigured } from "@/lib/ai/gateway";
import { getAcademyMetrics, type AcademyMetrics } from "@/lib/data/analytics";
import { analyticsDict } from "@/components/dashboard/analytics/dict";

/* ---------------------------------------------------------------------------
   ANALYTICS — Server Actions. The AI Business Advisor runs AS the logged-in
   user; we re-resolve their membership role server-side (owner/admin only) so a
   forged academy_id can't surface another tenant's numbers. The advisor only
   ever sees aggregate metrics for the caller's own academy.
--------------------------------------------------------------------------- */

export interface AdvisorState {
  answer?: string;
  error?: string;
  /** Echo the question so the panel can render the exchange. */
  question?: string;
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

/** Confirm the caller is an owner/admin of the academy. */
async function assertWriter(academyId: string): Promise<boolean> {
  const supabase = await clientFrom();
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

const HE_PERSONA = `אתה יועץ עסקי לבעלי אקדמיות אונליין, מנוסה בצמיחה, תמחור, שימור והמרה.
- ענה בעברית רהוטה וטבעית, לא תרגומית. בלי "עברית של AI".
- אסור: "לא רק X אלא גם Y", "בעולם של היום", "חשוב לציין", "בואו נצלול", מקפים ארוכים (—).
- בסס כל אבחנה על המספרים שניתנו לך. אם נתון חסר או אפס, אמור זאת בכנות.
- מבנה התשובה: אבחנה קצרה (משפט-שניים), ואז 2-3 פעולות קונקרטיות וברות-ביצוע, ממוספרות.
- היה ישיר וחד. בלי הקדמות, בלי דיסקליימרים, בלי לחזור על השאלה.`;

const EN_PERSONA = `You are a business advisor for online academy owners, expert in growth, pricing, retention, and conversion.
- Answer in clear, natural English. Be direct and concrete.
- Ground every observation in the numbers given. If a figure is missing or zero, say so honestly.
- Structure: a one or two sentence diagnosis, then 2-3 concrete, numbered, actionable moves.
- No preamble, no disclaimers, do not repeat the question back.`;

function fmtMonthSeries(
  series: { month: string; amount?: number; count?: number }[],
): string {
  return series
    .map((s) => `${s.month}: ${s.amount ?? s.count ?? 0}`)
    .join(", ");
}

/** Render the academy's real metrics into a compact context block for the LLM. */
function buildContext(m: AcademyMetrics, locale: Locale): string {
  const top =
    m.topCourses.length > 0
      ? m.topCourses.map((c) => `${c.title} (${c.enrolled})`).join(", ")
      : locale === "he"
        ? "אין נתונים"
        : "none";

  if (locale === "he") {
    return `נתוני האקדמיה (אמיתיים, מצטברים):
- תלמידים: ${m.students} (פעילים: ${m.activeStudents})
- קורסים: ${m.courses} (מתוכם מפורסמים: ${m.publishedCourses})
- הרשמות: ${m.enrollments}, השלמות: ${m.completions}, שיעור השלמה: ${m.completionRate}%
- הכנסות (תשלומים שאושרו): ${m.revenue} ${m.currency}
- הכנסות לפי חודש: ${fmtMonthSeries(m.revenueByMonth)}
- הרשמות לפי חודש: ${fmtMonthSeries(m.enrollmentsByMonth)}
- קורסים מובילים (נרשמים): ${top}`;
  }
  return `Academy data (real, cumulative):
- Students: ${m.students} (active: ${m.activeStudents})
- Courses: ${m.courses} (published: ${m.publishedCourses})
- Enrollments: ${m.enrollments}, completions: ${m.completions}, completion rate: ${m.completionRate}%
- Revenue (succeeded payments): ${m.revenue} ${m.currency}
- Revenue by month: ${fmtMonthSeries(m.revenueByMonth)}
- Enrollments by month: ${fmtMonthSeries(m.enrollmentsByMonth)}
- Top courses (enrollments): ${top}`;
}

/**
 * Ask the AI Business Advisor a question. Pulls the academy's REAL metrics as
 * context and calls the gateway with task "analysis". Owner/admin only; degrades
 * gracefully when no provider key is configured.
 */
export async function askAdvisor(
  _prev: AdvisorState,
  formData: FormData,
): Promise<AdvisorState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = analyticsDict[locale].advisor;
  const academyId = str(formData.get("academyId"));
  const question = str(formData.get("question"));

  if (!academyId) return { error: t.error };
  if (!question) return { error: t.error, question };

  if (!aiConfigured()) {
    return { error: t.disabledBody, question };
  }

  // Re-resolve authority server-side — a forged academy_id must not leak another
  // tenant's numbers to the advisor.
  const ok = await assertWriter(academyId);
  if (!ok) return { error: t.error, question };

  const metrics = await getAcademyMetrics(academyId);
  const context = buildContext(metrics, locale);
  const persona = locale === "he" ? HE_PERSONA : EN_PERSONA;

  const ask =
    locale === "he"
      ? `${context}\n\nשאלת בעל האקדמיה: "${question}"\n\nתן אבחנה והמלצות מעשיות בהתבסס על המספרים בלבד.`
      : `${context}\n\nThe owner asks: "${question}"\n\nGive a diagnosis and actionable recommendations grounded only in these numbers.`;

  try {
    const result = await aiGenerate(
      {
        system: persona,
        messages: [{ role: "user", content: ask }],
        maxTokens: 900,
        effort: "medium",
      },
      "analysis",
    );
    const answer = result.text.trim();
    if (!answer) return { error: t.error, question };
    return { answer, question };
  } catch {
    return { error: t.error, question };
  }
}
