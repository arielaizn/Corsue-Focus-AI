"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { ModerationItem } from "@/lib/data/platform";
import { cn } from "@/lib/cn";
import { adminDict } from "@/lib/admin-dictionary";
import { moderateContent, resolveReport } from "@/app/[locale]/admin/actions";
import { TrashIcon, CheckIcon, DismissIcon } from "./icons";

/* ---------------------------------------------------------------------------
   MODERATION ROW ACTIONS — Remove content / Mark actioned / Dismiss.

   Defense in depth: the server actions (moderateContent / resolveReport) each
   re-run requirePlatformAdmin server-side — never trust this client. These are
   the client affordances only. On success the action revalidates the queue, so
   the resolved/removed row simply re-renders; we surface only the error path.

   Distinct STEEL/critical accent (not academy gold) to keep the platform
   surface visually separate. Logical CSS props throughout for RTL.
--------------------------------------------------------------------------- */

/**
 * Local mirror of the codebase-standard admin server-action state shape
 * (see AcademyRowActions / AdminToggle). `error` is either a ready message or a
 * key into adminDict.errors. Declared locally so this leaf never hard-depends
 * on an internal export of the actions module.
 */
type AdminActionState = { error?: string };

const initial: AdminActionState = {};

/** Bind an owner-typed action to the local useActionState reducer contract. */
type Reducer = (
  prev: AdminActionState,
  data: FormData,
) => Promise<AdminActionState>;

type Variant = "danger" | "primary" | "neutral";

const VARIANT_CLS: Record<Variant, string> = {
  // Remove content — destructive, true-red.
  danger:
    "text-[oklch(0.82_0.14_22)] [box-shadow:inset_0_0_0_1px_oklch(0.6_0.2_22_/_0.45)] hover:bg-[oklch(0.6_0.2_22_/_0.12)] hover:[box-shadow:inset_0_0_0_1px_oklch(0.6_0.2_22_/_0.7)]",
  // Mark actioned — affirmative green.
  primary:
    "text-[oklch(0.82_0.1_150)] [box-shadow:inset_0_0_0_1px_oklch(0.6_0.12_150_/_0.45)] hover:bg-[oklch(0.6_0.12_150_/_0.12)] hover:[box-shadow:inset_0_0_0_1px_oklch(0.6_0.12_150_/_0.7)]",
  // Dismiss — calm neutral.
  neutral:
    "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)] hover:bg-surface-2/60 hover:text-ink",
};

function ActionButton({
  label,
  pendingLabel,
  icon,
  variant,
}: {
  label: string;
  pendingLabel: string;
  icon: React.ReactNode;
  variant: Variant;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] px-3.5 py-2 text-xs font-semibold transition-[transform,color,box-shadow,background-color] duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0",
        VARIANT_CLS[variant],
      )}
    >
      <span aria-hidden className="shrink-0">
        {icon}
      </span>
      {pending ? pendingLabel : label}
    </button>
  );
}

/** Resolve a returned error into a display string (key→dict, else raw). */
function errorText(locale: Locale, error: string | undefined): string {
  if (!error) return "";
  const errs = adminDict[locale].errors as Record<string, string>;
  return errs[error] ?? error;
}

export interface ModerationActionsProps {
  locale: Locale;
  item: ModerationItem;
}

export function ModerationActions({ locale, item }: ModerationActionsProps) {
  const t = adminDict[locale].moderation;
  const common = adminDict[locale].common;

  const [removeState, removeAction] = useActionState<AdminActionState, FormData>(
    moderateContent as unknown as Reducer,
    initial,
  );
  const [resolveState, resolveAction] = useActionState<
    AdminActionState,
    FormData
  >(resolveReport as unknown as Reducer, initial);

  // open + reviewing reports are still actionable; resolved ones only keep the
  // "Remove content" affordance (the content may still be live).
  const isOpen = item.status === "open" || item.status === "reviewing";

  const error = removeState.error ?? resolveState.error;

  return (
    <div className="flex flex-col gap-2 border-t border-[var(--color-line)] pt-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Remove content → moderateContent (soft-delete the post/comment) */}
        <form action={removeAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="reportId" value={item.reportId} />
          <input type="hidden" name="academyId" value={item.academyId} />
          <input type="hidden" name="entityType" value={item.entityType} />
          <input type="hidden" name="entityId" value={item.entityId} />
          <ActionButton
            label={t.removeContent}
            pendingLabel={common.loading}
            icon={<TrashIcon />}
            variant="danger"
          />
        </form>

        {isOpen && (
          <>
            {/* Mark actioned → resolveReport(status=actioned) */}
            <form action={resolveAction}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="reportId" value={item.reportId} />
              <input type="hidden" name="academyId" value={item.academyId} />
              <input type="hidden" name="status" value="actioned" />
              <ActionButton
                label={t.markActioned}
                pendingLabel={common.loading}
                icon={<CheckIcon />}
                variant="primary"
              />
            </form>

            {/* Dismiss → resolveReport(status=dismissed) */}
            <form action={resolveAction}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="reportId" value={item.reportId} />
              <input type="hidden" name="academyId" value={item.academyId} />
              <input type="hidden" name="status" value="dismissed" />
              <ActionButton
                label={t.dismiss}
                pendingLabel={common.loading}
                icon={<DismissIcon />}
                variant="neutral"
              />
            </form>
          </>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="text-start text-xs text-[oklch(0.82_0.14_22)]"
        >
          {errorText(locale, error)}
        </p>
      )}
    </div>
  );
}
