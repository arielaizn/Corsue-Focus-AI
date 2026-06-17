"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { CommunityGroup } from "@/lib/data/community-admin";
import {
  createGroup,
  type CommunityActionState,
} from "@/app/[locale]/dashboard/community/actions";
import { communityDict } from "./dict";
import { primaryBtn, inputCls, labelCls, dangerText, noticeText } from "./styles";
import { Pill } from "@/components/dashboard/ui";

const initial: CommunityActionState = {};
const VISIBILITIES = ["public", "private", "vip"] as const;

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = communityDict[locale].groups;
  return (
    <button type="submit" disabled={pending} className={primaryBtn}>
      {pending ? t.creating : t.create}
    </button>
  );
}

export function GroupsPanel({
  locale,
  academyId,
  groups,
  canWrite,
}: {
  locale: Locale;
  academyId: string;
  groups: CommunityGroup[];
  canWrite: boolean;
}) {
  const t = communityDict[locale].groups;
  const [state, formAction] = useActionState(createGroup, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  return (
    <div className="flex flex-col gap-5">
      {groups.length === 0 ? (
        <p className="text-sm text-ink-soft">{t.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {groups.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface-2/40 px-4 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {g.name}
                </p>
                {g.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">
                    {g.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs tabular-nums text-muted">
                  {g.member_count} {t.members}
                </span>
                <Pill tone={g.visibility === "vip" ? "gold" : "neutral"}>
                  {t.visibility[g.visibility]}
                </Pill>
              </div>
            </li>
          ))}
        </ul>
      )}

      {canWrite && (
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-3 border-t border-line/50 pt-4"
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="academyId" value={academyId} />

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t.nameLabel}</span>
            <input
              name="name"
              required
              placeholder={t.namePlaceholder}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t.descLabel}</span>
            <input
              name="description"
              placeholder={t.descPlaceholder}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t.visibilityLabel}</span>
            <select name="visibility" defaultValue="public" className={inputCls}>
              {VISIBILITIES.map((v) => (
                <option key={v} value={v}>
                  {t.visibility[v]}
                </option>
              ))}
            </select>
          </label>

          {state.error && (
            <p className={`text-sm ${dangerText}`} role="alert">
              {state.error}
            </p>
          )}
          {state.notice && (
            <p className={`text-sm ${noticeText}`} role="status">
              {state.notice}
            </p>
          )}

          <div className="flex justify-end">
            <SubmitButton locale={locale} />
          </div>
        </form>
      )}
    </div>
  );
}
