import { cookies } from "next/headers";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { learnDict } from "@/components/learn/dictionary";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { Sidebar } from "@/components/learn/Sidebar";
import { Topbar } from "@/components/learn/Topbar";

export const dynamic = "force-dynamic";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = learnDict[locale];

  // Guard the whole learner surface — redirects logged-out users to login.
  const user = await requireStudent(locale, `/${locale}/learn`);

  // Load the learner's profile for the topbar (display name + avatar initial).
  const supabase = createClient(await cookies());
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ??
    (typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : "") ??
    "";

  return (
    <div className="relative min-h-dvh bg-bg text-ink">
      {/* Skip link — first focusable element; bypasses the nav (WCAG 2.4.1). */}
      <a
        href="#learn-main"
        className="sr-only z-[var(--z-modal,60)] rounded-xl bg-surface-2 px-4 py-2 text-sm font-semibold text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:not-sr-only focus:absolute focus:inset-block-start-3 focus:inset-inline-start-3"
      >
        {dict.shell.learner}
      </a>

      {/* Flat true-black backdrop + film grain (Obsidian Couture). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ background: "var(--grad-nebula)" }}
      />
      <GrainOverlay />

      <div className="relative z-10 grid min-h-dvh lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <Sidebar
            locale={locale}
            dict={dict}
            backToSite={dict.shell.backToSite}
          />
        </aside>

        <div className="flex min-w-0 flex-col">
          <Topbar
            locale={locale}
            dict={dict}
            email={user.email ?? ""}
            displayName={displayName}
          />
          <main
            id="learn-main"
            tabIndex={-1}
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none sm:px-6 lg:px-10"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
