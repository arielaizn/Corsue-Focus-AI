"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  postAnnouncement,
  type CommunityActionState,
} from "@/app/[locale]/dashboard/community/actions";
import { communityDict } from "./dict";
import { primaryBtn, inputCls, labelCls, dangerText, noticeText } from "./styles";
import { SparkIcon } from "@/components/dashboard/icons";

const initial: CommunityActionState = {};

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = communityDict[locale].announce;
  return (
    <button type="submit" disabled={pending} className={primaryBtn}>
      <SparkIcon width={16} height={16} />
      {pending ? t.submitting : t.submit}
    </button>
  );
}

export function AnnouncementComposer({
  locale,
  academyId,
}: {
  locale: Locale;
  academyId: string;
}) {
  const t = communityDict[locale].announce;
  const [state, formAction] = useActionState(postAnnouncement, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the composer after a successful publish.
  useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{t.titleLabel}</span>
        <input
          name="title"
          placeholder={t.titlePlaceholder}
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{t.bodyLabel}</span>
        <textarea
          name="body"
          rows={3}
          required
          placeholder={t.bodyPlaceholder}
          className={`${inputCls} resize-y`}
        />
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
  );
}
