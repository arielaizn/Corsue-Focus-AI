"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading, BrowserFrame } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import { HeartIcon, CommentIcon, ShareIcon, PinIcon } from "./icons";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["feed"];

function FeedPostCard({ post, t }: { post: T["posts"][number]; t: T }) {
  const reduced = useReducedMotion();
  const [liked, setLiked] = useState(false);
  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <article className="rounded-xl bg-surface/50 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)] sm:p-5">
      {post.pinned && (
        <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-gold">
          <PinIcon size={13} />
          <span>{t.pinnedLabel}</span>
        </div>
      )}
      <header className="flex items-center gap-3">
        <Avatar initials={post.initials} size={44} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="truncate font-semibold text-ink">{post.author}</span>
            <span className="text-xs text-muted">{post.handle}</span>
          </div>
          <p className="truncate text-xs text-muted">
            {post.role} · {post.time}
          </p>
        </div>
      </header>

      <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-soft">{post.body}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.hashtags.map((h) => (
          <span
            key={h}
            className="rounded-md bg-[oklch(0.62_0.2_264_/_0.12)] px-2 py-0.5 text-xs font-medium text-[oklch(0.8_0.12_264)]"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-line/70 pt-3 text-sm text-muted">
        <motion.button
          type="button"
          onClick={() => setLiked((v) => !v)}
          whileTap={reduced ? undefined : { scale: 0.92 }}
          aria-pressed={liked}
          aria-label={t.likeLabel}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-2/60 focus-visible:outline-2"
          style={{ color: liked ? "var(--color-gold)" : undefined }}
        >
          <HeartIcon size={17} fill={liked ? "currentColor" : "none"} />
          <span className="tabular-nums">{likeCount}</span>
        </motion.button>
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
          <CommentIcon size={17} />
          <span className="tabular-nums">{post.comments}</span>
        </span>
        <button
          type="button"
          aria-label={t.shareLabel}
          className="ms-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-2/60 hover:text-ink-soft focus-visible:outline-2"
        >
          <ShareIcon size={16} />
          <span className="hidden sm:inline">{t.shareLabel}</span>
        </button>
      </div>

      {/* top comment */}
      <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-bg/60 p-3">
        <Avatar initials={post.topComment.initials} size={30} />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-ink">{post.topComment.author}</span>
          <p className="text-pretty text-xs leading-relaxed text-ink-soft">{post.topComment.body}</p>
        </div>
      </div>
    </article>
  );
}

export function FeedSection({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
        <Reveal className="lg:sticky lg:top-28">
          <SectionHeading title={t.title} subtitle={t.subtitle} />
        </Reveal>

        <Reveal y={28}>
          <BrowserFrame url="app.coursefocus.ai/community">
            <div className="space-y-4 p-4 sm:p-5" dir="auto">
              {/* composer */}
              <div className="rounded-xl bg-surface/60 p-3.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                <div className="flex items-center gap-3">
                  <Avatar initials={t.selfInitials} size={36} />
                  <div className="flex-1 rounded-lg bg-bg px-3.5 py-2.5 text-sm text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                    {t.composerPlaceholder}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 ps-12">
                  {t.composerHints.map((h) => (
                    <span
                      key={h}
                      className="rounded-md px-2 py-1 text-xs text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                    >
                      {h}
                    </span>
                  ))}
                  <span className="bg-aurora ms-auto rounded-lg px-3.5 py-1.5 text-xs font-semibold text-ink">
                    {t.composerPost}
                  </span>
                </div>
              </div>

              {t.posts.map((p, i) => (
                <FeedPostCard key={i} post={p} t={t} />
              ))}
            </div>
          </BrowserFrame>
        </Reveal>
      </div>
    </section>
  );
}

export default FeedSection;
