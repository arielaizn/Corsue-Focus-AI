import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { CTASection } from "@/components/shared/CTASection";
import { content } from "@/content/community";
import {
  CommunityHero,
  FeedSection,
  GroupsSection,
  MessagingSection,
  AIManagerSection,
  GamificationSection,
  ProfileSection,
  LiveSection,
} from "@/components/community";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const m = content[locale].meta;
  return { title: m.title, description: m.description };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale];

  return (
    <>
      <CommunityHero t={t.hero} locale={locale} />
      <FeedSection t={t.feed} />
      <GroupsSection t={t.groups} />
      <MessagingSection t={t.messaging} />
      <AIManagerSection t={t.aiManager} />
      <GamificationSection t={t.gamification} />
      <ProfileSection t={t.profile} />
      <LiveSection t={t.live} />
      <CTASection locale={locale} />
    </>
  );
}
