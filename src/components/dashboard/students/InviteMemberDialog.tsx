"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { Role } from "@/lib/auth";
import {
  inviteMember,
  type MembersActionState,
} from "@/app/[locale]/dashboard/students/actions";
import { studentsDict } from "./dict";
import { auroraBtn, ghostBtn, inputCls, dangerText } from "./styles";
import { Modal, Field } from "./Modal";
import { PlusIcon } from "@/components/dashboard/icons";

const initial: MembersActionState = {};

// Managers you can invite directly (students arrive via enrollment). Only an
// owner may grant the owner role, so admins never see it as an option (the
// server enforces this too).
const INVITE_ROLES = ["admin", "instructor", "owner"] as const;
type InviteRole = (typeof INVITE_ROLES)[number];

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = studentsDict[locale].invite;
  return (
    <button type="submit" disabled={pending} className={auroraBtn}>
      {pending ? t.submitting : t.submit}
    </button>
  );
}

export function InviteMemberDialog({
  locale,
  academyId,
  viewerRole,
}: {
  locale: Locale;
  academyId: string;
  /** The current viewer's role — admins can't grant 'owner'. */
  viewerRole: Role;
}) {
  const t = studentsDict[locale];
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(inviteMember, initial);

  const roleOptions: readonly InviteRole[] =
    viewerRole === "owner"
      ? INVITE_ROLES
      : INVITE_ROLES.filter((r) => r !== "owner");

  // Close on a successful send.
  useEffect(() => {
    if (state.notice) setOpen(false);
  }, [state.notice]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={auroraBtn}
      >
        <PlusIcon width={16} height={16} />
        {t.team.invite}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} label={t.invite.title}>
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
          {t.invite.title}
        </h2>

        <form action={formAction} className="mt-5 flex flex-col gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="academyId" value={academyId} />

          <Field label={t.invite.emailLabel}>
            <input
              name="email"
              type="email"
              required
              autoFocus
              placeholder={t.invite.emailPlaceholder}
              className={inputCls}
              dir="ltr"
            />
          </Field>

          <Field label={t.invite.roleLabel}>
            <select name="role" defaultValue="instructor" className={inputCls}>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {t.roles[r]}
                </option>
              ))}
            </select>
          </Field>

          {state.error && (
            <p className={`text-sm ${dangerText}`} role="alert">
              {state.error}
            </p>
          )}

          <div className="mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={ghostBtn}
            >
              {t.invite.cancel}
            </button>
            <SubmitButton locale={locale} />
          </div>
        </form>
      </Modal>
    </>
  );
}
