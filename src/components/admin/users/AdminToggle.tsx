"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  grantPlatformAdmin,
  revokePlatformAdmin,
} from "@/app/[locale]/admin/actions";

/* ---------------------------------------------------------------------------
   PLATFORM ADMIN · Users — Grant / Revoke platform-admin row control.

   Posts to the platform-admin server actions (gated by requirePlatformAdmin
   server-side — never trust this client). Two-step inline confirm guards the
   mutation. The action layer refuses to remove the LAST platform admin and a
   sole admin's self-revoke; we surface whatever error string it returns
   (e.g. the "last admin" message) inline.

   Distinct STEEL accent (not academy gold) to keep the platform surface
   visually separate. Logical CSS props throughout for RTL.
--------------------------------------------------------------------------- */

/** Local mirror of the codebase-standard server-action state shape. */
type AdminActionState = { error?: string; notice?: string };

const initial: AdminActionState = {};

const grantBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[oklch(0.72_0.13_255)] transition-colors hover:text-[oklch(0.8_0.13_255)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.35)] disabled:opacity-50";

const revokeBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[oklch(0.78_0.16_22)] transition-colors hover:text-[oklch(0.84_0.16_22)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.3)] disabled:opacity-50";

const ghostSm =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] disabled:opacity-50";

export function AdminToggle({
  locale,
  userId,
  isAdmin,
  labels,
}: {
  locale: Locale;
  userId: string;
  /** Current platform-admin state — decides grant vs revoke. */
  isAdmin: boolean;
  labels: {
    grant: string;
    revoke: string;
    confirm: string;
    cancel: string;
  };
}) {
  const action = isAdmin ? revokePlatformAdmin : grantPlatformAdmin;
  const [state, formAction] = useActionState<AdminActionState, FormData>(
    // Cast: the server action is typed by its owner; we bind it to the
    // codebase-standard { error?, notice? } state contract for useActionState.
    action as unknown as (
      prev: AdminActionState,
      data: FormData,
    ) => Promise<AdminActionState>,
    initial,
  );
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col items-end gap-1.5">
      {confirming ? (
        <form
          action={formAction}
          className="flex items-center gap-1.5"
          onSubmit={() => setConfirming(false)}
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="userId" value={userId} />
          <ConfirmButton
            label={labels.confirm}
            danger={isAdmin}
            grantCls={grantBtn}
            revokeCls={revokeBtn}
          />
          <CancelButton label={labels.cancel} onCancel={() => setConfirming(false)} />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={isAdmin ? revokeBtn : grantBtn}
        >
          {isAdmin ? labels.revoke : labels.grant}
        </button>
      )}

      {state.error && (
        <p
          className="max-w-[14rem] text-end text-xs text-[oklch(0.78_0.16_22)]"
          role="alert"
        >
          {state.error}
        </p>
      )}
    </div>
  );
}

function ConfirmButton({
  label,
  danger,
  grantCls,
  revokeCls,
}: {
  label: string;
  danger: boolean;
  grantCls: string;
  revokeCls: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={danger ? revokeCls : grantCls}
      aria-busy={pending}
    >
      {label}
    </button>
  );
}

function CancelButton({
  label,
  onCancel,
}: {
  label: string;
  onCancel: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      onClick={onCancel}
      disabled={pending}
      className={ghostSm}
    >
      {label}
    </button>
  );
}
