"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import type { LearnDict } from "./dictionary";
import { Avatar } from "@/components/community/Avatar";
import {
  HeartIcon,
  CommentIcon,
  SendIcon,
  PinIcon,
} from "@/components/community/icons";
import type { FeedPost, FeedComment } from "@/lib/data/community-learn";
import {
  createPostAction,
  toggleReactionAction,
  addCommentAction,
  loadCommentsAction,
} from "@/app/[locale]/learn/community/actions";

/* ---------------------------------------------------------------------------
   COMMUNITY feed (client). Composer + post list + like toggle + inline
   comments, all driven by server actions. State is optimistic where it's safe
   (likes, post insert) and authoritative where the server returns truth
   (comment threads). Logical CSS props throughout for RTL safety.
--------------------------------------------------------------------------- */

type CommunityCopy = LearnDict["community"];

/** Up to two initials from a display name (or "•" when unknown). */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** A short, locale-aware relative time ("3h", "2d", or a date). */
function relativeTime(iso: string, locale: Locale): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return locale === "he" ? "עכשיו" : "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(iso).toLocaleDateString(
    locale === "he" ? "he-IL" : "en-US",
    { day: "numeric", month: "short" },
  );
}

interface PostState extends FeedPost {
  comments: FeedComment[] | null; // null = not loaded yet
  commentsOpen: boolean;
}

export function CommunityFeed({
  locale,
  dict,
  academyId,
  selfName,
  initialPosts,
}: {
  locale: Locale;
  dict: LearnDict;
  academyId: string;
  selfName: string;
  initialPosts: FeedPost[];
}) {
  const t = dict.community;
  const [posts, setPosts] = useState<PostState[]>(
    initialPosts.map((p) => ({ ...p, comments: null, commentsOpen: false })),
  );

  const patchPost = (id: string, patch: Partial<PostState>) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );

  return (
    <div className="flex flex-col gap-5">
      <Composer
        locale={locale}
        t={t}
        academyId={academyId}
        selfName={selfName}
        onCreated={(post) =>
          setPosts((prev) => [
            { ...post, comments: null, commentsOpen: false },
            ...prev,
          ])
        }
      />

      {posts.length === 0 ? (
        <p className="panel-premium px-6 py-12 text-center text-sm text-muted">
          {t.noPosts}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard
                locale={locale}
                t={t}
                post={p}
                selfName={selfName}
                onPatch={(patch) => patchPost(p.id, patch)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composer
// ---------------------------------------------------------------------------

function Composer({
  locale,
  t,
  academyId,
  selfName,
  onCreated,
}: {
  locale: Locale;
  t: CommunityCopy;
  academyId: string;
  selfName: string;
  onCreated: (post: FeedPost) => void;
}) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    const value = body.trim();
    if (!value || pending) return;
    startTransition(async () => {
      const res = await createPostAction({ locale, academyId, body: value });
      if (res.ok && res.postId) {
        onCreated({
          id: res.postId,
          body: value,
          title: null,
          createdAt: new Date().toISOString(),
          likeCount: 0,
          commentCount: 0,
          isPinned: false,
          isAnnouncement: false,
          author: { id: "me", displayName: selfName, avatarUrl: null },
          likedByMe: false,
          isMine: true,
        });
        setBody("");
      }
    });
  };

  return (
    <section className="panel-couture p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar initials={initialsOf(selfName)} size={40} />
        <div className="min-w-0 flex-1">
          <label htmlFor="community-composer" className="sr-only">
            {t.write}
          </label>
          <textarea
            id="community-composer"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.postPlaceholder}
            rows={3}
            dir="auto"
            className="w-full resize-y rounded-[8px] bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_1px_var(--color-gold)]"
          />
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={submit}
              disabled={pending || body.trim().length === 0}
              className="bg-ink text-bg-deep inline-flex items-center justify-center rounded-[6px] px-5 py-2 text-sm font-semibold transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? t.posting : t.post}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Post card
// ---------------------------------------------------------------------------

function PostCard({
  locale,
  t,
  post,
  selfName,
  onPatch,
}: {
  locale: Locale;
  t: CommunityCopy;
  post: PostState;
  selfName: string;
  onPatch: (patch: Partial<PostState>) => void;
}) {
  const [likePending, startLike] = useTransition();
  const [commentsPending, startComments] = useTransition();

  const toggleLike = () => {
    if (likePending) return;
    // Optimistic flip; reconcile from the server result.
    const nextLiked = !post.likedByMe;
    onPatch({
      likedByMe: nextLiked,
      likeCount: Math.max(0, post.likeCount + (nextLiked ? 1 : -1)),
    });
    startLike(async () => {
      const res = await toggleReactionAction({ locale, postId: post.id });
      if (!res.ok) {
        // revert on failure
        onPatch({
          likedByMe: post.likedByMe,
          likeCount: post.likeCount,
        });
      } else {
        onPatch({ likedByMe: res.liked });
      }
    });
  };

  const toggleComments = () => {
    const opening = !post.commentsOpen;
    onPatch({ commentsOpen: opening });
    if (opening && post.comments === null && !commentsPending) {
      startComments(async () => {
        const res = await loadCommentsAction({ postId: post.id });
        onPatch({ comments: res.ok ? res.comments : [] });
      });
    }
  };

  const authorName =
    post.author.displayName || (post.isMine ? selfName : t.members);

  return (
    <article className="panel-couture p-4 sm:p-5">
      {(post.isPinned || post.isAnnouncement) && (
        <div
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-gold"
          aria-label={t.feed}
        >
          <PinIcon size={13} />
        </div>
      )}

      <header className="flex items-center gap-3">
        <Avatar initials={initialsOf(authorName)} size={42} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{authorName}</p>
          <p className="truncate text-xs text-muted">
            {relativeTime(post.createdAt, locale)}
          </p>
        </div>
      </header>

      {post.title && (
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-base font-semibold text-ink">
          {post.title}
        </h3>
      )}
      <p
        dir="auto"
        className="mt-3 whitespace-pre-wrap text-pretty text-sm leading-relaxed text-ink-soft"
      >
        {post.body}
      </p>

      <div className="mt-4 flex items-center gap-1 border-t border-line/70 pt-3 text-sm text-muted">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={post.likedByMe}
          aria-label={t.like}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-2/60 focus-visible:outline-2"
          style={{ color: post.likedByMe ? "var(--color-gold)" : undefined }}
        >
          <HeartIcon size={17} fill={post.likedByMe ? "currentColor" : "none"} />
          <span className="tabular-nums">{post.likeCount}</span>
        </button>
        <button
          type="button"
          onClick={toggleComments}
          aria-expanded={post.commentsOpen}
          aria-label={t.comments}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-2/60 hover:text-ink-soft focus-visible:outline-2"
        >
          <CommentIcon size={17} />
          <span className="tabular-nums">{post.commentCount}</span>
        </button>
      </div>

      {post.commentsOpen && (
        <CommentThread
          locale={locale}
          t={t}
          postId={post.id}
          selfName={selfName}
          comments={post.comments}
          loading={commentsPending && post.comments === null}
          onAdded={(comments) =>
            onPatch({ comments, commentCount: comments.length })
          }
        />
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Comment thread
// ---------------------------------------------------------------------------

function CommentThread({
  locale,
  t,
  postId,
  selfName,
  comments,
  loading,
  onAdded,
}: {
  locale: Locale;
  t: CommunityCopy;
  postId: string;
  selfName: string;
  comments: FeedComment[] | null;
  loading: boolean;
  onAdded: (comments: FeedComment[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    const value = draft.trim();
    if (!value || pending) return;
    startTransition(async () => {
      const res = await addCommentAction({ locale, postId, body: value });
      if (res.ok) {
        onAdded(res.comments);
        setDraft("");
      }
    });
  };

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-[8px] bg-bg-deep/70 p-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      {loading ? (
        <p className="text-xs text-muted">…</p>
      ) : comments && comments.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => {
            const name = c.author.displayName || (c.isMine ? selfName : t.members);
            return (
              <li key={c.id} className="flex items-start gap-2.5">
                <Avatar initials={initialsOf(name)} size={30} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-ink">
                      {name}
                    </span>
                    <span className="text-[0.7rem] text-muted">
                      {relativeTime(c.createdAt, locale)}
                    </span>
                  </div>
                  <p
                    dir="auto"
                    className="text-pretty text-xs leading-relaxed text-ink-soft"
                  >
                    {c.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted">{t.comments}</p>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor={`comment-${postId}`} className="sr-only">
          {t.addComment}
        </label>
        <input
          id={`comment-${postId}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t.commentPlaceholder}
          dir="auto"
          className="min-w-0 flex-1 rounded-[8px] bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_1px_var(--color-gold)]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={pending || draft.trim().length === 0}
          aria-label={t.addComment}
          className="bg-ink text-bg-deep inline-flex shrink-0 items-center justify-center rounded-[6px] p-2.5 transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon size={16} />
        </button>
      </div>
    </div>
  );
}
