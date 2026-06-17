"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { adminDict } from "@/lib/admin-dictionary";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN server actions. EVERY action calls requirePlatformAdmin
   FIRST (it redirects non-admins) — defense in depth on top of the route gate
   and the is_platform_admin() RLS bypass policies (migration 0007). Writes run
   AS the admin user via the *_admin_all policies; no service role here.
--------------------------------------------------------------------------- */

export interface AdminActionState {
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

export async function suspendAcademy(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const locale = resolveLocale(formData.get("locale"));
  await requirePlatformAdmin(locale);
  const academyId = str(formData.get("academyId"));
  const confirm = str(formData.get("confirm"));
  if (!academyId) return { error: adminDict[locale].errors.generic };

  const supabase = createClient(await cookies());
  // Require the typed confirmation to match the academy SLUG (the danger-zone
  // input shows the slug as its placeholder, so client + server agree).
  const { data: a } = await supabase
    .from("academies")
    .select("slug")
    .eq("id", academyId)
    .maybeSingle();
  if (!a || confirm !== a.slug) {
    return { error: adminDict[locale].academies.confirmSuspend };
  }

  const { error } = await supabase
    .from("academies")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", academyId)
    .select("id");
  if (error) return { error: adminDict[locale].errors.generic };

  revalidatePath(`/${locale}/admin/academies`);
  return { notice: adminDict[locale].common.saved };
}

export async function reinstateAcademy(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const locale = resolveLocale(formData.get("locale"));
  await requirePlatformAdmin(locale);
  const academyId = str(formData.get("academyId"));
  if (!academyId) return { error: adminDict[locale].errors.generic };

  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("academies")
    .update({ deleted_at: null })
    .eq("id", academyId)
    .select("id");
  if (error) return { error: adminDict[locale].errors.generic };

  revalidatePath(`/${locale}/admin/academies`);
  return { notice: adminDict[locale].common.saved };
}

export async function grantPlatformAdmin(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const locale = resolveLocale(formData.get("locale"));
  await requirePlatformAdmin(locale);
  const userId = str(formData.get("userId"));
  if (!userId) return { error: adminDict[locale].errors.generic };

  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("profiles")
    .update({ is_platform_admin: true })
    .eq("id", userId)
    .select("id");
  if (error) return { error: adminDict[locale].errors.generic };

  revalidatePath(`/${locale}/admin/users`);
  return { notice: adminDict[locale].common.saved };
}

export async function revokePlatformAdmin(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const locale = resolveLocale(formData.get("locale"));
  await requirePlatformAdmin(locale);
  const userId = str(formData.get("userId"));
  if (!userId) return { error: adminDict[locale].errors.generic };

  const supabase = createClient(await cookies());
  // Never remove the last platform admin.
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_platform_admin", true);
  if ((count ?? 0) <= 1) return { error: adminDict[locale].errors.lastAdmin };

  const { error } = await supabase
    .from("profiles")
    .update({ is_platform_admin: false })
    .eq("id", userId)
    .select("id");
  if (error) return { error: adminDict[locale].errors.generic };

  revalidatePath(`/${locale}/admin/users`);
  return { notice: adminDict[locale].common.saved };
}

export async function resolveReport(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const locale = resolveLocale(formData.get("locale"));
  await requirePlatformAdmin(locale);
  const reportId = str(formData.get("reportId"));
  const status = str(formData.get("status"));
  if (!reportId || (status !== "actioned" && status !== "dismissed")) {
    return { error: adminDict[locale].errors.generic };
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("content_reports")
    .update({ status })
    .eq("id", reportId)
    .select("id");
  if (error) return { error: adminDict[locale].errors.generic };

  revalidatePath(`/${locale}/admin/moderation`);
  return { notice: adminDict[locale].common.saved };
}

export async function moderateContent(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const locale = resolveLocale(formData.get("locale"));
  await requirePlatformAdmin(locale);
  const entityType = str(formData.get("entityType"));
  const entityId = str(formData.get("entityId"));
  const reportId = str(formData.get("reportId"));
  if ((entityType !== "post" && entityType !== "comment") || !entityId) {
    return { error: adminDict[locale].errors.generic };
  }

  const supabase = createClient(await cookies());
  const table = entityType === "post" ? "posts" : "comments";
  const { error } = await supabase
    .from(table)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", entityId)
    .select("id");
  if (error) return { error: adminDict[locale].errors.generic };

  // Mark the originating report as actioned, if supplied.
  if (reportId) {
    await supabase
      .from("content_reports")
      .update({ status: "actioned" })
      .eq("id", reportId);
  }

  revalidatePath(`/${locale}/admin/moderation`);
  return { notice: adminDict[locale].common.saved };
}
