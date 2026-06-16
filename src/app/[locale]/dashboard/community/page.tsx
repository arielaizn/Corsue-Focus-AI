import { isLocale, type Locale } from "@/lib/i18n";
import { appDictionary } from "@/lib/app-dictionary";
import { PageHeader, Panel, Pill } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const s = appDictionary[locale].stubs;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={s.community.title}
        subtitle={s.community.body}
        actions={<Pill>{s.soon}</Pill>}
      />
      <Panel>
        <p className="text-sm text-ink-soft">{s.community.body}</p>
      </Panel>
    </div>
  );
}
