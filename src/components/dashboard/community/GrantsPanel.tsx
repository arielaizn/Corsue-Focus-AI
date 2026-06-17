"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { CommunityBadge } from "@/lib/data/community-admin";
import {
  grantXp,
  grantBadge,
  type CommunityActionState,
} from "@/app/[locale]/dashboard/community/actions";
import { communityDict } from "./dict";
import {
  primaryBtn,
  inputCls,
  labelCls,
  dangerText,
  noticeText,
} from "./styles";
import { cn } from "@/lib/cn";

const initial: CommunityActionState = {};

function XpSubmit({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = communityDict[locale].grants;
  return (
    <button type="submit" disabled={pending} className={primaryBtn}>
      {pending ? t.grantingXp : t.grantXp}
    </button>
  );
}

function BadgeSubmit({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = communityDict[locale].grants;
  return (
    <button type="submit" disabled={pending} className={primaryBtn}>
      {pending ? t.grantingBadge : t.grantBadge}
    </button>
  );
}

export function GrantsPanel({
  locale,
  academyId,
  badges,
  canWrite,
}: {
  locale: Locale;
  academyId: string;
  badges: CommunityBadge[];
  /**
   * Only owner/admin may grant badges (user_badges INSERT RLS). Instructors
   * (canWrite=false) get XP grants only — we hide the Badge tab and lock the
   * panel to the XP form so they never see a form that always fails at the DB.
   */
  canWrite: boolean;
}) {
  const t = communityDict[locale].grants;
  const [tab, setTab] = useState<"xp" | "badge">("xp");
  // Instructors can't grant badges — keep them on XP regardless of tab state.
  const activeTab = canWrite ? tab : "xp";

  return (
    <div className="flex flex-col gap-4">
      {canWrite && (
        <div
          role="tablist"
          aria-label={t.title}
          className="inline-flex w-fit gap-1 rounded-xl bg-surface-2/50 p-1 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          <TabButton
            active={activeTab === "xp"}
            onClick={() => setTab("xp")}
            label={t.xpTab}
          />
          <TabButton
            active={activeTab === "badge"}
            onClick={() => setTab("badge")}
            label={t.badgeTab}
          />
        </div>
      )}

      {activeTab === "xp" ? (
        <XpForm locale={locale} academyId={academyId} />
      ) : (
        <BadgeForm locale={locale} academyId={academyId} badges={badges} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-ink text-bg-deep"
          : "text-ink-soft hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

function XpForm({ locale, academyId }: { locale: Locale; academyId: string }) {
  const t = communityDict[locale].grants;
  const [state, formAction] = useActionState(grantXp, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{t.userIdLabel}</span>
        <input
          name="targetUserId"
          required
          placeholder={t.userIdPlaceholder}
          className={`${inputCls} font-mono text-xs`}
        />
        <span className="text-[0.7rem] text-muted">{t.userIdHint}</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>{t.amountLabel}</span>
          <input
            name="amount"
            type="number"
            step="1"
            required
            placeholder={t.amountPlaceholder}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>{t.noteLabel}</span>
          <input
            name="note"
            placeholder={t.notePlaceholder}
            className={inputCls}
          />
        </label>
      </div>

      <Feedback state={state} />

      <div className="flex justify-end">
        <XpSubmit locale={locale} />
      </div>
    </form>
  );
}

function BadgeForm({
  locale,
  academyId,
  badges,
}: {
  locale: Locale;
  academyId: string;
  badges: CommunityBadge[];
}) {
  const t = communityDict[locale].grants;
  const [state, formAction] = useActionState(grantBadge, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  if (badges.length === 0) {
    return <p className="text-sm text-ink-soft">{t.noBadges}</p>;
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{t.userIdLabel}</span>
        <input
          name="targetUserId"
          required
          placeholder={t.userIdPlaceholder}
          className={`${inputCls} font-mono text-xs`}
        />
        <span className="text-[0.7rem] text-muted">{t.userIdHint}</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{t.badgeLabel}</span>
        <select name="badgeId" required defaultValue="" className={inputCls}>
          <option value="" disabled>
            —
          </option>
          {badges.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} · {b.rarity}
            </option>
          ))}
        </select>
      </label>

      <Feedback state={state} />

      <div className="flex justify-end">
        <BadgeSubmit locale={locale} />
      </div>
    </form>
  );
}

function Feedback({ state }: { state: CommunityActionState }) {
  if (state.error)
    return (
      <p className={`text-sm ${dangerText}`} role="alert">
        {state.error}
      </p>
    );
  if (state.notice)
    return (
      <p className={`text-sm ${noticeText}`} role="status">
        {state.notice}
      </p>
    );
  return null;
}
