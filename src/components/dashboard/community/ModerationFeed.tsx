"use client";

import { useEffect, useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import type { ModPost, ModComment } from "@/lib/data/community-admin";
import {
  setPostPinned,
  deletePost,
  deleteComment,
  loadThread,
} from "@/app/[locale]/dashboard/community/actions";
import { communityDict } from "./dict";
import { chipBtn, dangerBtn, dangerText } from "./styles";
import { Avatar } from "./Avatar";
import { timeAgo } from "./util";
import { Pill } from "@/components/dashboard/ui";

interface Ctx {
  locale: Locale;
  academyId: string;
  canWrite: boolean;
}

export function ModerationFeed({
  locale,
  academyId,
  canWrite,
  posts,
}: Ctx & { posts: ModPost[] }) {
  const t = communityDict[locale].feed;

  if (posts.length === 0) {
    return (
      <div className="rounded-xl bg-surface-2/40 px-5 py-10 text-center [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <p className="font-[family-name:var(--font-display)] text-base font-semibold text-ink">
          {t.empty.title}
        </p>
        <p className="mt-1.5 text-sm text-ink-soft">{t.empty.body}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts.map((p) => (
        <PostRow
          key={p.id}
          post={p}
          locale={locale}
          academyId={academyId}
          canWrite={canWrite}
        />
      ))}
    </ul>
  );
}

function PostRow({
  post,
  locale,
  academyId,
  canWrite,
}: Ctx & { post: ModPost }) {
  const t = communityDict[locale].feed;
  const [pinning, startPin] = useTransition();
  const [open, setOpen] = useState(false);

  function togglePin() {
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("academyId", academyId);
    fd.set("postId", post.id);
    fd.set("pinned", String(!post.is_pinned));
    // setPostPinned now returns an action-state; on success revalidation
    // refreshes the pin badge. Await so the transition spans the round-trip.
    startPin(async () => {
      await setPostPinned(fd);
    });
  }

  return (
    <li className="rounded-xl bg-surface-2/40 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <div className="flex items-start gap-3">
        <Avatar name={post.author?.display_name} url={post.author?.avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-ink">
              {post.author?.display_name ?? t.anon}
            </span>
            <span className="text-xs text-muted">
              {timeAgo(post.created_at, locale)}
            </span>
            {post.is_announcement && <Pill tone="gold">{t.announcement}</Pill>}
            {post.is_pinned && <Pill tone="neutral">{t.pinned}</Pill>}
          </div>

          {post.title && (
            <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-sm font-semibold text-ink">
              {post.title}
            </h3>
          )}
          <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-sm text-ink-soft">
            {post.body}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span className="tabular-nums">
              {post.like_count} {t.likes}
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="tabular-nums underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {post.comment_count} {t.comments} ·{" "}
              {open ? t.hideThread : t.viewThread}
            </button>
          </div>

          {canWrite && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line/50 pt-3">
              <button
                type="button"
                onClick={togglePin}
                disabled={pinning}
                className={chipBtn}
              >
                {post.is_pinned ? t.unpin : t.pin}
              </button>
              <DeletePostButton
                locale={locale}
                academyId={academyId}
                postId={post.id}
              />
            </div>
          )}

          {open && (
            <Thread
              locale={locale}
              academyId={academyId}
              postId={post.id}
              canWrite={canWrite}
            />
          )}
        </div>
      </div>
    </li>
  );
}

function DeletePostButton({
  locale,
  academyId,
  postId,
}: {
  locale: Locale;
  academyId: string;
  postId: string;
}) {
  const t = communityDict[locale].feed;
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={dangerBtn}
      >
        {t.delete}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5" role="group">
      <span className="text-xs text-ink-soft">
        {failed ? t.deleteFailed : t.deleteConfirm}
      </span>
      <button
        type="button"
        autoFocus
        disabled={pending}
        onClick={() => {
          const fd = new FormData();
          fd.set("locale", locale);
          fd.set("academyId", academyId);
          fd.set("postId", postId);
          setFailed(false);
          start(async () => {
            // On success revalidation removes the row; on failure surface it
            // instead of silently leaving the post in place.
            const res = await deletePost(fd);
            if (res?.error) setFailed(true);
          });
        }}
        className={dangerBtn}
      >
        {t.confirm}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-3/50 hover:text-ink"
      >
        {t.cancel}
      </button>
    </span>
  );
}

function Thread({
  locale,
  academyId,
  postId,
  canWrite,
}: Ctx & { postId: string }) {
  const t = communityDict[locale].feed;
  const [comments, setComments] = useState<ModComment[] | null>(null);
  const [pending, start] = useTransition();

  // Lazy-load the thread on first mount (the parent only renders <Thread/> once
  // the row is expanded). Effect — never start a transition during render.
  useEffect(() => {
    start(async () => {
      const rows = await loadThread(academyId, postId);
      setComments(rows);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academyId, postId]);

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-line/50 pt-3 ps-3 ms-1 border-s">
      {pending && comments === null ? (
        <p className="text-xs text-muted">···</p>
      ) : comments && comments.length > 0 ? (
        comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2">
            <Avatar
              name={c.author?.display_name}
              url={c.author?.avatar_url}
              size={24}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-semibold text-ink">
                  {c.author?.display_name ?? t.anon}
                </span>
                <span className="text-[0.7rem] text-muted">
                  {timeAgo(c.created_at, locale)}
                </span>
                {c.is_pinned && <Pill tone="neutral">{t.pinned}</Pill>}
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-xs text-ink-soft">
                {c.body}
              </p>
            </div>
            {canWrite && (
              <DeleteCommentButton
                locale={locale}
                academyId={academyId}
                commentId={c.id}
                onDone={() =>
                  setComments((prev) =>
                    (prev ?? []).filter((x) => x.id !== c.id),
                  )
                }
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-xs text-muted">{t.threadEmpty}</p>
      )}
    </div>
  );
}

function DeleteCommentButton({
  locale,
  academyId,
  commentId,
  onDone,
}: {
  locale: Locale;
  academyId: string;
  commentId: string;
  onDone: () => void;
}) {
  const t = communityDict[locale].feed;
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={t.deleteComment}
        title={t.deleteComment}
        className="shrink-0 rounded-md px-1.5 py-0.5 text-[oklch(0.78_0.16_22)] transition-colors hover:bg-[oklch(0.78_0.16_22_/_0.12)]"
      >
        <span aria-hidden className="text-xs">
          ✕
        </span>
      </button>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1" role="group">
      {failed && (
        <span className={`text-[0.7rem] ${dangerText}`} role="alert">
          {t.deleteFailed}
        </span>
      )}
      <button
        type="button"
        autoFocus
        disabled={pending}
        onClick={() => {
          const fd = new FormData();
          fd.set("locale", locale);
          fd.set("academyId", academyId);
          fd.set("commentId", commentId);
          setFailed(false);
          start(async () => {
            const res = await deleteComment(fd);
            // Only drop the comment optimistically when the soft-delete really
            // succeeded; on an RLS no-op / error keep it and surface a failure.
            if (res?.error) setFailed(true);
            else onDone();
          });
        }}
        className="rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold text-[oklch(0.78_0.16_22)] transition-colors hover:bg-[oklch(0.78_0.16_22_/_0.12)]"
      >
        {t.confirm}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        {t.cancel}
      </button>
    </span>
  );
}
