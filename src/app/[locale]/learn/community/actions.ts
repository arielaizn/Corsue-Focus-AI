"use server";

import { revalidatePath } from "next/cache";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  createPost,
  togglePostReaction,
  addComment,
  getPostComments,
  type FeedComment,
} from "@/lib/data/community-learn";

/* ---------------------------------------------------------------------------
   COMMUNITY server actions (learner side). Each re-derives the user + their
   academy server-side (inside the data layer) and NEVER trusts a client-passed
   user/academy id. These return JSON-serializable results so the client
   <CommunityFeed> can update optimistically and lazily load comment threads.
--------------------------------------------------------------------------- */

function resolveLocale(v: unknown): Locale {
  const s = typeof v === "string" ? v : "";
  return isLocale(s) ? s : defaultLocale;
}
function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Create a post in the learner's academy, then refresh the feed. */
export async function createPostAction(input: {
  locale?: string;
  academyId?: string;
  body: string;
  title?: string;
}): Promise<{ ok: boolean; postId?: string }> {
  const locale = resolveLocale(input.locale);
  const body = clean(input.body);
  if (!body) return { ok: false };

  const res = await createPost({
    academyId: input.academyId ?? null,
    body,
    title: clean(input.title) || null,
  });

  if (res.ok) revalidatePath(`/${locale}/learn/community`);
  return res;
}

/** Toggle the current user's like on a post. */
export async function toggleReactionAction(input: {
  locale?: string;
  postId: string;
}): Promise<{ ok: boolean; liked: boolean }> {
  const locale = resolveLocale(input.locale);
  const postId = clean(input.postId);
  if (!postId) return { ok: false, liked: false };

  const res = await togglePostReaction({ postId });

  if (res.ok) revalidatePath(`/${locale}/learn/community`);
  return res;
}

/**
 * Add a comment to a post and return the freshly-loaded thread so the client
 * can render it inline without a full page reload.
 */
export async function addCommentAction(input: {
  locale?: string;
  postId: string;
  body: string;
  parentId?: string;
}): Promise<{ ok: boolean; comments: FeedComment[] }> {
  const locale = resolveLocale(input.locale);
  const postId = clean(input.postId);
  const body = clean(input.body);
  if (!postId || !body) return { ok: false, comments: [] };

  const res = await addComment({
    postId,
    body,
    parentId: clean(input.parentId) || null,
  });

  if (!res.ok) return { ok: false, comments: [] };

  const comments = await getPostComments(postId);
  revalidatePath(`/${locale}/learn/community`);
  return { ok: true, comments };
}

/** Lazily load a post's comment thread (used when a learner expands comments). */
export async function loadCommentsAction(input: {
  postId: string;
}): Promise<{ ok: boolean; comments: FeedComment[] }> {
  const postId = clean(input.postId);
  if (!postId) return { ok: false, comments: [] };
  const comments = await getPostComments(postId);
  return { ok: true, comments };
}
