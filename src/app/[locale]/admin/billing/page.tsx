import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { getBillingOverview } from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { PageHeader, StatCard } from "@/components/dashboard/ui";
import { RevenueByAcademy } from "./RevenueByAcademy";
import { RecentPaymentsTable } from "./RecentPaymentsTable";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN — Billing.
   Total revenue, per-academy revenue breakdown (CSS bars), and a recent-
   payments table across ALL tenants. Revenue = payments where status =
   'succeeded' (see getBillingOverview). Gated by requirePlatformAdmin
   (defense in depth — never trust the route gate alone) and force-dynamic.
--------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

export default async function AdminBillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  // GATE FIRST — redirects logged-out → login, logged-in non-admin → /dashboard.
  await requirePlatformAdmin(locale);

  const dict = adminDict[locale];
  const b = dict.billing;

  const { totalRevenue, currency, byAcademy, recentPayments } =
    await getBillingOverview();

  const totalLabel = new Intl.NumberFormat(
    locale === "he" ? "he-IL" : "en-US",
    {
      style: "currency",
      currency: safeCurrency(currency),
      maximumFractionDigits: 0,
    },
  ).format(totalRevenue);

  const payerCount = byAcademy.length;
  const hint =
    payerCount > 0
      ? `${payerCount} ${b.byAcademy.toLowerCase()}`
      : undefined;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={dict.shell.platform}
        title={b.title}
        subtitle={dict.overview.subtitle}
      />

      <section
        aria-label={b.totalRevenue}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {/* Headline metric — a restrained steel rim marks the PLATFORM surface
            as distinct from the gold academy dashboard. */}
        <StatCard
          label={b.totalRevenue}
          value={totalLabel}
          hint={hint}
          className="sm:col-span-2 xl:col-span-1 [box-shadow:inset_0_0_0_1px_oklch(0.55_0.11_250_/_0.45),0_0_28px_-12px_oklch(0.55_0.11_250_/_0.6)]"
          icon={<RevenueGlyph />}
        />
        <StatCard
          label={b.mrr}
          value="—"
          hint={b.recentPayments}
          className="opacity-90"
        />
        <StatCard
          label={b.recentPayments}
          value={recentPayments.length}
          icon={<PaymentsGlyph />}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RevenueByAcademy
            rows={byAcademy}
            currency={currency}
            locale={locale}
            title={b.byAcademy}
            emptyLabel={b.none}
          />
        </div>
        <div className="lg:col-span-3">
          <RecentPaymentsTable
            rows={recentPayments}
            locale={locale}
            title={b.recentPayments}
            cols={{
              academy: dict.nav.academies,
              amount: b.amount,
              status: b.status,
              paidAt: b.paidAt,
            }}
            emptyLabel={b.none}
          />
        </div>
      </div>
    </div>
  );
}

/** Guard against malformed currency codes so Intl never throws. */
function safeCurrency(code: string): string {
  return /^[A-Za-z]{3}$/.test(code) ? code.toUpperCase() : "USD";
}

function RevenueGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v18M16.5 7.5c0-1.7-2-2.5-4.5-2.5S7.5 5.8 7.5 7.5 9.5 10 12 10s4.5.8 4.5 2.5S14.5 15 12 15s-4.5-.8-4.5-2.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaymentsGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x={3}
        y={5}
        width={18}
        height={14}
        rx={2}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path d="M3 9h18" stroke="currentColor" strokeWidth={1.5} />
      <path d="M7 14h4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
