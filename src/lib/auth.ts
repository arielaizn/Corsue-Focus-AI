import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import type { Database } from "@/types/database.types";

export type Academy = Database["public"]["Tables"]["academies"]["Row"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Role = Database["public"]["Enums"]["role_enum"];

/** A membership joined with its academy — the unit the dashboard switches on. */
export interface MembershipWithAcademy {
  role: Role;
  academy: Academy;
}

/** Resolve the current authenticated user (or null). Always use getUser(), never getSession(). */
export async function getUser(): Promise<User | null> {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * A minimal academy shape the dashboard always has, even if the full
 * `academies` row can't be read (see note below). The `id`, `role` and a
 * display `name` are always present.
 */
function stubAcademy(id: string): Academy {
  // Synthesized when the academies row is unreadable. Only id/name are real
  // (id from the membership); the rest are sane defaults a feature agent can
  // overwrite once the DB policy is fixed.
  return {
    id,
    name: "Academy",
    slug: id.slice(0, 8),
    owner_id: "",
    brand_colors: {},
    cover_url: null,
    created_at: new Date(0).toISOString(),
    currency: "USD",
    custom_domain: null,
    deleted_at: null,
    description: null,
    favicon_url: null,
    hide_platform_badge: false,
    locale: "he",
    logo_url: null,
    max_students: null,
    meta_description: null,
    meta_title: null,
    plan_id: null,
    timezone: "UTC",
    updated_at: new Date(0).toISOString(),
    white_label: false,
  };
}

/**
 * Load the current user + their academies (via memberships, RLS-scoped) and
 * their profile. Returns nulls when signed out — callers decide whether to
 * redirect.
 *
 * NOTE (live-DB caveat, 2026-06): the seeded RLS policies on `academies`,
 * `academy_listings`, and `courses` currently raise "infinite recursion
 * detected in policy". We therefore source the tenant set from `memberships`
 * (which reads cleanly), then best-effort enrich each with its full
 * `academies` row; on any read error we fall back to a membership-derived
 * stub so the dashboard always renders. Fixing the DB policy upgrades this
 * transparently — no app change needed.
 */
export async function getUserAndAcademies(): Promise<{
  user: User | null;
  profile: Profile | null;
  memberships: MembershipWithAcademy[];
}> {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, memberships: [] };

  // memberships + profiles read cleanly under RLS.
  const [memRes, profRes] = await Promise.all([
    supabase
      .from("memberships")
      .select("role, academy_id, user_id")
      .eq("user_id", user.id)
      .order("joined_at", { ascending: true }),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);

  const memRows = memRes.data ?? [];

  // Best-effort enrich with the full academies row (graceful on RLS recursion).
  const memberships: MembershipWithAcademy[] = await Promise.all(
    memRows.map(async (m) => {
      let academy = stubAcademy(m.academy_id);
      try {
        const { data } = await supabase
          .from("academies")
          .select("*")
          .eq("id", m.academy_id)
          .maybeSingle();
        if (data) academy = data;
      } catch {
        // keep the stub
      }
      return { role: m.role, academy };
    }),
  );

  return { user, profile: profRes.data ?? null, memberships };
}

/** Count rows for a table, returning `null` if the read is blocked (so the UI
 *  can show "—" instead of throwing). RLS-scoped via the user session. */
export async function safeCount(
  apply: (
    supabase: Awaited<ReturnType<typeof clientFromCookies>>,
  ) => PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number | null> {
  try {
    const supabase = await clientFromCookies();
    const { count, error } = await apply(supabase);
    if (error) return null;
    return count ?? null;
  } catch {
    return null;
  }
}

async function clientFromCookies() {
  return createClient(await cookies());
}

/**
 * Guard a server route: returns the user, or redirects to the locale login
 * with a `next` param. Use at the top of dashboard server components/layouts.
 */
export async function requireUser(
  locale: string,
  next?: string,
): Promise<User> {
  const user = await getUser();
  if (!user) {
    const loc: Locale = isLocale(locale) ? locale : defaultLocale;
    const target = next ? `?next=${encodeURIComponent(next)}` : "";
    redirect(`/${loc}/login${target}`);
  }
  return user;
}
