"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { TIMEZONE_OPTIONS } from "@/lib/data/academies.shared";
import type {
  AccountValues,
  AccountActionState,
  DeleteAcademyState,
} from "@/components/dashboard/settings/types";

/* ---------------------------------------------------------------------------
   SETTINGS — Server Actions.

   updateAccount: edits the signed-in user's OWN profiles row only. RLS allows
   `profiles UPDATE = own row only`, so we never pass an id — we resolve the
   user via auth.getUser() and key the update on it. A forged id is impossible.

   deleteAcademy: owner-only soft-delete (academies.deleted_at). We re-resolve
   the caller's membership role server-side AND require a typed name match, so a
   forged academy_id can't target a tenant the user doesn't own. RLS is the
   backstop (academies UPDATE = owner).
--------------------------------------------------------------------------- */

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function asLocale(v: FormDataEntryValue | null): "he" | "en" {
  return v === "en" ? "en" : "he";
}

function asTimezone(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v : "";
  return (TIMEZONE_OPTIONS as readonly string[]).includes(s)
    ? s
    : "Asia/Jerusalem";
}

async function clientFrom() {
  return createClient(await cookies());
}

/** Read the account fields off the form (echoed back on error). The
 *  `avatarKey` is filled by the caller from the authenticated user id. */
function readAccount(formData: FormData, avatarKey: string): AccountValues {
  return {
    display_name: str(formData.get("display_name")),
    bio: str(formData.get("bio")),
    locale: asLocale(formData.get("account_locale")),
    timezone: asTimezone(formData.get("timezone")),
    website_url: str(formData.get("website_url")),
    avatar_url: str(formData.get("avatar_url")),
    is_public: formData.get("is_public") === "on",
    avatarKey,
  };
}

/* ---------------------------- ACCOUNT ---------------------------------- */

export async function updateAccount(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const locale = resolveLocale(formData.get("locale"));

  const supabase = await clientFrom();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Resolve the user first so the echoed avatarKey is always the real id.
  const values = readAccount(formData, user?.id ?? "");

  if (!user) return { status: "error", error: "notSignedIn", values };
  if (!values.display_name) {
    return { status: "error", error: "nameRequired", values };
  }

  // Own-row update — RLS (profiles update = own row) enforces the boundary.
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: values.display_name,
      bio: values.bio || null,
      locale: values.locale,
      timezone: values.timezone,
      website_url: values.website_url || null,
      avatar_url: values.avatar_url || null,
      is_public: values.is_public,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { status: "error", error: "generic", values };

  // The profile feeds the dashboard greeting + sidebar across the layout.
  revalidatePath(`/${locale}/dashboard`, "layout");
  return { status: "success", savedAt: Date.now(), values };
}

/* ------------------------- DANGER: DELETE ACADEMY ----------------------- */

export async function deleteAcademy(
  _prev: DeleteAcademyState,
  formData: FormData,
): Promise<DeleteAcademyState> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = str(formData.get("academyId"));
  const expectedName = str(formData.get("academyName"));
  const typedName = str(formData.get("confirmName"));

  if (!academyId) return { status: "error", error: "generic" };

  const supabase = await clientFrom();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", error: "notSignedIn" };

  // Re-resolve role server-side: ONLY the owner may delete. (A forged
  // academy_id can't escalate — we read the caller's own membership row.)
  const { data: mem } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("academy_id", academyId)
    .maybeSingle();
  if (mem?.role !== "owner") return { status: "error", error: "notOwner" };

  // Typed-confirmation gate: the name must match exactly.
  if (!typedName || typedName !== expectedName) {
    return { status: "error", error: "confirmMismatch" };
  }

  const { error } = await supabase
    .from("academies")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", academyId);

  if (error) return { status: "error", error: "generic" };

  revalidatePath(`/${locale}/dashboard`, "layout");
  redirect(`/${locale}/dashboard`);
}
