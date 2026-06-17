import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { adminDict } from "@/lib/admin-dictionary";
import { getPlatformKpis } from "@/lib/data/platform";
import { PageHeader, StatCard } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = adminDict[locale];
  const k = await getPlatformKpis();

  const loc = locale === "he" ? "he-IL" : "en-US";
  const fmt = (n: number) => n.toLocaleString(loc);

  const stats = [
    { label: t.overview.academies, value: fmt(k.academies) },
    { label: t.overview.users, value: fmt(k.users) },
    { label: t.overview.courses, value: fmt(k.courses) },
    { label: t.overview.enrollments, value: fmt(k.enrollments) },
    { label: t.overview.revenue, value: fmt(k.revenue), accent: true },
    { label: t.overview.admins, value: fmt(k.admins) },
    { label: t.overview.reports, value: fmt(k.openReports) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={t.shell.platform}
        title={t.overview.title}
        subtitle={t.overview.subtitle}
      />
      <section
        aria-label={t.overview.title}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            accent={s.accent}
          />
        ))}
      </section>
    </div>
  );
}
