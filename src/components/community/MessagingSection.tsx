import { Reveal, SectionHeading } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import {
  PhoneCallIcon,
  VideoIcon,
  PaperclipIcon,
  MicIcon,
  SendIcon,
  FileIcon,
} from "./icons";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["messaging"];
type Msg = T["messages"][number];

function Bubble({ m }: { m: Msg }) {
  const self = !!m.self;

  const body = (() => {
    if (m.kind === "file") {
      return (
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[oklch(0.76_0.105_80_/_0.14)] text-gold">
            <FileIcon size={18} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">{m.fileName}</span>
            <span className="block text-xs text-muted">{m.fileMeta}</span>
          </span>
        </span>
      );
    }
    if (m.kind === "voice") {
      return (
        <span className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-3 text-ink">
            <MicIcon size={16} />
          </span>
          <span aria-hidden className="flex items-end gap-[3px]">
            {[7, 12, 9, 16, 11, 18, 8, 14, 6, 13, 9, 5].map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-[oklch(0.66_0.01_75)]"
                style={{ height: h }}
              />
            ))}
          </span>
          <span className="text-xs tabular-nums text-muted">{m.voiceLen}</span>
        </span>
      );
    }
    return <span className="text-sm leading-relaxed text-ink-soft">{m.text}</span>;
  })();

  return (
    <div className={`flex items-end gap-2.5 ${self ? "flex-row-reverse" : ""}`}>
      {!self && <Avatar initials={m.initials ?? "?"} size={30} />}
      <div className="max-w-[78%]">
        {!self && (
          <span className="mb-1 block text-xs font-medium text-muted ps-1">{m.author}</span>
        )}
        <div
          className={
            self
              ? "rounded-[10px] rounded-ee-sm bg-surface-3 px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]"
              : "rounded-[10px] rounded-es-sm bg-surface-2/70 px-3.5 py-2.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
          }
        >
          {body}
        </div>
        <span className={`mt-1 block text-[11px] text-muted ${self ? "text-end pe-1" : "ps-1"}`}>
          {m.time}
        </span>
      </div>
    </div>
  );
}

export function MessagingSection({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-32 sm:py-44">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        {/* chat mock — gallery-framed, flat, no glow */}
        <Reveal y={28} className="lg:order-2">
          <div className="frame mx-auto w-full max-w-[460px] overflow-hidden">
            {/* thread header */}
            <div className="flex items-center gap-3 border-b border-line bg-surface/40 px-4 py-3">
              <Avatar initials="MM" size={38} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{t.threadName}</p>
                <p className="flex items-center gap-1.5 truncate text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
                  {t.threadMeta}
                </p>
              </div>
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft"
              >
                <PhoneCallIcon size={18} />
              </span>
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft"
              >
                <VideoIcon size={19} />
              </span>
            </div>

            {/* messages */}
            <div className="space-y-3.5 bg-bg px-4 py-5" dir="auto">
              {t.messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
            </div>

            {/* composer */}
            <div className="flex items-center gap-2 border-t border-line bg-surface/40 px-3 py-3">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-lg text-muted"
              >
                <PaperclipIcon size={18} />
              </span>
              <div className="flex-1 rounded-full bg-bg px-4 py-2 text-sm text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                {t.inputPlaceholder}
              </div>
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-lg text-muted"
              >
                <MicIcon size={18} />
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-bg-deep">
                <SendIcon size={17} />
              </span>
            </div>
          </div>
        </Reveal>

        {/* copy */}
        <Reveal className="lg:order-1">
          <SectionHeading title={t.title} subtitle={t.subtitle} />
          <span aria-hidden className="gilt-rule mt-10 max-w-[8rem] opacity-60" />
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {t.capabilities.map((c) => (
              <li
                key={c}
                className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.05)]"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export default MessagingSection;
