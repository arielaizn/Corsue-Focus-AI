import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { appDictionary } from "@/lib/app-dictionary";
import { getUserAndAcademies } from "@/lib/auth";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const dict = appDictionary[locale];

  const { user, profile, memberships } = await getUserAndAcademies();
  // Middleware already gates this, but guard defensively against direct hits.
  if (!user) redirect(`/${locale}/login?next=/${locale}/dashboard`);

  const displayName =
    profile?.display_name ??
    (typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : "") ??
    "";

  const activeAcademyId = memberships[0]?.academy.id ?? null;

  return (
    <div className="relative min-h-dvh bg-bg text-ink">
      {/* Skip link — first focusable element; bypasses the nav (WCAG 2.4.1). */}
      <a
        href="#dashboard-main"
        className="sr-only z-[var(--z-modal,60)] rounded-xl bg-surface-2 px-4 py-2 text-sm font-semibold text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:not-sr-only focus:absolute focus:inset-block-start-3 focus:inset-inline-start-3"
      >
        {dict.shell.skipToContent}
      </a>

      {/* Flat true-black backdrop + film grain. No nebula, no glow (couture). */}
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
            nav={dict.nav}
            backToSite={dict.shell.backToSite}
          />
        </aside>

        <div className="flex min-w-0 flex-col">
          <Topbar
            locale={locale}
            shell={dict.shell}
            nav={dict.nav}
            roles={dict.roles}
            email={user.email ?? ""}
            displayName={displayName}
            memberships={memberships}
            activeAcademyId={activeAcademyId}
          />
          <main
            id="dashboard-main"
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
