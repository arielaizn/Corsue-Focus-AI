import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   COMMUNITY DATA LAYER (learner side) — RLS-scoped reads/writes for the
   signed-in student. Every query runs AS the logged-in user
   (createClient(await cookies())), so Postgres RLS provides tenant + ownership
   isolation. We NEVER trust a client-passed user/academy id — the user is
   always re-derived via auth.getUser(), and the academy is resolved from the
   user's own memberships server-side.

   Defensive by design: profile data is hydrated with a *separate* batched read
   keyed by user_id (which reads cleanly under RLS) rather than a PostgREST
   embed, so a blocked embed never collapses the feed. Every read degrades to
   [] / null instead of throwing out of the data layer.
--------------------------------------------------------------------------- */

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

/** Author summary attached to a post/comment (hydrated by user_id). */
export interface CommunityAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

/** A feed post enriched with author + the current user's reaction state. */
export interface FeedPost {
  id: string;
  body: string;
  title: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isAnnouncement: boolean;
  author: CommunityAuthor;
  likedByMe: boolean;
  isMine: boolean;
}

/** A comment enriched with author + threading parent. */
export interface FeedComment {
  id: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  author: CommunityAuthor;
  isMine: boolean;
}

async function client() {
  return createClient(await cookies());
}

/** Re-derive the current user id (never trust a client-passed one). */
async function currentUserId(
  supabase: Awaited<ReturnType<typeof client>>,
): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * The learner's primary academy id, derived from their memberships (oldest
 * first → their "home" academy). Reads cleanly under RLS. Returns null if the
 * user has no membership yet.
 */
export async function getPrimaryAcademyId(): Promise<string | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    const { data } = await supabase
      .from("memberships")
      .select("academy_id, joined_at")
      .eq("user_id", userId)
      .order("joined_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    return data?.academy_id ?? null;
  } catch {
    return null;
  }
}

/** A minimal academy header for the community page (name + logo). */
export async function getAcademyHeader(
  academyId: string,
): Promise<{ name: string; logoUrl: string | null } | null> {
  try {
    const supabase = await client();
    const { data } = await supabase
      .from("academies")
      .select("name, logo_url")
      .eq("id", academyId)
      .maybeSingle();
    if (!data) return null;
    return { name: data.name, logoUrl: data.logo_url };
  } catch {
    return null;
  }
}

/**
 * Batch-hydrate author summaries keyed by user_id. Reading `profiles` directly
 * by id is RLS-clean (unlike some embedded joins), so this is the resilient
 * way to attach names/avatars to posts and comments.
 */
async function hydrateAuthors(
  supabase: Awaited<ReturnType<typeof client>>,
  userIds: string[],
): Promise<Map<string, CommunityAuthor>> {
  const out = new Map<string, CommunityAuthor>();
  const unique = Array.from(new Set(userIds)).filter(Boolean);
  if (unique.length === 0) return out;

  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", unique);
    for (const p of data ?? []) {
      out.set(p.id, {
        id: p.id,
        displayName: p.display_name || "",
        avatarUrl: p.avatar_url,
      });
    }
  } catch {
    // fall through — callers supply a fallback author for missing ids
  }
  return out;
}

function authorFor(
  byId: Map<string, CommunityAuthor>,
  userId: string,
): CommunityAuthor {
  return (
    byId.get(userId) ?? { id: userId, displayName: "", avatarUrl: null }
  );
}

// ---------------------------------------------------------------------------
// Feed (read)
// ---------------------------------------------------------------------------

/**
 * The academy feed: non-deleted posts ordered newest-first (pinned posts float
 * to the top), each enriched with its author and whether the current user has
 * reacted. Gated to academy members by RLS; degrades to [] on any failure.
 */
export async function getFeed(
  academyId: string,
  opts?: { limit?: number },
): Promise<FeedPost[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId || !academyId) return [];

    const limit = Math.min(100, Math.max(1, opts?.limit ?? 40));

    const { data: posts } = await supabase
      .from("posts")
      .select(
        "id, body, title, created_at, like_count, comment_count, is_pinned, is_announcement, user_id, academy_id, deleted_at",
      )
      .eq("academy_id", academyId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    const rows = (posts ?? []) as Pick<
      PostRow,
      | "id"
      | "body"
      | "title"
      | "created_at"
      | "like_count"
      | "comment_count"
      | "is_pinned"
      | "is_announcement"
      | "user_id"
    >[];
    if (rows.length === 0) return [];

    const postIds = rows.map((p) => p.id);

    // The current user's reactions across these posts (one read).
    const myReacted = new Set<string>();
    try {
      const { data: reactions } = await supabase
        .from("post_reactions")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds);
      for (const r of reactions ?? []) myReacted.add(r.post_id);
    } catch {
      // no reactions surfaced — treat as none
    }

    const authors = await hydrateAuthors(
      supabase,
      rows.map((p) => p.user_id),
    );

    return rows.map((p) => ({
      id: p.id,
      body: p.body,
      title: p.title,
      createdAt: p.created_at,
      likeCount: p.like_count ?? 0,
      commentCount: p.comment_count ?? 0,
      isPinned: p.is_pinned ?? false,
      isAnnouncement: p.is_announcement ?? false,
      author: authorFor(authors, p.user_id),
      likedByMe: myReacted.has(p.id),
      isMine: p.user_id === userId,
    }));
  } catch {
    return [];
  }
}

/**
 * Comments on a post (entity_type='post'), oldest-first so threads read
 * naturally, each enriched with its author. Degrades to [] on any failure.
 */
export async function getPostComments(
  postId: string,
): Promise<FeedComment[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId || !postId) return [];

    const { data: comments } = await supabase
      .from("comments")
      .select("id, body, created_at, parent_id, user_id, entity_id, entity_type, deleted_at")
      .eq("entity_type", "post")
      .eq("entity_id", postId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    const rows = (comments ?? []) as Pick<
      CommentRow,
      "id" | "body" | "created_at" | "parent_id" | "user_id"
    >[];
    if (rows.length === 0) return [];

    const authors = await hydrateAuthors(
      supabase,
      rows.map((c) => c.user_id),
    );

    return rows.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.created_at,
      parentId: c.parent_id,
      author: authorFor(authors, c.user_id),
      isMine: c.user_id === userId,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Writes (self-write; RLS enforces is_member_of(academy_id))
// ---------------------------------------------------------------------------

/**
 * Create a post in the user's academy. We re-verify membership-derived academy
 * server-side: callers may pass an academyId, but it must be one the user
 * actually belongs to — otherwise we fall back to their primary academy.
 */
export async function createPost({
  academyId,
  body,
  title,
}: {
  academyId?: string | null;
  body: string;
  title?: string | null;
}): Promise<{ ok: boolean; postId?: string }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false };

    const trimmed = body.trim();
    if (!trimmed) return { ok: false };

    const resolvedAcademyId = await resolveMemberAcademy(
      supabase,
      userId,
      academyId,
    );
    if (!resolvedAcademyId) return { ok: false };

    const { data, error } = await supabase
      .from("posts")
      .insert({
        academy_id: resolvedAcademyId,
        user_id: userId,
        body: trimmed,
        title: title?.trim() ? title.trim() : null,
      })
      .select("id")
      .single();

    return { ok: !error, postId: data?.id };
  } catch {
    return { ok: false };
  }
}

/**
 * Toggle the current user's reaction on a post: insert a 'like' row if none
 * exists, delete it if it does. The post's like_count is maintained by a DB
 * trigger; we just own the membership row.
 */
export async function togglePostReaction({
  postId,
}: {
  postId: string;
}): Promise<{ ok: boolean; liked: boolean }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId || !postId) return { ok: false, liked: false };

    const { data: existing } = await supabase
      .from("post_reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("post_reactions")
        .delete()
        .eq("id", existing.id)
        .eq("user_id", userId);
      return { ok: !error, liked: false };
    }

    const { error } = await supabase.from("post_reactions").insert({
      post_id: postId,
      user_id: userId,
      emoji: "like",
    });
    // A race that already inserted (unique violation) is still "liked".
    if (error && error.code !== "23505") {
      return { ok: false, liked: false };
    }
    return { ok: true, liked: true };
  } catch {
    return { ok: false, liked: false };
  }
}

/**
 * Add a comment to a post (entity_type='post'). academy_id is resolved from the
 * target post so the comment lands in the right tenant; we still confirm the
 * user is a member of that academy before writing.
 */
export async function addComment({
  postId,
  body,
  parentId,
}: {
  postId: string;
  body: string;
  parentId?: string | null;
}): Promise<{ ok: boolean; commentId?: string }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId || !postId) return { ok: false };

    const trimmed = body.trim();
    if (!trimmed) return { ok: false };

    // Resolve the academy from the post itself (authoritative).
    const { data: post } = await supabase
      .from("posts")
      .select("academy_id")
      .eq("id", postId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!post) return { ok: false };

    const { data, error } = await supabase
      .from("comments")
      .insert({
        academy_id: post.academy_id,
        user_id: userId,
        entity_type: "post",
        entity_id: postId,
        body: trimmed,
        parent_id: parentId ?? null,
      })
      .select("id")
      .single();

    return { ok: !error, commentId: data?.id };
  } catch {
    return { ok: false };
  }
}

/**
 * Resolve an academy the user is actually a member of. If `preferred` is one of
 * their memberships, use it; otherwise fall back to their primary (oldest)
 * membership. Never trusts a client-passed academy id blindly.
 */
async function resolveMemberAcademy(
  supabase: Awaited<ReturnType<typeof client>>,
  userId: string,
  preferred?: string | null,
): Promise<string | null> {
  const { data: mems } = await supabase
    .from("memberships")
    .select("academy_id, joined_at")
    .eq("user_id", userId)
    .order("joined_at", { ascending: true });

  const ids = (mems ?? []).map((m) => m.academy_id);
  if (ids.length === 0) return null;
  if (preferred && ids.includes(preferred)) return preferred;
  return ids[0];
}
