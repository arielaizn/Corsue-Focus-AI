"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { communityDict } from "@/components/dashboard/community/dict";
import {
  getPostThread,
  type ModComment,
} from "@/lib/data/community-admin";

/* ---------------------------------------------------------------------------
   COMMUNITY MODERATION — Server Actions. All writes run AS the logged-in user;
   RLS is the backstop. We re-resolve the active membership server-side so a
   forged academy_id can't target a tenant the user isn't a writer in. Every
   insert sets academy_id explicitly.

   Two privilege tiers:
     • assertWriter  → owner/admin   (moderate, pin, delete, groups, announce,
       and BADGE grants — user_badges INSERT RLS allows owner/admin only)
     • assertGranter → owner/admin/instructor (manual XP grants only — matches
       the xp_events RLS: is_member_of + owner/admin/instructor)
--------------------------------------------------------------------------- */

export interface CommunityActionState {
  error?: string;
  notice?: string;
}

const VISIBILITIES = ["public", "private", "vip"] as const;
type Visibility = (typeof VISIBILITIES)[number];

function resolveLocale(v: FormDataEntryValue | null): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function asVisibility(v: FormDataEntryValue | null): Visibility {
  const s = typeof v === "string" ? v : "";
  return (VISIBILITIES as readonly string[]).includes(s)
    ? (s as Visibility)
    : "public";
}

/** Parse a positive integer XP amount, or null when blank/invalid. */
function asAmount(v: FormDataEntryValue | null): number | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n === 0) return null;
  return n;
}

/** Slugify a group name; append a short random suffix for uniqueness. */
function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `group-${suffix}`;
}

async function clientFrom() {
  return createClient(await cookies());
}

type SupabaseServer = Awaited<ReturnType<typeof clientFrom>>;

/**
 * Confirm the user holds one of `roles` in the academy and return a server
 * client + the resolved user id. Callers check the boolean; we never throw.
 */
async function assertRole(
  academyId: string,
  roles: readonly string[],
): Promise<{ ok: boolean; supabase: SupabaseServer; userId: string | null }> {
  const supabase = await clientFrom();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, supabase, userId: null };

  const { data } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("academy_id", academyId)
    .maybeSingle();

  const ok = !!data && roles.includes(data.role);
  return { ok, supabase, userId: user.id };
}

/** Owner/admin tier — moderation, groups, announcements. */
function assertWriter(academyId: string) {
  return assertRole(academyId, ["owner", "admin"]);
}

/** Owner/admin/instructor tier — manual XP grants. */
function assertGranter(academyId: string) {
  return assertRole(academyId, ["owner", "admin", "instructor"]);
}

/**
 * Confirm `targetUserId` is a member of `academyId`. Prevents granting XP /
 * badges to non-members (leaderboard pollution / orphan user_xp rows). RLS
 * scopes this read to academies the caller belongs to.
 */
async function isAcademyMember(
  supabase: SupabaseServer,
  academyId: string,
  targetUserId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("memberships")
    .select("user_id")
    .eq("user_id", targetUserId)
    .eq("academy_id", academyId)
    .maybeSingle();
  return !!data;
}

function revalidateCommunity(locale: Locale): void {
  revalidatePath(`/${locale}/dashboard/community`);
}

/* -------------------------------- READS --------------------------------- */

/**
 * Lazily load a post's comment thread for the expandable feed row. Read-only;
 * RLS scopes the read to the caller. Returns [] for non-members or on any
 * failure (the UI shows an "empty thread" state).
 */
export async function loadThread(
  academyId: string,
  postId: string,
): Promise<ModComment[]> {
  if (!academyId || !postId) return [];
  // Confirm the caller is a member-with-management of this academy before we
  // surface a thread (defence in depth; RLS is the backstop on the read).
  const { ok } = await assertGranter(academyId);
  if (!ok) return [];
  return getPostThread(academyId, postId);
}

/* ------------------------------ MODERATION ------------------------------ */

/** Pin or unpin a post (posts.is_pinned). `pinned` carries the target state. */
export async function setPostPinned(
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const postId = str(formData.get("postId"));
  const pinned = str(formData.get("pinned")) === "true";
  if (!academyId || !postId) return { error: t.errors.generic };

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.errors.notOwner };

  // Verify the UPDATE actually matched a row (RLS can silently no-op).
  const { data, error } = await supabase
    .from("posts")
    .update({ is_pinned: pinned })
    .eq("id", postId)
    .eq("academy_id", academyId)
    .select("id");

  if (error || !data || data.length === 0) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: pinned ? t.notices.pinned : t.notices.unpinned };
}

/** Soft-delete a post (posts.deleted_at). */
export async function deletePost(
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const postId = str(formData.get("postId"));
  if (!academyId || !postId) return { error: t.errors.generic };

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.errors.notOwner };

  // Confirm the soft-delete UPDATE matched a row; an empty result means RLS
  // blocked it (or the row was already gone) — surface a failure, not silence.
  const { data, error } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("academy_id", academyId)
    .select("id");

  if (error || !data || data.length === 0) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: t.notices.deleted };
}

/** Soft-delete a comment (comments.deleted_at). */
export async function deleteComment(
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const commentId = str(formData.get("commentId"));
  if (!academyId || !commentId) return { error: t.errors.generic };

  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.errors.notOwner };

  // Migration 0010 broadened comments_update RLS to owner/admin, so the
  // soft-delete now matches at the DB level. Chain .select("id") and treat an
  // empty result (RLS no-op) or error as a hard failure rather than false
  // success, so the UI only drops the comment when it was really removed.
  const { data, error } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("academy_id", academyId)
    .select("id");

  if (error || !data || data.length === 0) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: t.notices.commentDeleted };
}

/* -------------------------------- GROUPS -------------------------------- */

export async function createGroup(
  _prev: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const name = str(formData.get("name"));
  const description = str(formData.get("description"));
  const visibility = asVisibility(formData.get("visibility"));

  if (!name) return { error: t.errors.nameRequired };
  if (!academyId) return { error: t.errors.generic };

  const { ok, supabase, userId } = await assertWriter(academyId);
  if (!ok || !userId) return { error: t.errors.notOwner };

  const { error } = await supabase.from("groups").insert({
    academy_id: academyId,
    name,
    slug: slugify(name),
    description: description || null,
    visibility,
    created_by: userId,
  });

  if (error) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: t.notices.groupCreated };
}

/* ----------------------------- ANNOUNCEMENT ----------------------------- */

export async function postAnnouncement(
  _prev: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const title = str(formData.get("title"));
  const body = str(formData.get("body"));

  if (!body) return { error: t.errors.bodyRequired };
  if (!academyId) return { error: t.errors.generic };

  const { ok, supabase, userId } = await assertWriter(academyId);
  if (!ok || !userId) return { error: t.errors.notOwner };

  const { error } = await supabase.from("posts").insert({
    academy_id: academyId,
    user_id: userId,
    title: title || null,
    body,
    is_announcement: true,
    is_pinned: true,
  });

  if (error) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: t.notices.announced };
}

/* -------------------------------- GRANTS -------------------------------- */

export async function grantXp(
  _prev: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const targetUserId = str(formData.get("targetUserId"));
  const amount = asAmount(formData.get("amount"));
  const note = str(formData.get("note"));

  if (!academyId) return { error: t.errors.generic };
  if (!targetUserId) return { error: t.errors.userRequired };
  if (amount == null) return { error: t.errors.amountInvalid };

  const { ok, supabase } = await assertGranter(academyId);
  if (!ok) return { error: t.errors.notOwner };

  // Only members can earn XP — guard against orphan user_xp / leaderboard
  // pollution from a forged or stale targetUserId.
  if (!(await isAcademyMember(supabase, academyId, targetUserId)))
    return { error: t.errors.notMember };

  const { error } = await supabase.from("xp_events").insert({
    academy_id: academyId,
    user_id: targetUserId,
    source: "manual_grant",
    amount,
    note: note || null,
  });

  if (error) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: t.notices.xpGranted };
}

export async function grantBadge(
  _prev: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = communityDict[locale];
  const academyId = str(formData.get("academyId"));
  const targetUserId = str(formData.get("targetUserId"));
  const badgeId = str(formData.get("badgeId"));

  if (!academyId) return { error: t.errors.generic };
  if (!targetUserId) return { error: t.errors.userRequired };
  if (!badgeId) return { error: t.errors.badgeRequired };

  // user_badges INSERT RLS allows owner/admin only (NOT instructor), so gate on
  // the writer tier — otherwise an instructor sees the form but every submit
  // fails at the DB.
  const { ok, supabase } = await assertWriter(academyId);
  if (!ok) return { error: t.errors.notOwner };

  // Badges only make sense for members of this academy.
  if (!(await isAcademyMember(supabase, academyId, targetUserId)))
    return { error: t.errors.notMember };

  const { error } = await supabase.from("user_badges").insert({
    academy_id: academyId,
    user_id: targetUserId,
    badge_id: badgeId,
  });

  if (error) return { error: t.errors.generic };

  revalidateCommunity(locale);
  return { notice: t.notices.badgeGranted };
}
