import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  SLUG_RE,
  mapError,
  type Academy,
  type AcademyInsert,
  type AcademyUpdate,
  type AcademyFormValues,
  type MutationResult,
} from "./academies.shared";

// Re-export the isomorphic helpers/types/constants so existing server-side
// imports of "@/lib/data/academies" keep working unchanged. Client components
// must import from "@/lib/data/academies.shared" instead (no server-only).
export * from "./academies.shared";

async function client() {
  return createClient(await cookies());
}

/**
 * Read the academies the caller owns/admins (RLS-scoped, sourced via
 * memberships so it survives the seeded academies-select recursion). Returns
 * full rows where readable, else null. The page falls back to the membership
 * stub from getUserAndAcademies for display.
 */
export async function getAcademyById(id: string): Promise<Academy | null> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("academies")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

/**
 * Slug availability check, RLS-safe. Because the public `academies` select
 * policy can recurse, we issue a HEAD count scoped to the slug; a blocked read
 * returns `null` ("unknown") rather than a false "available".
 */
export async function isSlugAvailable(
  slug: string,
  exceptId?: string,
): Promise<boolean | null> {
  if (!SLUG_RE.test(slug)) return false;
  try {
    const supabase = await client();
    let q = supabase
      .from("academies")
      .select("id", { count: "exact", head: true })
      .eq("slug", slug);
    if (exceptId) q = q.neq("id", exceptId);
    const { count, error } = await q;
    if (error) return null;
    return (count ?? 0) === 0;
  } catch {
    return null;
  }
}

/**
 * Create an academy owned by the current user, then create the owner
 * membership row. RLS enforces owner_id = auth.uid(); we set it explicitly.
 */
export async function createAcademy(
  v: AcademyFormValues,
): Promise<MutationResult> {
  const supabase = await client();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, code: "denied" };

  const insert: AcademyInsert = {
    owner_id: user.id,
    name: v.name.trim(),
    slug: v.slug.trim(),
    description: v.description.trim() || null,
    locale: v.locale,
    currency: v.currency,
    timezone: v.timezone,
    white_label: v.white_label,
    brand_colors: { primary: v.brandPrimary, accent: v.brandAccent },
  };

  const { data: academy, error } = await supabase
    .from("academies")
    .insert(insert)
    .select("id")
    .single();

  if (error || !academy) return { ok: false, code: mapError(error?.message) };

  // Owner membership. Best-effort: the academy is the source of truth; if the
  // membership insert is blocked, the owner still owns the row (owner_id).
  const { error: memErr } = await supabase
    .from("memberships")
    .insert({ academy_id: academy.id, user_id: user.id, role: "owner" });

  // A duplicate membership (e.g. a DB trigger already created it) is fine.
  if (memErr && !/duplicate|unique/i.test(memErr.message)) {
    // Non-fatal: academy exists; surface success but caller can re-fetch.
  }

  return { ok: true, academyId: academy.id };
}

/** Update an existing academy (owner/admin only — RLS enforces it). */
export async function updateAcademy(
  id: string,
  v: AcademyFormValues,
): Promise<MutationResult> {
  const supabase = await client();

  const update: AcademyUpdate = {
    name: v.name.trim(),
    slug: v.slug.trim(),
    description: v.description.trim() || null,
    locale: v.locale,
    currency: v.currency,
    timezone: v.timezone,
    white_label: v.white_label,
    brand_colors: { primary: v.brandPrimary, accent: v.brandAccent },
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("academies")
    .update(update)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, code: mapError(error.message) };
  if (!data) return { ok: false, code: "denied" };
  return { ok: true, academyId: id };
}
