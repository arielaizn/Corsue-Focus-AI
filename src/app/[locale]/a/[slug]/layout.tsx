import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { readBrandColors } from "@/lib/data/academies.shared";
import { getAcademyBySlug } from "@/lib/data/storefront";
import { storefrontDict } from "@/components/storefront/dictionary";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import { GrainOverlay } from "@/components/shared/GrainOverlay";

export const dynamic = "force-dynamic";

/* ---------------------------------------------------------------------------
   PUBLIC ACADEMY STOREFRONT chrome. Anonymous-accessible (no auth guard).
   Slim, academy-branded header (logo/name + language toggle + sign-in) over a
   true-black Obsidian Couture backdrop, with a minimal "powered by" footer.
   Brand colors override the gold/violet accent tokens for this subtree only.
--------------------------------------------------------------------------- */

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = storefrontDict[locale];

  const academy = await getAcademyBySlug(slug);
  if (!academy) notFound();

  const { primary, accent } = readBrandColors(academy.brand_colors);

  // Scope brand colors to this subtree by overriding the gold accent token
  // (text-gold / text-gilt / bg-gold all derive from --color-gold).
  const brandStyle = {
    "--color-gold": accent,
    "--brand-primary": primary,
    "--brand-accent": accent,
  } as React.CSSProperties;

  return (
    <div
      style={brandStyle}
      className="relative flex min-h-dvh flex-col bg-bg text-ink"
    >
      {/* Skip link (WCAG 2.4.1). */}
      <a
        href="#storefront-main"
        className="sr-only rounded-xl bg-surface-2 px-4 py-2 text-sm font-semibold text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:not-sr-only focus:absolute focus:inset-block-start-3 focus:inset-inline-start-3 focus:z-50"
      >
        {academy.name}
      </a>

      {/* Flat backdrop + film grain. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{ background: "var(--grad-nebula)" }}
      />
      <GrainOverlay />

      {/* Slim branded header. */}
      <header className="relative z-10 border-b border-[var(--color-line)]/70 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-10">
          <Link
            href={`/${locale}/a/${academy.slug}`}
            className="group flex min-w-0 items-center gap-3"
          >
            {academy.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={academy.logo_url}
                alt=""
                className="size-9 shrink-0 rounded-[8px] object-cover [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              />
            ) : (
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-surface-2 font-[family-name:var(--font-display)] text-sm font-bold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.35)]"
              >
                {academy.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="truncate font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-ink transition-colors group-hover:text-gilt">
              {academy.name}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LocaleToggle current={locale} />
            <Link
              href={`/${locale}/login?next=${encodeURIComponent(
                `/${locale}/a/${academy.slug}`,
              )}`}
              className="bg-ink text-bg-deep inline-flex items-center justify-center rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink-soft"
            >
              {dict.course.signInToEnroll}
            </Link>
          </div>
        </div>
      </header>

      <main
        id="storefront-main"
        tabIndex={-1}
        className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none sm:px-6 sm:py-10 lg:px-10"
      >
        {children}
      </main>

      {/* Minimal footer — platform badge unless white-labelled. */}
      <footer className="relative z-10 border-t border-[var(--color-line)]/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6 lg:px-10">
          <span>
            © {new Date().getFullYear()} {academy.name}
          </span>
          {!academy.hide_platform_badge && (
            <span className="inline-flex items-center gap-1">
              {dict.common.poweredBy}{" "}
              <Link
                href={`/${locale}`}
                className="font-semibold text-ink-soft transition-colors hover:text-gold"
              >
                CourseFocus
              </Link>
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
