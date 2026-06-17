import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/* ---------------------------------------------------------------------------
   ANALYTICS DATA LAYER — real, RLS-scoped metrics for the owner/admin
   analytics page. Every read runs AS the logged-in user; RLS confines it to
   academies the caller belongs to. We additionally filter every query by the
   active `academy_id` so a single tenant's numbers never bleed.

   Resilience is a first-class concern: the seeded RLS policies can intermittently
   raise "infinite recursion" on some tables (see lib/auth.ts note), so each
   sub-query is independently guarded and degrades to a safe zero — the page must
   always render. `getAcademyMetrics` never throws.
--------------------------------------------------------------------------- */

export interface MonthBucket {
  /** ISO `YYYY-MM` key (sortable). */
  month: string;
  amount: number;
}

export interface MonthCount {
  month: string;
  count: number;
}

export interface TopCourse {
  title: string;
  enrolled: number;
}

export interface AcademyMetrics {
  students: number;
  /** Students with at least one in_progress/completed lesson (engaged learners). */
  activeStudents: number;
  courses: number;
  publishedCourses: number;
  enrollments: number;
  completions: number;
  /** 0..100, rounded. completions / enrollments. */
  completionRate: number;
  /** Sum of succeeded payments (minor→major already handled by `amount`). */
  revenue: number;
  /** Trailing 6 months of succeeded revenue, oldest→newest. */
  revenueByMonth: MonthBucket[];
  topCourses: TopCourse[];
  /** Trailing 6 months of enrollment counts, oldest→newest. */
  enrollmentsByMonth: MonthCount[];
  /** The academy's display currency (from the first succeeded payment, else USD). */
  currency: string;
}

const EMPTY: AcademyMetrics = {
  students: 0,
  activeStudents: 0,
  courses: 0,
  publishedCourses: 0,
  enrollments: 0,
  completions: 0,
  completionRate: 0,
  revenue: 0,
  revenueByMonth: [],
  topCourses: [],
  enrollmentsByMonth: [],
  currency: "USD",
};

type Client = Awaited<ReturnType<typeof clientFromCookies>>;

async function clientFromCookies() {
  return createClient(await cookies());
}

/** `YYYY-MM` for a date. */
function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** The last `n` month keys ending with the current month, oldest→newest. */
function lastNMonths(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(monthKey(d));
  }
  return out;
}

/** Run an async producer, swallowing any error into a fallback value. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

const WINDOW_MONTHS = 6;

/**
 * Compute every headline analytics metric for one academy. Pure read; never
 * throws — each section is independently guarded and falls back to zeros.
 */
export async function getAcademyMetrics(
  academyId: string,
): Promise<AcademyMetrics> {
  if (!academyId) return EMPTY;

  let supabase: Client;
  try {
    supabase = await clientFromCookies();
  } catch {
    return EMPTY;
  }

  const months = lastNMonths(WINDOW_MONTHS);

  const [
    students,
    courseCounts,
    enrollmentAgg,
    activeStudents,
    revenueAgg,
    topCourses,
  ] = await Promise.all([
    // Distinct student memberships.
    safe(async () => {
      const { count } = await supabase
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId)
        .eq("role", "student");
      return count ?? 0;
    }, 0),

    // Total + published courses (excluding soft-deleted).
    safe(async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, is_published")
        .eq("academy_id", academyId)
        .is("deleted_at", null);
      const rows = data ?? [];
      return {
        total: rows.length,
        published: rows.filter((r) => r.is_published).length,
      };
    }, { total: 0, published: 0 }),

    // Enrollments: total, completions, and a trailing-window monthly histogram.
    safe(async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("status, enrolled_at, completed_at")
        .eq("academy_id", academyId);
      const rows = data ?? [];
      const total = rows.length;
      const completions = rows.filter(
        (r) => r.status === "completed" || r.completed_at != null,
      ).length;
      const byMonth = new Map<string, number>(months.map((m) => [m, 0]));
      for (const r of rows) {
        if (!r.enrolled_at) continue;
        const k = monthKey(new Date(r.enrolled_at));
        if (byMonth.has(k)) byMonth.set(k, (byMonth.get(k) ?? 0) + 1);
      }
      return { total, completions, byMonth };
    }, { total: 0, completions: 0, byMonth: new Map<string, number>() }),

    // Active = distinct students with any started/completed lesson progress.
    safe(async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("user_id, status")
        .eq("academy_id", academyId)
        .in("status", ["in_progress", "completed"]);
      const ids = new Set<string>();
      for (const r of data ?? []) if (r.user_id) ids.add(r.user_id);
      return ids.size;
    }, 0),

    // Succeeded revenue: total + trailing-window monthly histogram + currency.
    safe(async () => {
      const { data } = await supabase
        .from("payments")
        .select("amount, currency, paid_at, created_at")
        .eq("academy_id", academyId)
        .eq("status", "succeeded");
      const rows = data ?? [];
      let total = 0;
      let currency = "USD";
      const byMonth = new Map<string, number>(months.map((m) => [m, 0]));
      for (const r of rows) {
        const amt = typeof r.amount === "number" ? r.amount : 0;
        total += amt;
        if (r.currency) currency = r.currency;
        const when = r.paid_at ?? r.created_at;
        if (when) {
          const k = monthKey(new Date(when));
          if (byMonth.has(k)) byMonth.set(k, (byMonth.get(k) ?? 0) + amt);
        }
      }
      return { total, currency, byMonth };
    }, { total: 0, currency: "USD", byMonth: new Map<string, number>() }),

    // Top courses by enrolled_count (denormalized counter on the row).
    safe(async () => {
      const { data } = await supabase
        .from("courses")
        .select("title, enrolled_count")
        .eq("academy_id", academyId)
        .is("deleted_at", null)
        .order("enrolled_count", { ascending: false })
        .limit(5);
      return (data ?? [])
        .filter((c) => (c.enrolled_count ?? 0) > 0)
        .map((c) => ({
          title: c.title ?? "—",
          enrolled: c.enrolled_count ?? 0,
        }));
    }, [] as TopCourse[]),
  ]);

  const enrollments = enrollmentAgg.total;
  const completions = enrollmentAgg.completions;
  const completionRate =
    enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0;

  const revenueByMonth: MonthBucket[] = months.map((m) => ({
    month: m,
    amount: Math.round(revenueAgg.byMonth.get(m) ?? 0),
  }));
  const enrollmentsByMonth: MonthCount[] = months.map((m) => ({
    month: m,
    count: enrollmentAgg.byMonth.get(m) ?? 0,
  }));

  return {
    students,
    activeStudents,
    courses: courseCounts.total,
    publishedCourses: courseCounts.published,
    enrollments,
    completions,
    completionRate,
    revenue: Math.round(revenueAgg.total),
    revenueByMonth,
    topCourses,
    enrollmentsByMonth,
    currency: revenueAgg.currency,
  };
}
