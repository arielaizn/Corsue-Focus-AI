import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";
import { isPlatformAdmin } from "@/lib/auth";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN DATA LAYER — cross-tenant reads for the /admin surface.

   DATA ACCESS (two tiers, per AGENTS rules):
   - DEFAULT: the user-scoped client `createClient(await cookies())`. The
     platform admin holds additive `*_admin_all` RLS bypass policies
     (migration 0007) on academies/courses/memberships/enrollments/payments/
     posts/comments/profiles/subscriptions/plans/academy_listings, so reads
     across ALL tenants succeed AS the admin (auditable, RLS-enforced).
   - SERVICE-ROLE (`createServiceClient`): ONLY for data NOT reachable via the
     public schema — i.e. auth.users emails. EVERY function that touches the
     service client first guards with `isPlatformAdmin()` (service bypasses ALL
     RLS), returning safe empties otherwise.

   Resilience: every read is wrapped in try/catch and degrades to a safe empty —
   the admin pages must always render. None of these functions throw.
--------------------------------------------------------------------------- */

async function adminClient() {
  return createClient(await cookies());
}

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export interface PlatformKpis {
  academies: number;
  users: number;
  courses: number;
  enrollments: number;
  revenue: number;
  admins: number;
  openReports: number;
}

const EMPTY_KPIS: PlatformKpis = {
  academies: 0,
  users: 0,
  courses: 0,
  enrollments: 0,
  revenue: 0,
  admins: 0,
  openReports: 0,
};

/** Count helper: returns 0 on any error/blocked read (page must always render). */
async function safeCount(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  build: (
    q: ReturnType<Awaited<ReturnType<typeof adminClient>>["from"]>,
  ) => PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number> {
  try {
    const { count, error } = await build(supabase.from("x" as never) as never);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Platform-wide KPI roll-up for the overview. Never throws. */
export async function getPlatformKpis(): Promise<PlatformKpis> {
  // Fail closed regardless of caller — cross-tenant read.
  if (!(await isPlatformAdmin())) return EMPTY_KPIS;
  try {
    const supabase = await adminClient();

    const [
      academies,
      courses,
      enrollments,
      admins,
      openReports,
      usersRes,
      revenue,
    ] = await Promise.all([
      supabase
        .from("academies")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .then((r) => (r.error ? 0 : r.count ?? 0))
        .then(undefined, () => 0),
      supabase
        .from("courses")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .then((r) => (r.error ? 0 : r.count ?? 0))
        .then(undefined, () => 0),
      supabase
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .then((r) => (r.error ? 0 : r.count ?? 0))
        .then(undefined, () => 0),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_platform_admin", true)
        .then((r) => (r.error ? 0 : r.count ?? 0))
        .then(undefined, () => 0),
      supabase
        .from("content_reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "open")
        .then((r) => (r.error ? 0 : r.count ?? 0))
        .then(undefined, () => 0),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .then((r) => (r.error ? 0 : r.count ?? 0))
        .then(undefined, () => 0),
      // Server-side aggregate (avoids the 1000-row PostgREST cap). Degrade to 0.
      supabase
        .rpc("platform_total_revenue")
        .then((r) => (r.error ? 0 : Number(r.data) || 0))
        .then(undefined, () => 0),
    ]);

    return {
      academies,
      courses,
      enrollments,
      admins,
      openReports,
      users: usersRes,
      revenue,
    };
  } catch {
    return EMPTY_KPIS;
  }
}

// ---------------------------------------------------------------------------
// Academies
// ---------------------------------------------------------------------------

export interface AdminAcademyRow {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string | null;
  status: "active" | "suspended";
  memberCount: number;
  courseCount: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface ListAcademiesResult {
  rows: AdminAcademyRow[];
  total: number;
}

export interface ListAcademiesArgs {
  q?: string;
  status?: "active" | "suspended" | "all";
  limit?: number;
  offset?: number;
}

/** List ALL academies (active + suspended) with owner email + counts. */
export async function listAcademies(
  args: ListAcademiesArgs = {},
): Promise<ListAcademiesResult> {
  const { q, status = "all", limit = 25, offset = 0 } = args;
  const empty: ListAcademiesResult = { rows: [], total: 0 };

  // Fail closed regardless of caller — cross-tenant read.
  if (!(await isPlatformAdmin())) return empty;

  try {
    const supabase = await adminClient();

    let query = supabase
      .from("academies")
      .select("id, name, slug, owner_id, created_at, deleted_at", {
        count: "exact",
      });

    if (status === "active") query = query.is("deleted_at", null);
    if (status === "suspended") query = query.not("deleted_at", "is", null);
    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      query = query.or(`name.ilike.${term},slug.ilike.${term}`);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !data) return empty;

    const academyIds = data.map((a) => a.id);
    const ownerIds = Array.from(new Set(data.map((a) => a.owner_id))).filter(
      Boolean,
    );

    // Per-academy member + course counts (best-effort), and owner emails.
    const [members, courses, emailByUser] = await Promise.all([
      countByAcademy(supabase, "memberships", academyIds),
      countByAcademy(supabase, "courses", academyIds, true),
      ownerEmails(ownerIds),
    ]);

    const rows: AdminAcademyRow[] = data.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      ownerEmail: emailByUser.get(a.owner_id) ?? null,
      status: a.deleted_at ? "suspended" : "active",
      memberCount: members.get(a.id) ?? 0,
      courseCount: courses.get(a.id) ?? 0,
      createdAt: a.created_at,
      deletedAt: a.deleted_at,
    }));

    return { rows, total: count ?? rows.length };
  } catch {
    return empty;
  }
}

/** Build a Map<academyId, count> for a child table. `live` filters deleted_at. */
async function countByAcademy(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  table: "memberships" | "courses",
  academyIds: string[],
  liveOnly = false,
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (academyIds.length === 0) return map;
  try {
    // Head+count per academy — avoids pulling rows (PostgREST caps at 1000).
    const entries = await Promise.all(
      academyIds.map(async (id) => {
        let qy = supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("academy_id", id);
        if (liveOnly && table === "courses") qy = qy.is("deleted_at", null);
        const { count } = await qy;
        return [id, count ?? 0] as const;
      }),
    );
    for (const [id, count] of entries) map.set(id, count);
    return map;
  } catch {
    return map;
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface AdminUserRow {
  id: string;
  email: string | null;
  displayName: string;
  isPlatformAdmin: boolean;
  academies: number;
  createdAt: string;
}

export interface ListUsersResult {
  rows: AdminUserRow[];
  total: number;
}

export interface ListUsersArgs {
  q?: string;
  limit?: number;
  offset?: number;
}

/**
 * List users with emails. Profiles (display name, admin flag, created_at) are
 * paginated AT THE DB LEVEL via the user-scoped admin-bypass client. Emails live
 * in auth.users (not the public schema), so we resolve them via ownerEmails()
 * (SERVICE client, GUARDED by isPlatformAdmin()) for ONLY the returned page.
 * Search is restricted to display_name (emails are not in profiles).
 */
export async function listUsers(
  args: ListUsersArgs = {},
): Promise<ListUsersResult> {
  const { q, limit = 25, offset = 0 } = args;
  const empty: ListUsersResult = { rows: [], total: 0 };

  // Service-role guard — emails are auth.users, reachable only via service.
  if (!(await isPlatformAdmin())) return empty;

  try {
    const supabase = await adminClient();

    // Pull profiles (the canonical user roster), paginated AT THE DB LEVEL so
    // we never undercount past the PostgREST 1000-row cap. Search is restricted
    // to display_name DB-side (emails live in auth.users, not in profiles).
    let query = supabase
      .from("profiles")
      .select("id, display_name, is_platform_admin, created_at", {
        count: "exact",
      });
    if (q && q.trim()) {
      query = query.ilike("display_name", `%${q.trim()}%`);
    }

    const {
      data: profiles,
      count,
      error,
    } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !profiles) return empty;

    const pageUserIds = profiles.map((p) => p.id);

    // Emails for ONLY the returned page (reuse the admin-guarded resolver).
    const emailById = await ownerEmails(pageUserIds);

    // Per-user academy membership counts — head+count per user on the page.
    const academyCount = new Map<string, number>();
    try {
      const entries = await Promise.all(
        pageUserIds.map(async (id) => {
          const { count: c } = await supabase
            .from("memberships")
            .select("id", { count: "exact", head: true })
            .eq("user_id", id);
          return [id, c ?? 0] as const;
        }),
      );
      for (const [id, c] of entries) academyCount.set(id, c);
    } catch {
      // ignore — counts default to 0.
    }

    const rows: AdminUserRow[] = profiles.map((p) => ({
      id: p.id,
      email: emailById.get(p.id) ?? null,
      displayName: p.display_name ?? "",
      isPlatformAdmin: p.is_platform_admin === true,
      academies: academyCount.get(p.id) ?? 0,
      createdAt: p.created_at,
    }));

    return { rows, total: count ?? rows.length };
  } catch {
    return empty;
  }
}

/** Resolve emails for a set of user ids (service-role, admin-guarded). */
async function ownerEmails(userIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (userIds.length === 0) return map;
  if (!(await isPlatformAdmin())) return map;
  try {
    const service = createServiceClient();
    const wanted = new Set(userIds);
    let page = 1;
    for (let i = 0; i < 5 && wanted.size > 0; i++) {
      const { data, error } = await service.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (error || !data) break;
      for (const u of data.users) {
        if (u.email && wanted.has(u.id)) {
          map.set(u.id, u.email);
          wanted.delete(u.id);
        }
      }
      if (data.users.length < 1000) break;
      page += 1;
    }
    return map;
  } catch {
    return map;
  }
}

// ---------------------------------------------------------------------------
// Moderation
// ---------------------------------------------------------------------------

export interface ModerationItem {
  reportId: string;
  academyId: string;
  academyName: string;
  entityType: "post" | "comment";
  entityId: string;
  excerpt: string;
  reason: string;
  reporterName: string;
  createdAt: string;
  status: "open" | "reviewing" | "actioned" | "dismissed";
}

export interface ListModerationArgs {
  status?: "open" | "reviewing" | "actioned" | "dismissed" | "all";
  limit?: number;
}

/** The cross-tenant content-report queue, enriched with academy + excerpt. */
export async function listModerationQueue(
  args: ListModerationArgs = {},
): Promise<ModerationItem[]> {
  const { status = "open", limit = 50 } = args;
  // Fail closed regardless of caller — cross-tenant read.
  if (!(await isPlatformAdmin())) return [];
  try {
    const supabase = await adminClient();

    let query = supabase
      .from("content_reports")
      .select(
        "id, academy_id, entity_type, entity_id, reason, reporter_id, status, created_at",
      );
    if (status !== "all") query = query.eq("status", status);

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) return [];

    const academyIds = Array.from(new Set(data.map((r) => r.academy_id)));
    const reporterIds = Array.from(new Set(data.map((r) => r.reporter_id)));
    const postIds = data
      .filter((r) => r.entity_type === "post")
      .map((r) => r.entity_id);
    const commentIds = data
      .filter((r) => r.entity_type === "comment")
      .map((r) => r.entity_id);

    const [academyNames, reporterNames, postBodies, commentBodies] =
      await Promise.all([
        lookupNames(supabase, "academies", academyIds, "name"),
        lookupNames(supabase, "profiles", reporterIds, "display_name"),
        lookupBodies(supabase, "posts", postIds),
        lookupBodies(supabase, "comments", commentIds),
      ]);

    return data.map((r) => {
      const raw =
        r.entity_type === "post"
          ? postBodies.get(r.entity_id) ?? ""
          : commentBodies.get(r.entity_id) ?? "";
      return {
        reportId: r.id,
        academyId: r.academy_id,
        academyName: academyNames.get(r.academy_id) ?? r.academy_id.slice(0, 8),
        entityType: (r.entity_type === "comment" ? "comment" : "post") as
          | "post"
          | "comment",
        entityId: r.entity_id,
        excerpt: raw.length > 140 ? `${raw.slice(0, 140)}…` : raw,
        reason: r.reason,
        reporterName: reporterNames.get(r.reporter_id) ?? "—",
        createdAt: r.created_at,
        status: r.status,
      };
    });
  } catch {
    return [];
  }
}

async function lookupNames(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  table: "academies" | "profiles",
  ids: string[],
  col: "name" | "display_name",
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (ids.length === 0) return map;
  try {
    const { data, error } = await supabase
      .from(table)
      .select(`id, ${col}`)
      .in("id", ids);
    if (error || !data) return map;
    for (const row of data as unknown as Record<string, string>[]) {
      map.set(row.id, row[col]);
    }
    return map;
  } catch {
    return map;
  }
}

async function lookupBodies(
  supabase: Awaited<ReturnType<typeof adminClient>>,
  table: "posts" | "comments",
  ids: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (ids.length === 0) return map;
  try {
    const { data, error } = await supabase
      .from(table)
      .select("id, body")
      .in("id", ids);
    if (error || !data) return map;
    for (const row of data as { id: string; body: string }[]) {
      map.set(row.id, row.body ?? "");
    }
    return map;
  } catch {
    return map;
  }
}

// ---------------------------------------------------------------------------
// System health
// ---------------------------------------------------------------------------

export interface PlanHealth {
  id: string;
  name: string;
  activeSubs: number;
}

export interface SystemHealth {
  plans: PlanHealth[];
  aiTokens: number;
  aiReviews: number;
  featureFlags: { key: string; enabled: boolean }[];
}

const EMPTY_HEALTH: SystemHealth = {
  plans: [],
  aiTokens: 0,
  aiReviews: 0,
  featureFlags: [],
};

/** Plans + active-subscription counts, AI usage proxy (sum of review tokens). */
export async function getSystemHealth(): Promise<SystemHealth> {
  // Fail closed regardless of caller — cross-tenant read.
  if (!(await isPlatformAdmin())) return EMPTY_HEALTH;
  try {
    const supabase = await adminClient();

    const [plansRes, subsRes, aiRes] = await Promise.all([
      supabase
        .from("plans")
        .select("id, name")
        .order("price_monthly", { ascending: true })
        .then((r) => r)
        .then(undefined, () => ({ data: [], error: true } as const)),
      supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("status", "active")
        .then((r) => r)
        .then(undefined, () => ({ data: [], error: true } as const)),
      supabase
        .from("ai_reviews")
        .select("token_count")
        .then((r) => r)
        .then(undefined, () => ({ data: [], error: true } as const)),
    ]);

    const subsByPlan = new Map<string, number>();
    if (!("error" in subsRes && subsRes.error)) {
      for (const s of (subsRes.data ?? []) as { plan_id: string }[]) {
        subsByPlan.set(s.plan_id, (subsByPlan.get(s.plan_id) ?? 0) + 1);
      }
    }

    const plans: PlanHealth[] =
      !("error" in plansRes && plansRes.error) && plansRes.data
        ? (plansRes.data as { id: string; name: string }[]).map((p) => ({
            id: p.id,
            name: p.name,
            activeSubs: subsByPlan.get(p.id) ?? 0,
          }))
        : [];

    let aiTokens = 0;
    let aiReviews = 0;
    if (!("error" in aiRes && aiRes.error) && aiRes.data) {
      const rows = aiRes.data as { token_count: number | null }[];
      aiReviews = rows.length;
      aiTokens = rows.reduce((sum, r) => sum + (Number(r.token_count) || 0), 0);
    }

    return {
      plans,
      aiTokens,
      aiReviews,
      // No dedicated feature-flag table; expose a static read-only set so the
      // System page renders a meaningful (and honest) panel.
      featureFlags: [
        { key: "ai_grading", enabled: true },
        { key: "communities", enabled: true },
        { key: "live_sessions", enabled: true },
        { key: "white_label", enabled: true },
      ],
    };
  } catch {
    return EMPTY_HEALTH;
  }
}

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

export interface BillingAcademyRevenue {
  academyId: string;
  name: string;
  revenue: number;
}

export interface RecentPayment {
  id: string;
  academyName: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
}

export interface BillingOverview {
  totalRevenue: number;
  currency: string;
  byAcademy: BillingAcademyRevenue[];
  recentPayments: RecentPayment[];
}

const EMPTY_BILLING: BillingOverview = {
  totalRevenue: 0,
  currency: "USD",
  byAcademy: [],
  recentPayments: [],
};

/** Platform revenue: total, per-academy breakdown, and the latest payments. */
export async function getBillingOverview(): Promise<BillingOverview> {
  // Fail closed regardless of caller — cross-tenant read.
  if (!(await isPlatformAdmin())) return EMPTY_BILLING;
  try {
    const supabase = await adminClient();

    // Per-academy revenue, pre-aggregated server-side (one row per academy) —
    // avoids the 1000-row PostgREST cap that silently undercounted at scale.
    const { data: rev } = await supabase
      .rpc("platform_revenue_by_academy")
      .then((r) => r)
      .then(undefined, () => ({ data: [] as never[] }));

    const revRows = (rev ?? []) as {
      academy_id: string;
      revenue: number;
      currency: string;
    }[];

    let totalRevenue = 0;
    let currency = "USD";
    const revByAcademy = new Map<string, number>();
    for (const p of revRows) {
      const amt = Number(p.revenue) || 0;
      totalRevenue += amt;
      revByAcademy.set(
        p.academy_id,
        (revByAcademy.get(p.academy_id) ?? 0) + amt,
      );
      if (p.currency) currency = p.currency;
    }

    // Latest payments (any status) for the activity feed.
    const { data: recent } = await supabase
      .from("payments")
      .select("id, academy_id, amount, currency, status, paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(15)
      .then((r) => r)
      .then(undefined, () => ({ data: [] as never[] }));

    const recentRows = (recent ?? []) as {
      id: string;
      academy_id: string;
      amount: number;
      currency: string;
      status: string;
      paid_at: string | null;
    }[];

    const academyIds = Array.from(
      new Set([
        ...Array.from(revByAcademy.keys()),
        ...recentRows.map((p) => p.academy_id),
      ]),
    );
    const names = await lookupNames(supabase, "academies", academyIds, "name");

    const byAcademy: BillingAcademyRevenue[] = Array.from(revByAcademy.entries())
      .map(([academyId, revenue]) => ({
        academyId,
        name: names.get(academyId) ?? academyId.slice(0, 8),
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const recentPayments: RecentPayment[] = recentRows.map((p) => ({
      id: p.id,
      academyName: names.get(p.academy_id) ?? p.academy_id.slice(0, 8),
      amount: Number(p.amount) || 0,
      currency: p.currency || currency,
      status: p.status,
      paidAt: p.paid_at,
    }));

    return { totalRevenue, currency, byAcademy, recentPayments };
  } catch {
    return EMPTY_BILLING;
  }
}
