import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/* ---------------------------------------------------------------------------
   COMMUNITY MODERATION data layer — typed, RLS-safe reads for the manager
   community page. Every query runs AS the logged-in user; RLS isolates by
   tenant. Each read is additionally scoped to an explicit academy_id (defence
   in depth + clear intent). Writes live in the page-local Server Actions
   (community/actions.ts).

   These reads must never throw the page: every helper wraps its query in
   try/catch and returns [] on any failure (RLS denial, recursion caveat, etc.)
   so the dashboard always renders.
--------------------------------------------------------------------------- */

async function client() {
  return createClient(await cookies());
}

/* --------------------------------- TYPES -------------------------------- */

export interface ModAuthor {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface ModPost {
  id: string;
  title: string | null;
  body: string;
  is_pinned: boolean;
  is_announcement: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  author: ModAuthor | null;
}

export interface ModComment {
  id: string;
  body: string;
  is_pinned: boolean;
  created_at: string;
  author: ModAuthor | null;
}

export interface CommunityGroup {
  id: string;
  name: string;
  slug: string;
  visibility: "public" | "private" | "vip";
  member_count: number;
  description: string | null;
  created_at: string;
}

export interface LeaderboardRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  rank_all_time: number | null;
}

export interface CommunityBadge {
  id: string;
  name: string;
  icon_url: string;
  rarity: string;
  description: string | null;
}

/* ------------------------------- HELPERS -------------------------------- */

/**
 * Resolve a set of user_ids → public profile cards in one round-trip. Returns
 * a Map keyed by id; missing/blocked rows simply don't appear (callers
 * tolerate a null author).
 */
async function profileMap(
  supabase: Awaited<ReturnType<typeof client>>,
  ids: string[],
): Promise<Map<string, ModAuthor>> {
  const map = new Map<string, ModAuthor>();
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return map;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", unique);
    for (const p of data ?? []) {
      map.set(p.id, {
        id: p.id,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
      });
    }
  } catch {
    // best-effort; authors degrade to null
  }
  return map;
}

/* --------------------------------- READS -------------------------------- */

/**
 * Recent posts for the moderation feed (newest first, including soft-deleted
 * markers excluded). Authors are joined in a second pass via profileMap so a
 * blocked profile read never drops the post itself.
 */
export async function getModFeed(
  academyId: string,
  limit = 40,
): Promise<ModPost[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, body, is_pinned, is_announcement, like_count, comment_count, created_at, user_id",
      )
      .eq("academy_id", academyId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    const authors = await profileMap(
      supabase,
      data.map((p) => p.user_id),
    );

    return data.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      is_pinned: p.is_pinned,
      is_announcement: p.is_announcement,
      like_count: p.like_count,
      comment_count: p.comment_count,
      created_at: p.created_at,
      author: authors.get(p.user_id) ?? null,
    }));
  } catch {
    return [];
  }
}

/**
 * Comments on a single post (entity_type='post'), oldest first so a thread
 * reads naturally. Soft-deleted comments are excluded.
 */
export async function getPostThread(
  academyId: string,
  postId: string,
  limit = 50,
): Promise<ModComment[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("comments")
      .select("id, body, is_pinned, created_at, user_id")
      .eq("academy_id", academyId)
      .eq("entity_type", "post")
      .eq("entity_id", postId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error || !data) return [];

    const authors = await profileMap(
      supabase,
      data.map((c) => c.user_id),
    );

    return data.map((c) => ({
      id: c.id,
      body: c.body,
      is_pinned: c.is_pinned,
      created_at: c.created_at,
      author: authors.get(c.user_id) ?? null,
    }));
  } catch {
    return [];
  }
}

/** Active groups for an academy (newest first). */
export async function listGroups(
  academyId: string,
): Promise<CommunityGroup[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("groups")
      .select(
        "id, name, slug, visibility, member_count, description, created_at",
      )
      .eq("academy_id", academyId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/**
 * Academy leaderboard (the `leaderboard` VIEW), top by XP. The view already
 * carries display_name/avatar_url and the all-time rank; we coalesce the
 * nullable view columns to safe defaults for the UI.
 */
export async function academyLeaderboard(
  academyId: string,
  limit = 20,
): Promise<LeaderboardRow[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("leaderboard")
      .select(
        "user_id, display_name, avatar_url, total_xp, current_level, rank_all_time",
      )
      .eq("academy_id", academyId)
      .order("rank_all_time", { ascending: true })
      .limit(limit);

    if (error || !data) return [];

    return data
      .filter((r): r is typeof r & { user_id: string } => !!r.user_id)
      .map((r) => ({
        user_id: r.user_id,
        display_name: r.display_name,
        avatar_url: r.avatar_url,
        total_xp: r.total_xp ?? 0,
        current_level: r.current_level ?? 1,
        rank_all_time: r.rank_all_time,
      }));
  } catch {
    return [];
  }
}

/**
 * Badges defined for this academy (the manual-grant palette). Academy-scoped;
 * global/system badges (academy_id null) are intentionally excluded — managers
 * grant their own academy's badges.
 */
export async function listBadges(
  academyId: string,
): Promise<CommunityBadge[]> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("badges")
      .select("id, name, icon_url, rarity, description")
      .eq("academy_id", academyId)
      .order("name", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
