"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { Role } from "@/lib/auth";
import {
  updateMemberRole,
  removeMember,
  type MembersActionState,
} from "@/app/[locale]/dashboard/students/actions";
import { studentsDict } from "./dict";
import { selectSm, dangerBtnSm, dangerText } from "./styles";

const initial: MembersActionState = {};

// Roles a manager row can be set to (no "student" — that's the enrolled side).
const ROW_ROLES = ["owner", "admin", "instructor"] as const;
type RowRole = (typeof ROW_ROLES)[number];

/**
 * Inline per-row controls for a team member: a role <select> that auto-saves on
 * change, and a Remove button with an inline confirm. Disabled entirely when
 * the row is the last owner (locked) or the current user (no self-remove).
 */
export function MemberRowActions({
  locale,
  academyId,
  membershipId,
  role,
  locked,
  isSelf,
  viewerRole,
}: {
  locale: Locale;
  academyId: string;
  membershipId: string;
  role: Role;
  /** True for the last remaining owner — role + remove are both disabled. */
  locked: boolean;
  isSelf: boolean;
  /** The current viewer's role — admins can't grant 'owner'. */
  viewerRole: Role;
}) {
  const t = studentsDict[locale];
  const [roleState, roleAction] = useActionState(updateMemberRole, initial);
  const [removeState, removeAction] = useActionState(removeMember, initial);
  const [confirming, setConfirming] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const err = roleState.error || removeState.error;

  // Only an owner may grant the owner role (the server enforces this too).
  // Admins never see 'owner' as a selectable option — but if the row's own
  // current role is 'owner' we still include it so the <select> stays valid.
  const roleOptions: readonly RowRole[] =
    viewerRole === "owner"
      ? ROW_ROLES
      : ROW_ROLES.filter((r) => r !== "owner" || r === role);

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        {/* Role change — auto-submits on change. */}
        <form ref={formRef} action={roleAction} className="contents">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="academyId" value={academyId} />
          <input type="hidden" name="membershipId" value={membershipId} />
          <RoleSelect
            name="role"
            defaultValue={role}
            disabled={locked}
            onChange={() => formRef.current?.requestSubmit()}
            labels={t.roles}
            options={roleOptions}
          />
        </form>

        {/* Remove with inline confirm. */}
        {!locked && !isSelf ? (
          confirming ? (
            <form action={removeAction} className="flex items-center gap-1.5">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="academyId" value={academyId} />
              <input type="hidden" name="membershipId" value={membershipId} />
              <ConfirmRemove locale={locale} />
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-xs font-semibold text-muted hover:text-ink"
              >
                {t.invite.cancel}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={dangerBtnSm}
            >
              {t.team.remove}
            </button>
          )
        ) : null}
      </div>

      {err && (
        <p className={`text-xs ${dangerText}`} role="alert">
          {err}
        </p>
      )}
    </div>
  );
}

function RoleSelect({
  name,
  defaultValue,
  disabled,
  onChange,
  labels,
  options,
}: {
  name: string;
  defaultValue: Role;
  disabled: boolean;
  onChange: () => void;
  labels: Record<Role, string>;
  options: readonly RowRole[];
}) {
  const { pending } = useFormStatus();
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      disabled={disabled || pending}
      onChange={onChange}
      className={`${selectSm} disabled:opacity-50`}
      aria-label={labels[defaultValue]}
    >
      {options.map((r) => (
        <option key={r} value={r}>
          {labels[r]}
        </option>
      ))}
    </select>
  );
}

function ConfirmRemove({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = studentsDict[locale];
  return (
    <button
      type="submit"
      disabled={pending}
      title={t.team.removeConfirm}
      className={dangerBtnSm}
    >
      {pending ? t.invite.submitting : t.team.confirmShort}
    </button>
  );
}
