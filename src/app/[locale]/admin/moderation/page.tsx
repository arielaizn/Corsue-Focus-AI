import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import {
  listModerationQueue,
  type ModerationItem,
} from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { StatusFilter } from "@/components/admin/moderation/StatusFilter";
import { ModerationCard } from "@/components/admin/moderation/ModerationCard";
import { ShieldIcon } from "@/components/admin/moderation/icons";

export const dynamic = "force-dynamic";

/** The valid `?status` filters for the cross-tenant report queue. */
const FILTERS = ["open", "reviewing", "actioned", "dismissed", "all"] as const;
type Filter = (typeof FILTERS)[number];

function parseStatus(raw: string | undefined): Filter {
  return FILTERS.includes(raw as Filter) ? (raw as Filter) : "open";
}

export default async function ModerationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  // Defense in depth — never trust the route gate alone.
  await requirePlatformAdmin(locale);

  const { status: statusParam } = await searchParams;
  const status = parseStatus(statusParam);

  const t = adminDict[locale].moderation;

  const items: ModerationItem[] = await listModerationQueue({ status });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={adminDict[locale].shell.platform}
        title={t.title}
        subtitle={
          locale === "he"
            ? "תור דיווחי תוכן מכלל האקדמיות בפלטפורמה."
            : "Cross-tenant content-report queue across every academy."
        }
      />

      <StatusFilter locale={locale} active={status} />

      {items.length === 0 ? (
        <EmptyState
          icon={<ShieldIcon width={26} height={26} />}
          title={t.none}
          body={t.empty}
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.reportId}>
              <ModerationCard locale={locale} item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
