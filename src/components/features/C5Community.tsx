import { Reveal, SectionHeading } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { content } from "@/content/features";
import { Section } from "./Section";
import { IconHeartChat, Avatar } from "./bits";

/** C5 — Community & Messaging. A live feed mock beside a 1:1 chat mock. */
export function C5Community({ locale }: { locale: Locale }) {
  const t = content[locale].c5;

  return (
    <Section className="py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <SectionHeading title={t.title} subtitle={t.subtitle} />
        <span aria-hidden className="gilt-rule mt-8 max-w-[140px] opacity-60" />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Feed */}
        <Reveal y={24}>
          <div className="panel-couture overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="text-sm font-medium text-ink">{t.feedTitle}</div>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            </div>

            <div className="divide-y divide-line">
              {t.posts.map((post) => (
                <article key={post.author} className="flex gap-3.5 px-5 py-4">
                  <Avatar name={post.author} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{post.author}</span>
                      <span className="text-xs text-muted">· {post.time}</span>
                      {post.tag && (
                        <span className="ms-auto rounded-full px-2 py-0.5 text-[11px] font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
                          {post.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{post.text}</p>
                    <div className="mt-2.5 flex items-center gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <IconHeartChat kind="heart" />
                        {post.likes}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <IconHeartChat kind="comment" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* AI community manager note */}
            <div className="m-4 mt-0 rounded-[8px] bg-bg-deep/60 p-3.5 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.22)]">
              <p className="text-xs leading-relaxed text-ink-soft">
                <span className="font-semibold text-gold">AI · </span>
                {t.aiManagerNote}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Chat */}
        <Reveal y={24} delay={0.08}>
          <div className="panel-couture flex h-full flex-col overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <Avatar name={t.messages[0]?.from === "them" ? "M" : "?"} small />
              <div>
                <div className="text-sm font-medium text-ink">{t.chatTitle}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  {t.chatStatus}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 px-5 py-5">
              {t.messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-[10px] px-3.5 py-2.5 text-sm ${
                      m.from === "me"
                        ? "bg-ink text-bg-deep [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.25)]"
                        : "bg-bg-deep text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                    }`}
                  >
                    {m.text}
                    <span
                      className={`ms-2 align-baseline text-[10px] ${
                        m.from === "me" ? "text-bg-deep/60" : "text-muted"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="m-4 mt-0 flex items-center gap-2 rounded-[8px] bg-bg-deep px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
              <span className="flex-1 text-sm text-muted">{t.composer}</span>
              <span className="grid h-7 w-7 place-items-center rounded-[6px] bg-ink text-bg-deep">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 12l16-8-6 16-3-6-7-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="rtl:scale-x-[-1]" />
                </svg>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default C5Community;
