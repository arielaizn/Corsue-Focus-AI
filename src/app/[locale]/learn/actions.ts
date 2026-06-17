"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  enroll,
  markLessonProgress,
  completeLesson,
  addNote,
  deleteNote,
  toggleBookmark,
} from "@/lib/data/learn";

/* ---------------------------------------------------------------------------
   LEARNER server actions. Each re-derives the user server-side (the data layer
   does this internally) and NEVER trusts a client-passed user/academy id.
   Visible strings localize via learnDict.
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
 * Enroll the current user in a course, then open the player. Idempotent: a
 * duplicate (already enrolled) still routes the learner into the course.
 * Form-action shape `(formData) => Promise<void>` so it binds to <form action>.
 */
export async function enrollAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  if (!academyId || !courseId) return;

  const res = await enroll(academyId, courseId);

  // Denied/errored (e.g. a paid course self-enroll, which is gated server-side
  // since RLS can't see price) → do NOT open the player. Send the learner back
  // to the storefront course page (or the catalog if the slug is unknown).
  if (!res.ok) {
    redirect(
      res.academySlug
        ? `/${locale}/a/${res.academySlug}/c/${courseId}`
        : `/${locale}/learn/courses`,
    );
  }

  revalidatePath(`/${locale}/learn`);
  revalidatePath(`/${locale}/learn/courses`);
  redirect(`/${locale}/learn/c/${courseId}`);
}

/**
 * Record watch progress (position + percent). Used by the player heartbeat.
 * Reads lessonId/positionS/watchPercent from the form.
 */
export async function markProgressAction(formData: FormData): Promise<void> {
  const lessonId = str(formData.get("lessonId"));
  if (!lessonId) return;
  await markLessonProgress({
    lessonId,
    positionS: num(formData.get("positionS")),
    watchPercent: num(formData.get("watchPercent")),
  });
}

/** Mark a lesson complete + award XP, then refresh the course views. */
export async function completeLessonAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const courseId = str(formData.get("courseId"));
  const lessonId = str(formData.get("lessonId"));
  if (!lessonId) return;

  await completeLesson(lessonId);

  revalidatePath(`/${locale}/learn`);
  revalidatePath(`/${locale}/learn/courses`);
  if (courseId) revalidatePath(`/${locale}/learn/c/${courseId}`);
}

/** Add a note to the current lesson. */
export async function addNoteAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const courseId = str(formData.get("courseId"));
  const lessonId = str(formData.get("lessonId"));
  const body = str(formData.get("body"));
  const posRaw = formData.get("positionS");
  if (!lessonId || !body) return;

  await addNote({
    lessonId,
    body,
    positionS: posRaw == null || posRaw === "" ? null : num(posRaw),
  });

  if (courseId) revalidatePath(`/${locale}/learn/c/${courseId}`);
}

/** Delete one of the user's notes. */
export async function deleteNoteAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const courseId = str(formData.get("courseId"));
  const noteId = str(formData.get("noteId"));
  if (!noteId) return;

  await deleteNote(noteId);

  if (courseId) revalidatePath(`/${locale}/learn/c/${courseId}`);
}

/** Toggle a lesson bookmark (timestamped when positionS is supplied). */
export async function toggleBookmarkAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const courseId = str(formData.get("courseId"));
  const lessonId = str(formData.get("lessonId"));
  const posRaw = formData.get("positionS");
  const label = str(formData.get("label"));
  if (!lessonId) return;

  await toggleBookmark({
    lessonId,
    positionS: posRaw == null || posRaw === "" ? null : num(posRaw),
    label: label || null,
  });

  if (courseId) revalidatePath(`/${locale}/learn/c/${courseId}`);
}
