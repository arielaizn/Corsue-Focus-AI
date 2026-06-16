"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { coursesDict } from "@/components/dashboard/courses/dictionary";
import {
  COURSE_TYPES,
  CONTENT_TYPES,
  type CourseType,
  type ContentType,
} from "@/lib/data/courses";

/* ---------------------------------------------------------------------------
   COURSE BUILDER — Server Actions. All writes run AS the logged-in user; RLS
   enforces that only owners/admins of the academy can mutate. Every insert
   sets academy_id explicitly. We re-resolve the active membership server-side
   so a forged academy_id can't target a tenant the user isn't in.
--------------------------------------------------------------------------- */

export interface CourseActionState {
  error?: string;
  notice?: string;
}

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function asCourseType(v: FormDataEntryValue | null): CourseType {
  const s = typeof v === "string" ? v : "";
  return (COURSE_TYPES as readonly string[]).includes(s)
    ? (s as CourseType)
    : "free";
}

function asContentType(v: FormDataEntryValue | null): ContentType {
  const s = typeof v === "string" ? v : "";
  return (CONTENT_TYPES as readonly string[]).includes(s)
    ? (s as ContentType)
    : "text";
}

/** Parse a price into a non-negative number, or null when blank/invalid. */
function asPrice(v: FormDataEntryValue | null): number | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/** Slugify a title; append a short random suffix for uniqueness. */
function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `course-${suffix}`;
}

/**
 * Confirm the user is an owner/admin (writer) of the academy and return a
 * server client. Throws-via-return is avoided: callers check the boolean.
 */
async function assertWriter(
  academyId: string,
): Promise<{ ok: boolean; supabase: Awaited<ReturnType<typeof clientFrom>> }> {
  const supabase = await clientFrom();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, supabase };

  const { data } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("academy_id", academyId)
    .maybeSingle();

  const ok = data?.role === "owner" || data?.role === "admin";
  return { ok, supabase };
}

async function clientFrom() {
  return createClient(await cookies());
}

/* ---------------------------- COURSE ----------------------------------- */

export async function createCourse(
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = coursesDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const title = str(formData.get("title"));
  const description = str(formData.get("description"));
  const courseType = asCourseType(formData.get("courseType"));
  const price = courseType === "free" ? null : asPrice(formData.get("price"));

  if (!title) return { error: t.titleRequired };
  if (!academyId) return { error: t.generic };

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.notOwner };

  const { data, error } = await supabase
    .from("courses")
    .insert({
      academy_id: academyId,
      title,
      slug: slugify(title),
      short_desc: description || null,
      description: description || null,
      course_type: courseType,
      price,
    })
    .select("id")
    .single();

  if (error || !data) return { error: t.generic };

  revalidatePath(`/${locale}/dashboard/courses`);
  redirect(`/${locale}/dashboard/courses/${data.id}?academy=${academyId}`);
}

export async function updateCourse(
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = coursesDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const title = str(formData.get("title"));
  const description = str(formData.get("description"));
  const courseType = asCourseType(formData.get("courseType"));
  const price = courseType === "free" ? null : asPrice(formData.get("price"));
  const isPublished = formData.get("isPublished") === "on";

  if (!title) return { error: t.titleRequired };
  if (!academyId || !courseId) return { error: t.generic };

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.notOwner };

  const { error } = await supabase
    .from("courses")
    .update({
      title,
      short_desc: description || null,
      description: description || null,
      course_type: courseType,
      price,
      is_published: isPublished,
    })
    .eq("id", courseId)
    .eq("academy_id", academyId);

  if (error) return { error: t.generic };

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
  revalidatePath(`/${locale}/dashboard/courses`);
  return { notice: coursesDict[locale].builder.saved };
}

export async function deleteCourse(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  if (!academyId || !courseId) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  await supabase
    .from("courses")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", courseId)
    .eq("academy_id", academyId);

  revalidatePath(`/${locale}/dashboard/courses`);
  redirect(`/${locale}/dashboard/courses?academy=${academyId}`);
}

/* ---------------------------- MODULE ----------------------------------- */

export async function createModule(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const title = str(formData.get("title"));
  if (!academyId || !courseId || !title) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  // Append at the end: next position = current max + 1.
  const { data: last } = await supabase
    .from("modules")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;

  await supabase.from("modules").insert({
    academy_id: academyId,
    course_id: courseId,
    title,
    position,
  });

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

export async function renameModule(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const moduleId = str(formData.get("moduleId"));
  const title = str(formData.get("title"));
  if (!academyId || !moduleId || !title) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  await supabase
    .from("modules")
    .update({ title })
    .eq("id", moduleId)
    .eq("academy_id", academyId);

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

export async function deleteModule(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const moduleId = str(formData.get("moduleId"));
  if (!academyId || !moduleId) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  // Soft-delete the module's lessons, then hard-delete the module.
  await supabase
    .from("lessons")
    .update({ deleted_at: new Date().toISOString() })
    .eq("module_id", moduleId)
    .eq("academy_id", academyId);

  await supabase
    .from("modules")
    .delete()
    .eq("id", moduleId)
    .eq("academy_id", academyId);

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

/** Swap a module's position with its neighbour (up/down). */
export async function moveModule(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const moduleId = str(formData.get("moduleId"));
  const dir = str(formData.get("direction")); // "up" | "down"
  if (!academyId || !courseId || !moduleId) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  const { data: mods } = await supabase
    .from("modules")
    .select("id, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });
  if (!mods) return;

  const idx = mods.findIndex((m) => m.id === moduleId);
  if (idx === -1) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= mods.length) return;

  const a = mods[idx];
  const b = mods[swapWith];
  await Promise.all([
    supabase
      .from("modules")
      .update({ position: b.position })
      .eq("id", a.id)
      .eq("academy_id", academyId),
    supabase
      .from("modules")
      .update({ position: a.position })
      .eq("id", b.id)
      .eq("academy_id", academyId),
  ]);

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

/* ---------------------------- LESSON ----------------------------------- */

export async function createLesson(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const moduleId = str(formData.get("moduleId"));
  const title = str(formData.get("title"));
  const contentType = asContentType(formData.get("contentType"));
  const body = str(formData.get("body"));
  const mediaUrl = str(formData.get("mediaUrl"));
  if (!academyId || !courseId || !moduleId || !title) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  const { data: last } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .is("deleted_at", null)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;

  await supabase.from("lessons").insert({
    academy_id: academyId,
    course_id: courseId,
    module_id: moduleId,
    title,
    content_type: contentType,
    body: body || null,
    media_url: mediaUrl || null,
    position,
  });

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

export async function updateLesson(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const lessonId = str(formData.get("lessonId"));
  const title = str(formData.get("title"));
  const contentType = asContentType(formData.get("contentType"));
  const body = str(formData.get("body"));
  const mediaUrl = str(formData.get("mediaUrl"));
  if (!academyId || !lessonId || !title) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  await supabase
    .from("lessons")
    .update({
      title,
      content_type: contentType,
      body: body || null,
      media_url: mediaUrl || null,
    })
    .eq("id", lessonId)
    .eq("academy_id", academyId);

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

export async function deleteLesson(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const lessonId = str(formData.get("lessonId"));
  if (!academyId || !lessonId) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  await supabase
    .from("lessons")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", lessonId)
    .eq("academy_id", academyId);

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}

/** Swap a lesson's position with its neighbour within the same module. */
export async function moveLesson(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const courseId = str(formData.get("courseId"));
  const moduleId = str(formData.get("moduleId"));
  const lessonId = str(formData.get("lessonId"));
  const dir = str(formData.get("direction"));
  if (!academyId || !courseId || !moduleId || !lessonId) return;

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return;

  const { data: rows } = await supabase
    .from("lessons")
    .select("id, position")
    .eq("module_id", moduleId)
    .is("deleted_at", null)
    .order("position", { ascending: true });
  if (!rows) return;

  const idx = rows.findIndex((l) => l.id === lessonId);
  if (idx === -1) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[idx];
  const b = rows[swapWith];
  await Promise.all([
    supabase
      .from("lessons")
      .update({ position: b.position })
      .eq("id", a.id)
      .eq("academy_id", academyId),
    supabase
      .from("lessons")
      .update({ position: a.position })
      .eq("id", b.id)
      .eq("academy_id", academyId),
  ]);

  revalidatePath(`/${locale}/dashboard/courses/${courseId}`);
}
