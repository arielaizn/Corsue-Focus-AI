import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   GAMIFICATION DATA LAYER — RLS-scoped reads for the signed-in learner.

   Every query runs AS the logged-in user (createClient(await cookies())), so
   Postgres RLS provides tenant + ownership isolation. The current user id is
   always re-derived via auth.getUser() — never trust a client-passed one.

   Defensive by design: every read is wrapped so a blocked/failed query
   degrades to [] / null instead of throwing out of the data layer.
--------------------------------------------------------------------------- */

type BadgeRow = Database["public"]["Tables"]["badges"]["Row"];
type UserBadgeRow = Database["public"]["Tables"]["user_badges"]["Row"];
type LevelRow = Database["public"]["Tables"]["levels"]["Row"];

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

// ---------------------------------------------------------------------------
// My XP / level / rank
// ---------------------------------------------------------------------------

export interface MyXp {
  totalXp: number;
  currentLevel: number;
  /** All-time rank within the academy (from the leaderboard VIEW), or null. */
  rank: number | null;
}

/**
 * The current user's XP + level for one academy, plus their all-time rank read
 * from the `leaderboard` VIEW. Returns null only on a hard failure; a user with
 * no XP yet resolves to a zeroed record so callers can render a calm baseline.
 */
export async function myXp(academyId: string): Promise<MyXp | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    const [{ data: xp }, { data: lb }] = await Promise.all([
      supabase
        .from("user_xp")
        .select("total_xp, current_level")
        .eq("academy_id", academyId)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("leaderboard")
        .select("rank_all_time")
        .eq("academy_id", academyId)
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    return {
      totalXp: xp?.total_xp ?? 0,
      currentLevel: xp?.current_level ?? 1,
      rank: lb?.rank_all_time ?? null,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  displayName: string;
  avatarUrl: string | null;
  totalXp: number;
  currentLevel: number;
  /** True for the row belonging to the signed-in learner. */
  isMe: boolean;
}

/**
 * Top-N learners for an academy, read from the `leaderboard` VIEW (which already
 * joins profiles + computes rank_all_time). The current user's row is flagged
 * via `isMe` so the UI can highlight it.
 */
export async function getLeaderboard(
  academyId: string,
  limit = 20,
): Promise<LeaderboardEntry[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);

    const { data } = await supabase
      .from("leaderboard")
      .select(
        "user_id, rank_all_time, display_name, avatar_url, total_xp, current_level",
      )
      .eq("academy_id", academyId)
      .order("rank_all_time", { ascending: true })
      .limit(limit);

    const out: LeaderboardEntry[] = [];
    (data ?? []).forEach((r, i) => {
      if (!r.user_id) return;
      out.push({
        userId: r.user_id,
        rank: r.rank_all_time ?? i + 1,
        displayName: r.display_name?.trim() || "—",
        avatarUrl: r.avatar_url ?? null,
        totalXp: r.total_xp ?? 0,
        currentLevel: r.current_level ?? 1,
        isMe: !!userId && r.user_id === userId,
      });
    });
    return out;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export interface EarnedBadge {
  id: string;
  name: string;
  iconUrl: string;
  rarity: string;
  description: string | null;
  earnedAt: string;
}

/**
 * Badges the current user has earned in an academy (user_badges joined to the
 * badge definition), newest first.
 */
export async function myBadges(academyId: string): Promise<EarnedBadge[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return [];

    const { data } = await supabase
      .from("user_badges")
      .select(
        "badge_id, earned_at, badges(id, name, icon_url, rarity, description)",
      )
      .eq("academy_id", academyId)
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    type Joined = Pick<UserBadgeRow, "badge_id" | "earned_at"> & {
      badges:
        | Pick<BadgeRow, "id" | "name" | "icon_url" | "rarity" | "description">
        | Pick<BadgeRow, "id" | "name" | "icon_url" | "rarity" | "description">[]
        | null;
    };

    const out: EarnedBadge[] = [];
    for (const row of (data ?? []) as unknown as Joined[]) {
      // Supabase may return the joined relation as an object or a 1-elem array.
      const b = Array.isArray(row.badges) ? row.badges[0] : row.badges;
      if (!b) continue;
      out.push({
        id: b.id,
        name: b.name,
        iconUrl: b.icon_url,
        rarity: b.rarity,
        description: b.description,
        earnedAt: row.earned_at,
      });
    }
    return out;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Levels (global ladder)
// ---------------------------------------------------------------------------

/** The full level ladder (global, not academy-scoped), ordered by level. */
export async function listLevels(): Promise<LevelRow[]> {
  try {
    const supabase = await client();
    const { data } = await supabase
      .from("levels")
      .select("*")
      .order("level_number", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

export interface MyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivity: string | null;
}

/** The current user's streak for an academy (or a zeroed baseline). */
export async function getMyStreak(academyId: string): Promise<MyStreak> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { currentStreak: 0, longestStreak: 0, lastActivity: null };

    const { data } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_activity")
      .eq("academy_id", academyId)
      .eq("user_id", userId)
      .maybeSingle();

    return {
      currentStreak: data?.current_streak ?? 0,
      longestStreak: data?.longest_streak ?? 0,
      lastActivity: data?.last_activity ?? null,
    };
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastActivity: null };
  }
}

// ---------------------------------------------------------------------------
// Primary academy resolution (shared by the gamification + profile pages)
// ---------------------------------------------------------------------------

/**
 * Resolve the learner's "home" academy for the gamification surface. Preference
 * order: the academy where they hold the most XP → their first student
 * membership → the academy of their most recent enrollment. Returns null only
 * when the learner has no academy footprint at all.
 */
export async function getPrimaryAcademy(): Promise<{
  id: string;
  name: string;
} | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    // 1) Academy with the most XP.
    const { data: xpRows } = await supabase
      .from("user_xp")
      .select("academy_id, total_xp")
      .eq("user_id", userId)
      .order("total_xp", { ascending: false })
      .limit(1);
    let academyId = xpRows?.[0]?.academy_id ?? null;

    // 2) First student membership.
    if (!academyId) {
      const { data: mems } = await supabase
        .from("memberships")
        .select("academy_id")
        .eq("user_id", userId)
        .order("joined_at", { ascending: true })
        .limit(1);
      academyId = mems?.[0]?.academy_id ?? null;
    }

    // 3) Most recent enrollment's academy.
    if (!academyId) {
      const { data: enr } = await supabase
        .from("enrollments")
        .select("academy_id")
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false })
        .limit(1);
      academyId = enr?.[0]?.academy_id ?? null;
    }

    if (!academyId) return null;

    // Best-effort name (RLS recursion on academies degrades to a stub label).
    let name = "";
    try {
      const { data: academy } = await supabase
        .from("academies")
        .select("name")
        .eq("id", academyId)
        .maybeSingle();
      name = academy?.name ?? "";
    } catch {
      // keep empty
    }

    return { id: academyId, name };
  } catch {
    return null;
  }
}
