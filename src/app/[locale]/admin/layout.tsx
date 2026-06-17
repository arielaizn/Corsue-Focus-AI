import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { adminDict } from "@/lib/admin-dictionary";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  // Gate: redirects logged-out → login, logged-in non-admin → /dashboard.
  const user = await requirePlatformAdmin(locale);
  const dict = adminDict[locale];

  return (
    <div className="relative min-h-dvh bg-bg text-ink">
      <a
        href="#admin-main"
        className="sr-only z-[var(--z-modal,60)] rounded-xl bg-surface-2 px-4 py-2 text-sm font-semibold text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:not-sr-only focus:absolute focus:inset-block-start-3 focus:inset-inline-start-3"
      >
        {locale === "he" ? "דלג לתוכן" : "Skip to content"}
      </a>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ background: "var(--grad-nebula)" }}
      />
      <GrainOverlay />

      <div className="relative z-10 grid min-h-dvh lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <AdminSidebar locale={locale} dict={dict} />
        </aside>

        <div className="flex min-w-0 flex-col">
          <AdminTopbar locale={locale} dict={dict} email={user.email ?? ""} />
          <main
            id="admin-main"
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
