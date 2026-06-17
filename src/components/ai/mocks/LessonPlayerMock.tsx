import { BrowserFrame } from "@/components/ui";
import type { AIContent } from "@/content/ai";
import { ChatPanel } from "../ChatPanel";
import { IconPlay } from "../icons";

/**
 * AI Lesson Assistant (#8) mock — a video lesson frame with a transport bar,
 * and the in-lesson AI assistant chat docked beneath it (answers grounded in
 * the lesson, with timestamp references in the copy).
 */
export function LessonPlayerMock({
  data,
}: {
  data: AIContent["lessonAssistant"];
}) {
  return (
    <div className="flex flex-col gap-3">
      <BrowserFrame url="app.coursefocus.ai/learn">
        {/* video stage — flat true-black, gilt play button, no glow */}
        <div className="relative aspect-video w-full bg-bg-deep [background-image:linear-gradient(180deg,oklch(0.16_0_0),oklch(0.11_0_0))]">
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.45),inset_0_1px_0_oklch(1_0_0_/_0.05)]">
              <IconPlay width={22} height={22} />
            </span>
          </div>
          {/* chapter ticks */}
          <div className="absolute inset-x-4 bottom-4">
            <div className="relative h-1 rounded-full bg-bg-deep/80 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
              <div className="h-full w-[42%] rounded-full bg-gold-grad" />
              <span className="absolute -top-0.5 left-[42%] h-2 w-2 -translate-x-1/2 rounded-full bg-gold [box-shadow:0_0_0_3px_oklch(0.11_0_0)]" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
              <span>04:12</span>
              <div className="flex gap-2">
                <span className="rounded bg-bg-deep/70 px-1.5 py-0.5">1.5×</span>
                <span className="rounded bg-bg-deep/70 px-1.5 py-0.5">CC</span>
                <span className="rounded bg-bg-deep/70 px-1.5 py-0.5">PiP</span>
              </div>
              <span>09:48</span>
            </div>
          </div>
        </div>
      </BrowserFrame>

      <ChatPanel
        title={data.tag}
        turns={data.chat}
        quickActions={data.quickActions}
        placeholder=""
      />
    </div>
  );
}

export default LessonPlayerMock;
