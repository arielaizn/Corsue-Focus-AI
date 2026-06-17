"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { issueCertificate, addReview } from "@/lib/data/certificates";

/* ---------------------------------------------------------------------------
   COMPLETION server actions. Each re-derives the user server-side (the data
   layer does this internally via auth.getUser()) and NEVER trusts a client-
   passed user/academy id — issueCertificate() re-verifies enrollment
   completion and re-resolves the academy/enrollment from the DB before the
   service-role insert; addReview() re-resolves the academy_id from the
   enrollment. Visible strings localize via learnDict on the page.
--------------------------------------------------------------------------- */

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}
function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function num(v: FormDataEntryValue | null): number {
  const n = Number(typeof v === "string" ? v : "");
  return Number.isFinite(n) ? n : 0;
}

/**
 * Issue (or fetch) the completion certificate, then refresh the completion
 * page so the freshly-issued certificate card renders. The data layer guards
 * on enrollment.status='completed' and re-resolves ownership, so a stale/forged
 * academy/enrollment id can't mint a certificate.
 */
export async function issueCertificateAction(
  formData: FormData,
): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const enrollmentId = str(formData.get("enrollmentId"));
  if (!courseId) return;

  await issueCertificate({ academyId, courseId, enrollmentId });

  revalidatePath(`/${locale}/learn/c/${courseId}/complete`);
  revalidatePath(`/${locale}/learn/profile`);
}

/**
 * Save the student's star rating (+ optional note) for the course, then
 * refresh the completion page (which reflects the saved review). The data
 * layer clamps the rating to 1..5 and re-resolves the academy from the
 * enrollment; the write targets course_reviews (rating + body) and is RLS-
 * gated to an active OR completed enrollee (migration 0009 widened the write
 * policy).
 *
 * We do NOT silently swallow a denial: on {ok:false} we still revalidate the
 * completion page, then redirect back to it with a `?reviewError=<code>` so the
 * page can surface the failure instead of pretending the save succeeded.
 */
export async function submitReviewAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const rating = num(formData.get("rating"));
  const body = str(formData.get("body"));
  if (!courseId || rating < 1) return;

  const result = await addReview({
    academyId,
    courseId,
    rating,
    body: body || null,
  });

  revalidatePath(`/${locale}/learn/c/${courseId}/complete`);

  // Surface a failure instead of swallowing it: bounce back with the code so
  // the completion page can render a localized error notice.
  if (!result.ok) {
    redirect(
      `/${locale}/learn/c/${courseId}/complete?reviewError=${result.code ?? "error"}`,
    );
  }
}

/** Small helper used by the "back to courses" link as a form action fallback. */
export async function backToCoursesAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  redirect(`/${locale}/learn/courses`);
}
