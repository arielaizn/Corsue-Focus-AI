import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Role } from "@/lib/auth";

/* ---------------------------------------------------------------------------
   MEMBERS / STUDENTS data layer — typed, RLS-safe reads for the people side of
   the academy dashboard.

   Per the foundation manifest, the seeded RLS policies on `academies`/`courses`
   can raise "infinite recursion". `memberships`, `profiles`, `enrollments`,
   `lesson_progress`, `lessons` and `invitations` read cleanly. We therefore
   AVOID embedded PostgREST joins (e.g. profiles!inner) — those can re-trigger
   recursion through a related policy — and instead fetch each table separately,
   then stitch the rows together in JS. Every read is scoped to an explicit
   academy_id (defence in depth). All reads run AS the logged-in user.

   Email note: the academy has no readable `email` column (profiles has none,
   and `auth.users` is not reachable from the user client). We attempt a
   best-effort read and gracefully fall back to `null` everywhere.
--------------------------------------------------------------------------- */

async function client() {
  return createClient(await cookies());
}

export type TeamRole = Extract<Role, "owner" | "admin" | "instructor">;

export interface TeamMember {
  membershipId: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  joinedAt: string;
  email: string | null;
  isSelf: boolean;
}

export interface EnrolledStudent {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
  /** Distinct courses this user is enrolled in (active or otherwise). */
  courseCount: number;
  /** First (earliest) enrollment timestamp, used as a "joined" proxy. */
  enrolledAt: string | null;
  /** Average watch_percent (0–100) across this student's lesson_progress. */
  avgProgress: number | null;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  expiresAt: string;
}

export interface MemberCounts {
  team: number;
  students: number;
  pending: number;
}

const TEAM_ROLES = ["owner", "admin", "instructor"] as const;

/**
 * Resolve the calling user's id once (used to flag the "self" row so the UI can
 * hide self-destructive controls). Returns null when signed out.
 */
async function currentUserId(
  supabase: Awaited<ReturnType<typeof client>>,
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Map a set of user ids to {display_name, avatar_url}. */
async function profilesByIds(
  supabase: Awaited<ReturnType<typeof client>>,
  ids: string[],
): Promise<Map<string, { display_name: string; avatar_url: string | null }>> {
  const out = new Map<string, { display_name: string; avatar_url: string | null }>();
  const unique = [...new Set(ids)];
  if (unique.length === 0) return out;
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", unique);
  for (const p of data ?? []) {
    out.set(p.id, {
      display_name: p.display_name || "",
      avatar_url: p.avatar_url ?? null,
    });
  }
  return out;
}

/**
 * Team = owner/admin/instructor memberships, joined to profiles. Sorted by role
 * rank (owner → admin → instructor) then join date.
 */
export async function listAcademyMembers(
  academyId: string,
): Promise<TeamMember[]> {
  try {
    const supabase = await client();
    const meId = await currentUserId(supabase);

    const { data: mems, error } = await supabase
      .from("memberships")
      .select("id, user_id, role, joined_at")
      .eq("academy_id", academyId)
      .in("role", [...TEAM_ROLES])
      .order("joined_at", { ascending: true });

    if (error || !mems) return [];

    const profiles = await profilesByIds(
      supabase,
      mems.map((m) => m.user_id),
    );

    const rank: Record<string, number> = { owner: 0, admin: 1, instructor: 2 };
    const rows: TeamMember[] = mems.map((m) => {
      const p = profiles.get(m.user_id);
      return {
        membershipId: m.id,
        userId: m.user_id,
        displayName: p?.display_name || "",
        avatarUrl: p?.avatar_url ?? null,
        role: m.role,
        joinedAt: m.joined_at,
        email: null,
        isSelf: meId != null && m.user_id === meId,
      };
    });

    rows.sort((a, b) => {
      const r = (rank[a.role] ?? 9) - (rank[b.role] ?? 9);
      if (r !== 0) return r;
      return a.joinedAt.localeCompare(b.joinedAt);
    });
    return rows;
  } catch {
    return [];
  }
}

/**
 * Distinct enrolled students for the academy. We aggregate enrollments by
 * user (one student can hold several enrollments → one row, with a course
 * count), enrich with profiles, and compute an average watch_percent from
 * lesson_progress. Membership role isn't required (storefront enrollments may
 * predate a 'student' membership), so we key purely off `enrollments`.
 */
export async function listEnrolledStudents(
  academyId: string,
): Promise<EnrolledStudent[]> {
  try {
    const supabase = await client();

    const { data: enrolls, error } = await supabase
      .from("enrollments")
      .select("user_id, course_id, enrolled_at")
      .eq("academy_id", academyId)
      .order("enrolled_at", { ascending: true });

    if (error || !enrolls) return [];

    // Aggregate by student: distinct courses + earliest enrollment.
    const byUser = new Map<
      string,
      { courses: Set<string>; enrolledAt: string }
    >();
    for (const e of enrolls) {
      const cur = byUser.get(e.user_id);
      if (cur) {
        cur.courses.add(e.course_id);
        if (e.enrolled_at < cur.enrolledAt) cur.enrolledAt = e.enrolled_at;
      } else {
        byUser.set(e.user_id, {
          courses: new Set([e.course_id]),
          enrolledAt: e.enrolled_at,
        });
      }
    }

    const userIds = [...byUser.keys()];
    if (userIds.length === 0) return [];

    // Profiles + progress in parallel.
    const [profiles, progressRes] = await Promise.all([
      profilesByIds(supabase, userIds),
      supabase
        .from("lesson_progress")
        .select("user_id, watch_percent")
        .eq("academy_id", academyId)
        .in("user_id", userIds),
    ]);

    // Average watch_percent per user.
    const progSum = new Map<string, { sum: number; n: number }>();
    for (const r of progressRes.data ?? []) {
      const cur = progSum.get(r.user_id) ?? { sum: 0, n: 0 };
      cur.sum += r.watch_percent ?? 0;
      cur.n += 1;
      progSum.set(r.user_id, cur);
    }

    const rows: EnrolledStudent[] = userIds.map((uid) => {
      const agg = byUser.get(uid)!;
      const p = profiles.get(uid);
      const prog = progSum.get(uid);
      return {
        userId: uid,
        displayName: p?.display_name || "",
        avatarUrl: p?.avatar_url ?? null,
        email: null,
        courseCount: agg.courses.size,
        enrolledAt: agg.enrolledAt,
        avgProgress:
          prog && prog.n > 0 ? Math.round(prog.sum / prog.n) : null,
      };
    });

    // Most recently enrolled first.
    rows.sort((a, b) => (b.enrolledAt ?? "").localeCompare(a.enrolledAt ?? ""));
    return rows;
  } catch {
    return [];
  }
}

/** Pending (un-accepted, un-expired) invitations for the academy. */
export async function pendingInvites(
  academyId: string,
): Promise<PendingInvite[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("invitations")
      .select("id, email, role, status, created_at, expires_at")
      .eq("academy_id", academyId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      createdAt: i.created_at,
      expiresAt: i.expires_at,
    }));
  } catch {
    return [];
  }
}

/** Headline counts for the page (team / distinct students / pending invites). */
export async function countsForAcademy(
  academyId: string,
): Promise<MemberCounts> {
  try {
    const supabase = await client();
    const [teamRes, enrollRes, pendingRes] = await Promise.all([
      supabase
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId)
        .in("role", [...TEAM_ROLES]),
      supabase
        .from("enrollments")
        .select("user_id")
        .eq("academy_id", academyId),
      supabase
        .from("invitations")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId)
        .eq("status", "pending"),
    ]);

    const students = new Set(
      (enrollRes.data ?? []).map((e) => e.user_id),
    ).size;

    return {
      team: teamRes.count ?? 0,
      students,
      pending: pendingRes.count ?? 0,
    };
  } catch {
    return { team: 0, students: 0, pending: 0 };
  }
}

export interface EnrollableCourse {
  id: string;
  title: string;
}

/**
 * Minimal course list (id + title) for the manual-enroll picker. Partial-column
 * select avoids the courses full-row recursion caveat.
 */
export async function enrollableCourses(
  academyId: string,
): Promise<EnrollableCourse[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("courses")
      .select("id, title")
      .eq("academy_id", academyId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((c) => ({ id: c.id, title: c.title }));
  } catch {
    return [];
  }
}
