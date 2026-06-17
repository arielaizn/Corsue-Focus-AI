"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { suspendAcademy, reinstateAcademy } from "@/app/[locale]/admin/actions";

/* ---------------------------------------------------------------------------
   PLATFORM ADMIN · Academies — Inspect link + Suspend / Reinstate row control.

   Posts to the platform-admin server actions (each re-asserts
   requirePlatformAdmin server-side — never trust this client). Defense in
   depth lives in the action layer; this is the affordance only.

   - Inspect    → read-only deep link to /[locale]/admin/academies/[id]
                  (renders the tenant's overview via the admin RLS bypass; NO
                  session swap).
   - Reinstate  (suspended → active): one-click form, no confirm.
   - Suspend    (active → suspended): DESTRUCTIVE — hides the tenant from every
                  user — gated behind an inline TYPED confirm (operator must
                  type the academy slug) so a stray click can't take a tenant
                  offline.

   Distinct STEEL accent (not academy gold); danger uses the critical red.
   Logical CSS props throughout for RTL.
--------------------------------------------------------------------------- */

/** Local mirror of the codebase-standard server-action state shape. */
type AdminActionState = { error?: string; notice?: string };

const initial: AdminActionState = {};

/** Bind an owner-typed server action to the useActionState reducer contract. */
function asReducer(action: unknown) {
  return action as unknown as (
    prev: AdminActionState,
    data: FormData,
  ) => Promise<AdminActionState>;
}

const inspectBtn =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-[oklch(0.72_0.13_255)] transition-colors hover:text-[oklch(0.8_0.13_255)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.35)]";

const dangerBtn =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-[oklch(0.78_0.16_22)] transition-colors hover:text-[oklch(0.84_0.16_22)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.3)] disabled:cursor-not-allowed disabled:opacity-45";

const reinstateBtn =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:opacity-80 [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)] disabled:opacity-50";

const ghostSm =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink disabled:opacity-50";

export function AcademyRowActions({
  locale,
  academyId,
  slug,
  status,
  labels,
}: {
  locale: Locale;
  academyId: string;
  /** The academy slug — the typed-confirm token for suspend. */
  slug: string;
  status: "active" | "suspended";
  labels: {
    inspect: string;
    suspend: string;
    reinstate: string;
    confirmSuspend: string;
    confirm: string;
    cancel: string;
    loading: string;
  };
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/${locale}/admin/academies/${academyId}`}
        className={inspectBtn}
      >
        {labels.inspect}
      </Link>

      {status === "active" ? (
        <SuspendControl
          locale={locale}
          academyId={academyId}
          slug={slug}
          labels={labels}
        />
      ) : (
        <ReinstateControl
          locale={locale}
          academyId={academyId}
          labels={labels}
        />
      )}
    </div>
  );
}

/* --------------------------------- Suspend -------------------------------- */

function SuspendControl({
  locale,
  academyId,
  slug,
  labels,
}: {
  locale: Locale;
  academyId: string;
  slug: string;
  labels: {
    suspend: string;
    confirmSuspend: string;
    cancel: string;
    loading: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const inputId = useId();
  const [state, formAction] = useActionState<AdminActionState, FormData>(
    asReducer(suspendAcademy),
    initial,
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={dangerBtn}>
        {labels.suspend}
      </button>
    );
  }

  const matches = typed.trim() === slug;

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center justify-end gap-2"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />
      <label htmlFor={inputId} className="sr-only">
        {labels.confirmSuspend}
      </label>
      <input
        id={inputId}
        name="confirm"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        dir="ltr"
        placeholder={slug}
        title={labels.confirmSuspend}
        className={cn(
          "w-32 rounded-lg bg-surface-2/60 px-2.5 py-1.5 text-xs text-ink placeholder:text-muted/60 outline-none [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.55)]",
          matches && "[box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.6)]",
        )}
      />
      <SuspendSubmit
        label={labels.suspend}
        pendingLabel={labels.loading}
        disabled={!matches}
      />
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setTyped("");
        }}
        className={ghostSm}
      >
        {labels.cancel}
      </button>
      {state.error && (
        <p
          role="alert"
          className="w-full max-w-[16rem] text-end text-xs text-[oklch(0.78_0.16_22)]"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}

function SuspendSubmit({
  label,
  pendingLabel,
  disabled,
}: {
  label: string;
  pendingLabel: string;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={dangerBtn}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/* -------------------------------- Reinstate ------------------------------- */

function ReinstateControl({
  locale,
  academyId,
  labels,
}: {
  locale: Locale;
  academyId: string;
  labels: { reinstate: string; loading: string };
}) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(
    asReducer(reinstateAcademy),
    initial,
  );
  return (
    <form action={formAction} className="flex items-center justify-end gap-2">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />
      <ReinstateSubmit label={labels.reinstate} pendingLabel={labels.loading} />
      {state.error && (
        <p role="alert" className="text-xs text-[oklch(0.78_0.16_22)]">
          {state.error}
        </p>
      )}
    </form>
  );
}

function ReinstateSubmit({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={reinstateBtn}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
