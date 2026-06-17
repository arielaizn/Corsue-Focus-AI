"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { AdminDict } from "@/lib/admin-dictionary";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import { signOut } from "@/app/[locale]/(auth)/actions";

export interface AdminTopbarProps {
  locale: Locale;
  dict: AdminDict;
  email: string;
}

export function AdminTopbar({ locale, dict, email }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex items-center justify-between gap-3 border-line/60 bg-bg/80 px-4 py-3 backdrop-blur-xl [border-block-end:1px_solid_var(--color-line)] sm:px-6">
      <span className="text-gilt text-xs font-semibold uppercase tracking-[0.16em]">
        {dict.shell.platform}
      </span>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href={`/${locale}/postlogin`}
          className="text-sm text-muted transition-colors hover:text-ink-soft"
        >
          {dict.shell.backToApp}
        </Link>
        <LocaleToggle current={locale} />
        {email && (
          <span className="hidden max-w-[14rem] truncate text-xs text-muted sm:inline">
            {email}
          </span>
        )}
        <form action={signOut}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="rounded-lg px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
          >
            {dict.shell.signOut}
          </button>
        </form>
      </div>
    </header>
  );
}
