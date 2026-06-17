"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   SETTINGS server action. Re-derives the user server-side via auth.getUser()
   and NEVER trusts a client-passed user id — the update is RLS-scoped to the
   signed-in row (profiles policy: id = auth.uid()).

   Form-action shape `(formData) => Promise<void>` so it binds directly to a
   <form action> with full progressive enhancement (no client JS required). On
   success it redirects to the chosen locale's settings page with ?saved=1 (the
   RSC reads that to confirm). Locale changes are honoured by redirecting under
   the new locale segment — the app routes language purely by the URL path.
--------------------------------------------------------------------------- */

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}

/**
 * Update the signed-in learner's profile row: display_name, avatar_url, locale.
 * - display_name is required (the column is NOT NULL); a blank submit is ignored
 *   for that field so we never wipe an existing name.
 * - avatar_url accepts an http(s) URL or is cleared when emptied.
 * - locale persists the UI language preference; we then redirect to the chosen
 *   locale's settings path (language routing is URL-based).
 */
export async function updateProfileAction(formData: FormData): Promise<void> {
  // The locale the page is CURRENTLY rendered under (for revalidatePath).
  const currentLocale = resolveLocale(formData.get("currentLocale"));
  // The locale the user PICKED in the language selector.
  const chosen = resolveLocale(formData.get("locale"));
  const chosenLocale: Locale = locales.includes(chosen) ? chosen : defaultLocale;

  let ok = false;
  try {
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const displayName = str(formData.get("displayName")).slice(0, 80);
      const avatarRaw = str(formData.get("avatarUrl"));
      const avatarUrl =
        avatarRaw === ""
          ? null
          : /^https?:\/\//i.test(avatarRaw)
            ? avatarRaw.slice(0, 2048)
            : undefined; // invalid → leave unchanged

      const patch: {
        locale: Locale;
        display_name?: string;
        avatar_url?: string | null;
      } = { locale: chosenLocale };
      if (displayName) patch.display_name = displayName;
      if (avatarUrl !== undefined) patch.avatar_url = avatarUrl;

      const { error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id);
      ok = !error;

      if (ok) {
        // Refresh the chrome (topbar avatar/name) + the settings surface.
        revalidatePath(`/${currentLocale}/learn`, "layout");
      }
    }
  } catch {
    ok = false;
  }

  // Redirect lives OUTSIDE the try (redirect() throws by design). Carries the
  // result so the RSC can confirm the save or surface a gentle error.
  redirect(`/${chosenLocale}/learn/settings?${ok ? "saved=1" : "error=1"}`);
}
