"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { studentsDict } from "@/components/dashboard/students/dict";
import type { Role } from "@/lib/auth";

/* ---------------------------------------------------------------------------
   MEMBERS / STUDENTS — Server Actions. All writes run AS the logged-in user;
   RLS is the backstop (memberships/invitations/enrollments insert+update =
   owner/admin via has_role). We additionally re-resolve the caller's role
   server-side via assertWriter so a forged academy_id can't target another
   tenant, and we set academy_id explicitly on every insert.
--------------------------------------------------------------------------- */

export interface MembersActionState {
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

/** Roles a writer is allowed to grant via the dashboard (no platform tiers). */
const ASSIGNABLE_ROLES = ["owner", "admin", "instructor", "student"] as const;
function asRole(v: FormDataEntryValue | null, fallback: Role): Role {
  const s = typeof v === "string" ? v : "";
  return (ASSIGNABLE_ROLES as readonly string[]).includes(s)
    ? (s as Role)
    : fallback;
}

/** RFC-lite email check — good enough to reject obvious garbage client-side. */
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function clientFrom() {
  return createClient(await cookies());
}

/**
 * Confirm the user is an owner/admin (writer) of the academy and return a
 * server client + the caller's own role/id. Callers check the boolean.
 */
async function assertWriter(academyId: string): Promise<{
  ok: boolean;
  supabase: Awaited<ReturnType<typeof clientFrom>>;
  userId: string | null;
  role: Role | null;
}> {
  const supabase = await clientFrom();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, supabase, userId: null, role: null };

  const { data } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("academy_id", academyId)
    .maybeSingle();

  const role = (data?.role as Role | undefined) ?? null;
  const ok = role === "owner" || role === "admin";
  return { ok, supabase, userId: user.id, role };
}

/* ----------------------------- INVITE ---------------------------------- */

export async function inviteMember(
  _prev: MembersActionState,
  formData: FormData,
): Promise<MembersActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = studentsDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const email = str(formData.get("email")).toLowerCase();
  // Inviting a fellow manager: owner/admin/instructor only (no student invites
  // here — students arrive via enrollment).
  const role = asRole(formData.get("role"), "instructor");

  if (!academyId) return { error: t.generic };
  if (!email) return { error: t.emailRequired };
  if (!isEmail(email)) return { error: t.emailInvalid };

  const { ok, supabase, userId, role: callerRole } = await assertWriter(academyId);
  if (!ok || !userId) return { error: t.notOwner };

  // Only an owner may grant the owner role; admins can't mint owners.
  if (role === "owner" && callerRole !== "owner") return { error: t.notOwner };

  // Reject a duplicate pending invite for the same address. We deliberately
  // avoid .maybeSingle() here — there's no DB unique constraint on
  // (academy_id, email, status), so >1 pending row would make it throw and we'd
  // fall through to inserting yet another dup. limit(1) + length check is safe.
  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("academy_id", academyId)
    .eq("email", email)
    .eq("status", "pending")
    .limit(1);
  if (existing && existing.length > 0) return { error: t.alreadyInvited };

  // token + expires_at + status default at the DB layer.
  const { error } = await supabase.from("invitations").insert({
    academy_id: academyId,
    invited_by: userId,
    email,
    role,
  });

  if (error) return { error: t.generic };

  revalidatePath(`/${locale}/dashboard/students`);
  return { notice: studentsDict[locale].invite.sent };
}

/* --------------------------- UPDATE ROLE ------------------------------- */

export async function updateMemberRole(
  _prev: MembersActionState,
  formData: FormData,
): Promise<MembersActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = studentsDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const membershipId = str(formData.get("membershipId"));
  const nextRole = asRole(formData.get("role"), "instructor");

  if (!academyId || !membershipId) return { error: t.generic };

  const { ok, supabase, role: callerRole } = await assertWriter(academyId);
  if (!ok) return { error: t.notOwner };

  // Only an owner may promote someone to owner; admins can't self-promote or
  // mint other owners.
  if (nextRole === "owner" && callerRole !== "owner") return { error: t.notOwner };

  // Load the target membership (must belong to this academy).
  const { data: target } = await supabase
    .from("memberships")
    .select("id, user_id, role")
    .eq("id", membershipId)
    .eq("academy_id", academyId)
    .maybeSingle();
  if (!target) return { error: t.generic };

  if (target.role === nextRole) {
    // No change requested — treat as a successful no-op.
    return { notice: studentsDict[locale].roleSelect.save };
  }

  // Guard: never demote the LAST owner of the academy.
  if (target.role === "owner" && nextRole !== "owner") {
    const { count } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("academy_id", academyId)
      .eq("role", "owner");
    if ((count ?? 0) <= 1) return { error: t.lastOwner };
  }

  const { error } = await supabase
    .from("memberships")
    .update({ role: nextRole })
    .eq("id", membershipId)
    .eq("academy_id", academyId);

  if (error) return { error: t.generic };

  revalidatePath(`/${locale}/dashboard/students`);
  return { notice: studentsDict[locale].roleSelect.save };
}

/* --------------------------- REMOVE MEMBER ----------------------------- */

export async function removeMember(
  _prev: MembersActionState,
  formData: FormData,
): Promise<MembersActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = studentsDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const membershipId = str(formData.get("membershipId"));

  if (!academyId || !membershipId) return { error: t.generic };

  const { ok, supabase, userId } = await assertWriter(academyId);
  if (!ok || !userId) return { error: t.notOwner };

  const { data: target } = await supabase
    .from("memberships")
    .select("id, user_id, role")
    .eq("id", membershipId)
    .eq("academy_id", academyId)
    .maybeSingle();
  if (!target) return { error: t.generic };

  // Can't remove yourself from the dashboard.
  if (target.user_id === userId) return { error: t.selfRemove };

  // Can't remove the last owner.
  if (target.role === "owner") {
    const { count } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("academy_id", academyId)
      .eq("role", "owner");
    if ((count ?? 0) <= 1) return { error: t.lastOwner };
  }

  const { error } = await supabase
    .from("memberships")
    .delete()
    .eq("id", membershipId)
    .eq("academy_id", academyId);

  if (error) return { error: t.generic };

  revalidatePath(`/${locale}/dashboard/students`);
  return { notice: studentsDict[locale].team.removed };
}

/* --------------------------- MANUAL ENROLL ----------------------------- */

export async function manualEnroll(
  _prev: MembersActionState,
  formData: FormData,
): Promise<MembersActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = studentsDict[locale].errors;
  const academyId = str(formData.get("academyId"));
  const targetUserId = str(formData.get("userId"));
  const courseId = str(formData.get("courseId"));

  if (!academyId) return { error: t.generic };
  if (!targetUserId) return { error: t.userRequired };
  if (!courseId) return { error: t.courseRequired };

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.notOwner };

  // enrollments.user_id is an FK to profiles.id; a bad/unknown UUID would fail
  // the insert with a generic FK error. Verify the profile exists first so we
  // can surface a specific "user not found" message instead.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", targetUserId)
    .maybeSingle();
  if (!profile) return { error: t.userNotFound };

  // Confirm the course belongs to this academy (defence in depth).
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("academy_id", academyId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!course) return { error: t.courseRequired };

  // Skip if this user is already enrolled in this course.
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("academy_id", academyId)
    .eq("course_id", courseId)
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from("enrollments").insert({
      academy_id: academyId,
      course_id: courseId,
      user_id: targetUserId,
      status: "active",
    });
    if (error) return { error: t.generic };
  }

  revalidatePath(`/${locale}/dashboard/students`);
  return { notice: studentsDict[locale].enroll.done };
}
