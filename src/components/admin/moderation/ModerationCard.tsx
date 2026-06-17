import type { Locale } from "@/lib/i18n";
import type { ModerationItem } from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { FlagIcon } from "./icons";
import { ModerationActions } from "./ModerationActions";

/** Localised, absolute-friendly date for the report timestamp. */
function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

const STATUS_TONE: Record<
  ModerationItem["status"],
  { fg: string; rim: string }
> = {
  // open + reviewing = needs attention → steel/critical platform accent.
  open: { fg: "oklch(0.78 0.13 28)", rim: "oklch(0.66 0.2 28 / 0.4)" },
  reviewing: { fg: "oklch(0.82 0.11 75)", rim: "oklch(0.7 0.12 75 / 0.4)" },
  // resolved states = calm neutral.
  actioned: { fg: "oklch(0.8 0.1 150)", rim: "oklch(0.62 0.12 150 / 0.4)" },
  dismissed: { fg: "var(--color-muted)", rim: "var(--color-line)" },
};

export interface ModerationCardProps {
  locale: Locale;
  item: ModerationItem;
}

/**
 * One cross-tenant content report. Presentational + server-safe; the action
 * buttons live in the <ModerationActions> client island.
 */
export function ModerationCard({ locale, item }: ModerationCardProps) {
  const t = adminDict[locale].moderation;
  const tone = STATUS_TONE[item.status];

  const statusLabel: Record<ModerationItem["status"], string> = {
    open: t.open,
    reviewing: t.reviewing,
    actioned: t.markActioned,
    dismissed: t.dismiss,
  };

  const entityLabel = item.entityType === "comment" ? t.comment : t.post;

  return (
    <article className="panel-premium flex flex-col gap-4 p-5">
      {/* Header — academy, entity type, status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2/70 text-[oklch(0.7_0.12_250)] [box-shadow:inset_0_0_0_1px_oklch(0.5_0.06_250_/_0.45)]"
          >
            <FlagIcon width={18} height={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {item.academyName}
            </p>
            <p className="text-xs text-muted">
              {t.entity}: {entityLabel}
            </p>
          </div>
        </div>

        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.08em]"
          style={{
            color: tone.fg,
            boxShadow: `inset 0 0 0 1px ${tone.rim}`,
          }}
        >
          {statusLabel[item.status]}
        </span>
      </div>

      {/* Reported content excerpt */}
      <blockquote className="rounded-xl bg-bg-deep/60 px-4 py-3 text-sm text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        {item.excerpt ? (
          <p className="whitespace-pre-wrap break-words">{item.excerpt}</p>
        ) : (
          <p className="italic text-muted">
            {locale === "he"
              ? "התוכן אינו זמין (ייתכן שכבר הוסר)."
              : "Content unavailable (it may already be removed)."}
          </p>
        )}
      </blockquote>

      {/* Meta — reason, reporter, date */}
      <dl className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <dt className="font-semibold uppercase tracking-[0.06em] text-muted">
            {t.reason}
          </dt>
          <dd className="text-ink-soft">{item.reason || "—"}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="font-semibold uppercase tracking-[0.06em] text-muted">
            {t.reporter}
          </dt>
          <dd className="text-ink-soft">{item.reporterName}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="font-semibold uppercase tracking-[0.06em] text-muted">
            {adminDict[locale].academies.created}
          </dt>
          <dd className="tabular-nums text-ink-soft">
            {formatDate(item.createdAt, locale)}
          </dd>
        </div>
      </dl>

      {/* Action island */}
      <ModerationActions locale={locale} item={item} />
    </article>
  );
}
