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
        {/* video stage */}
        <div className="relative aspect-video w-full bg-[radial-gradient(130%_130%_at_50%_-10%,oklch(0.34_0.06_267),oklch(0.11_0.035_268))]">
          {/* faint aurora wash for cinematic depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(60%_70%_at_72%_18%,oklch(0.62_0.215_294_/_0.28),transparent_60%),radial-gradient(55%_60%_at_22%_85%,oklch(0.6_0.18_262_/_0.22),transparent_55%)]"
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-aurora text-ink [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5),inset_0_1px_0_oklch(1_0_0_/_0.2),0_0_50px_-6px_oklch(0.62_0.215_294_/_0.75)]">
              <IconPlay width={22} height={22} />
            </span>
          </div>
          {/* chapter ticks */}
          <div className="absolute inset-x-4 bottom-4">
            <div className="relative h-1.5 rounded-full bg-bg-deep/70">
              <div className="h-full w-[42%] rounded-full bg-gold-grad" />
              <span className="absolute -top-0.5 left-[42%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold [box-shadow:0_0_0_3px_oklch(0.11_0.035_268),0_0_10px_oklch(0.83_0.13_88_/_0.6)]" />
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
