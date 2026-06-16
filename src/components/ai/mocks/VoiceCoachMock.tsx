import type { AIContent } from "@/content/ai";
import { IconMic } from "../icons";

/**
 * Voice Coach (#48) mock — a voice session surface: an animated waveform, a
 * live transcript caption, and listening cues (mode/language/voice).
 * The waveform animates via the shared float keyframe; reduced-motion stills it.
 */
export function VoiceCoachMock({ data }: { data: AIContent["voice"] }) {
  const bars = [10, 22, 14, 30, 18, 36, 24, 16, 28, 12, 32, 20, 26, 14, 22];
  return (
    <div className="overflow-hidden rounded-2xl bg-surface/40 [box-shadow:inset_0_0_0_1px_var(--color-line),0_24px_70px_-36px_oklch(0.6_0.25_300_/_0.5)]">
      <div className="flex items-center gap-3 border-b border-line bg-bg-deep/60 px-5 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-aurora text-ink [box-shadow:inset_0_0_0_1px_oklch(0.82_0.135_84_/_0.5)]">
          <IconMic width={16} height={16} />
        </span>
        <p className="text-sm font-semibold text-ink">{data.tag}</p>
      </div>

      <div className="p-5 sm:p-6">
        {/* waveform */}
        <div className="flex h-20 items-center justify-center gap-1.5 rounded-xl bg-bg-deep/50 px-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          {bars.map((b, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-[oklch(0.62_0.2_264)] to-[oklch(0.6_0.25_300)] motion-safe:animate-[float_1.6s_ease-in-out_infinite]"
              style={{ height: `${b + 8}px`, animationDelay: `${(i % 6) * 0.12}s` }}
            />
          ))}
        </div>

        {/* transcript */}
        <div className="mt-4">
          <p className="text-xs font-medium text-gold">{data.captionLabel}</p>
          <p className="mt-2 text-lg text-ink">{data.caption}</p>
        </div>

        {/* cues */}
        <div className="mt-5 flex flex-wrap gap-2">
          {data.cues.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-bg-deep/60 px-3 py-1 text-xs text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <span className="text-muted">{c.label}</span>
              <span className="font-medium text-ink">{c.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VoiceCoachMock;
