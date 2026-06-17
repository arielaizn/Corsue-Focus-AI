import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { learnDict } from "@/components/learn/dictionary";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { listMyCertificates } from "@/lib/data/certificates";
import {
  getPrimaryAcademy,
  myBadges,
  myXp,
  getMyStreak,
  type EarnedBadge,
} from "@/lib/data/gamification";

export const dynamic = "force-dynamic";

interface MyCertificate {
  id: string;
  courseTitle: string | null;
  verificationCode: string | null;
  pdfUrl: string | null;
  issuedAt: string | null;
}

/**
 * Load the learner's certificates (raw rows) and enrich each with its course
 * title (the certificates table stores only course_id). Title lookup is a
 * single batched, RLS-scoped read; any failure degrades to a null title.
 */
async function loadCertificates(
  supabase: ReturnType<typeof createClient>,
): Promise<MyCertificate[]> {
  const rows = await listMyCertificates();
  if (rows.length === 0) return [];

  const titles = new Map<string, string>();
  try {
    const courseIds = Array.from(new Set(rows.map((r) => r.course_id)));
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title")
      .in("id", courseIds);
    for (const c of courses ?? []) titles.set(c.id, c.title);
  } catch {
    // titles stay empty → the card falls back to a generic label
  }

  return rows.map((r) => ({
    id: r.id,
    courseTitle: titles.get(r.course_id) ?? null,
    verificationCode: r.verification_code ?? null,
    pdfUrl: r.pdf_url ?? null,
    issuedAt: r.issued_at ?? null,
  }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = learnDict[locale];
  const d = dict.profile;
  const intl = locale === "he" ? "he-IL" : "en-US";

  const user = await requireStudent(locale, `/${locale}/learn/profile`);

  const supabase = createClient(await cookies());
  const academy = await getPrimaryAcademy();

  const [profileRes, certificates, badges, mine, streak] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, avatar_url, bio, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    loadCertificates(supabase),
    academy ? myBadges(academy.id) : Promise.resolve([] as EarnedBadge[]),
    academy ? myXp(academy.id) : Promise.resolve(null),
    academy
      ? getMyStreak(academy.id)
      : Promise.resolve({ currentStreak: 0, longestStreak: 0, lastActivity: null }),
  ]);

  const profile = profileRes.data;
  const name =
    profile?.display_name?.trim() ||
    (typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : user.email?.split("@")[0]) ||
    "";
  const avatarUrl = profile?.avatar_url ?? null;
  const validAvatar = !!avatarUrl && /^https?:\/\//.test(avatarUrl);
  const initial = (name || user.email || "—").trim().charAt(0).toUpperCase();
  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(intl, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={dict.nav.profile}
        title={d.title}
        actions={
          <Link
            href={`/${locale}/learn/settings`}
            className="inline-flex items-center justify-center rounded-[6px] px-4 py-2 text-sm font-semibold text-ink-soft transition-colors [box-shadow:inset_0_0_0_1px_var(--color-line)] hover:text-ink"
          >
            {d.edit}
          </Link>
        }
      />

      {/* Identity card */}
      <Panel className="!p-6">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-start">
          <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-2xl font-semibold text-ink [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
            {validAvatar ? (
              <Image
                src={avatarUrl as string}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              initial
            )}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
              {name}
            </h2>
            <p className="mt-0.5 truncate text-sm text-muted">{user.email}</p>
            {profile?.bio && (
              <p className="mt-2 max-w-prose text-sm text-ink-soft">{profile.bio}</p>
            )}
            {joined && (
              <p className="mt-2 text-xs text-muted">
                {d.joined} {joined}
              </p>
            )}
          </div>
          {/* Compact XP / streak readout */}
          <div className="grid grid-cols-3 gap-3 sm:ms-auto">
            <MiniStat
              value={(mine?.totalXp ?? 0).toLocaleString(intl)}
              label={dict.leaderboard.xp}
            />
            <MiniStat value={mine?.currentLevel ?? 1} label={dict.leaderboard.level} />
            <MiniStat
              value={streak.currentStreak}
              label={dict.leaderboard.streak}
            />
          </div>
        </div>
      </Panel>

      {/* Badges */}
      <Panel title={d.myBadges}>
        {badges.length === 0 ? (
          <p className="py-4 text-sm text-muted">{d.noBadges}</p>
        ) : (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
            {badges.map((b) => (
              <li
                key={b.id}
                className="flex flex-col items-center gap-2 rounded-[8px] bg-[oklch(0.76_0.105_80_/_0.07)] p-3 text-center [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.32)]"
                title={b.description ? `${b.name} — ${b.description}` : b.name}
              >
                <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[oklch(0.76_0.105_80_/_0.13)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]">
                  {/^https?:\/\//.test(b.iconUrl ?? "") ? (
                    <Image
                      src={b.iconUrl}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                      unoptimized
                    />
                  ) : (
                    <MedalGlyph />
                  )}
                </span>
                <span className="text-[11px] font-medium leading-tight text-ink-soft">
                  {b.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Certificates */}
      <Panel title={d.myCertificates}>
        {certificates.length === 0 ? (
          <p className="py-4 text-sm text-muted">{d.noCertificates}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {certificates.map((c) => {
              const issued = c.issuedAt
                ? new Date(c.issuedAt).toLocaleDateString(intl, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null;
              const inner = (
                <>
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[oklch(0.76_0.105_80_/_0.12)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.3)]">
                      <SealGlyph />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-[family-name:var(--font-display)] text-base font-semibold text-ink">
                        {c.courseTitle || dict.complete.certIssued}
                      </h3>
                      {issued && (
                        <p className="mt-0.5 text-xs text-muted">
                          {dict.complete.issuedOn} {issued}
                        </p>
                      )}
                    </div>
                  </div>
                  {c.verificationCode && (
                    <p className="mt-3 text-xs text-muted">
                      {dict.complete.verifyCode}:{" "}
                      <span className="font-mono tracking-wide text-ink-soft">
                        {c.verificationCode}
                      </span>
                    </p>
                  )}
                  {c.pdfUrl && (
                    <span className="mt-3 inline-block text-xs font-medium text-gold transition-colors group-hover:text-gilt">
                      {dict.complete.viewCertificate} →
                    </span>
                  )}
                </>
              );
              return (
                <li key={c.id}>
                  {c.pdfUrl ? (
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="panel-premium group flex h-full flex-col p-5 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="panel-premium flex h-full flex-col p-5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function MiniStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-[8px] bg-bg-deep/50 px-3 py-2 text-center [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <p className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums text-ink">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.1em] text-muted">{label}</p>
    </div>
  );
}

const g = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function MedalGlyph() {
  return (
    <svg {...g} width={22} height={22}>
      <circle cx="12" cy="14" r="6" />
      <path d="M8.5 8 6 3M15.5 8 18 3M12 11v3l2 1" />
    </svg>
  );
}
function SealGlyph() {
  return (
    <svg {...g} width={20} height={20}>
      <circle cx="12" cy="10" r="6" />
      <path d="M9 15.5 8 21l4-2 4 2-1-5.5" />
    </svg>
  );
}
