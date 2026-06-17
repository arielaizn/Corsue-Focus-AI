import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { getSystemHealth } from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { PageHeader, StatCard } from "@/components/dashboard/ui";
import { SparkIcon, AcademyIcon, SettingsIcon } from "@/components/dashboard/icons";
import {
  PlansTable,
  AiUsagePanel,
  FeatureFlagsPanel,
} from "@/components/admin/system/SystemPanels";

export const dynamic = "force-dynamic";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN · /[locale]/admin/system

   System health for the whole platform: plans + their active-subscription
   counts, the AI-usage proxy (total tokens + review count from ai_reviews),
   and a read-only feature-flags panel. Every datum is sourced from
   getSystemHealth() (admin-bypass / service-guarded in the data layer).

   GATED: requirePlatformAdmin(locale) runs FIRST (defense in depth — never
   trust the route gate alone), then the page renders. force-dynamic.
--------------------------------------------------------------------------- */

export default async function AdminSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  // Gate EVERYTHING — redirects non-admins before any read.
  await requirePlatformAdmin(locale);

  const t = adminDict[locale].system;
  const health = await getSystemHealth();

  const fmt = new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US");
  const enabledFlags = health.featureFlags.filter((f) => f.enabled).length;
  const totalActiveSubs = health.plans.reduce((s, p) => s + p.activeSubs, 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={adminDict[locale].shell.platform}
        title={t.title}
        subtitle={adminDict[locale].overview.subtitle}
      />

      {/* Headline platform metrics. */}
      <section
        aria-label={t.title}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label={t.plans}
          value={fmt.format(health.plans.length)}
          hint={`${fmt.format(totalActiveSubs)} ${t.activeSubs}`}
          icon={<AcademyIcon width={18} height={18} />}
          accent
        />
        <StatCard
          label={t.tokens}
          value={fmt.format(health.aiTokens)}
          hint={t.aiUsage}
          icon={<SparkIcon width={18} height={18} />}
        />
        <StatCard
          label={t.aiUsage}
          value={fmt.format(health.aiReviews)}
          hint={t.tokens}
          icon={<SparkIcon width={18} height={18} />}
        />
        <StatCard
          label={t.featureFlags}
          value={`${fmt.format(enabledFlags)}/${fmt.format(health.featureFlags.length)}`}
          hint={t.featureFlags}
          icon={<SettingsIcon width={18} height={18} />}
        />
      </section>

      {/* Plans + AI usage side by side; flags span full width below. */}
      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <PlansTable plans={health.plans} t={t} locale={locale} />
        <AiUsagePanel
          aiTokens={health.aiTokens}
          aiReviews={health.aiReviews}
          t={t}
          locale={locale}
        />
      </div>

      <FeatureFlagsPanel flags={health.featureFlags} t={t} />
    </div>
  );
}
