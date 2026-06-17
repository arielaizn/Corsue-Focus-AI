import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies } from "@/lib/auth";
import { PageHeader, Pill } from "@/components/dashboard/ui";
import {
  getAcademyById,
  readBrandColors,
  DEFAULT_BRAND_PRIMARY,
  DEFAULT_BRAND_ACCENT,
  type AcademyFormValues,
} from "@/lib/data/academies";
import { AcademyForm } from "@/components/dashboard/academy/AcademyForm";
import { BuildAcademyPanel } from "@/components/dashboard/academy/BuildAcademyPanel";
import { academyDict } from "@/components/dashboard/academy/dict";

export const dynamic = "force-dynamic";

export default async function AcademyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const d = academyDict[locale];

  const { memberships } = await getUserAndAcademies();

  // CREATE MODE — owner has no academy yet.
  if (memberships.length === 0) {
    const initialValues: AcademyFormValues = {
      name: "",
      slug: "",
      description: "",
      locale,
      currency: locale === "he" ? "ILS" : "USD",
      timezone: locale === "he" ? "Asia/Jerusalem" : "UTC",
      white_label: false,
      brandPrimary: DEFAULT_BRAND_PRIMARY,
      brandAccent: DEFAULT_BRAND_ACCENT,
    };
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          kicker={d.createKicker}
          title={d.createTitle}
          subtitle={d.createSub}
        />
        <div className="max-w-2xl">
          <AcademyForm mode="create" locale={locale} initialValues={initialValues} />
        </div>
      </div>
    );
  }

  // SETTINGS MODE — resolve the active academy.
  const active =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];

  // Best-effort full row (falls back to the membership stub if RLS blocks it).
  const full = (await getAcademyById(active.academy.id)) ?? active.academy;
  const brand = readBrandColors(full.brand_colors);

  const canEdit = active.role === "owner" || active.role === "admin";

  const initialValues: AcademyFormValues = {
    name: full.name,
    slug: full.slug,
    description: full.description ?? "",
    locale: full.locale,
    currency: full.currency,
    timezone: full.timezone,
    white_label: full.white_label,
    brandPrimary: brand.primary,
    brandAccent: brand.accent,
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={d.settingsKicker}
        title={d.settingsTitle}
        subtitle={d.settingsSub}
        actions={
          <Pill tone={active.role === "owner" ? "gold" : "neutral"}>
            {appRole(locale, active.role)}
          </Pill>
        }
      />
      {canEdit ? (
        <>
          <div className="max-w-2xl">
            <AcademyForm
              mode="settings"
              locale={locale}
              academyId={full.id}
              initialValues={initialValues}
            />
          </div>
          <BuildAcademyPanel
            locale={locale}
            academyId={full.id}
            currency={full.currency}
          />
        </>
      ) : (
        <ReadOnlyAcademy
          values={initialValues}
          locale={locale}
          brandPrimary={brand.primary}
          brandAccent={brand.accent}
        />
      )}
    </div>
  );
}

/** Role label without reaching into the foundation dictionary directly. */
function appRole(
  locale: Locale,
  role: "owner" | "admin" | "instructor" | "student",
): string {
  const he = { owner: "בעלים", admin: "מנהל", instructor: "מדריך", student: "תלמיד" };
  const en = { owner: "Owner", admin: "Admin", instructor: "Instructor", student: "Student" };
  return (locale === "he" ? he : en)[role];
}

/** Non-owner/admin members see a calm read-only summary (no dead controls). */
function ReadOnlyAcademy({
  values,
  locale,
  brandPrimary,
  brandAccent,
}: {
  values: AcademyFormValues;
  locale: Locale;
  brandPrimary: string;
  brandAccent: string;
}) {
  const rows: { label: string; value: string }[] = [
    { label: locale === "he" ? "שם" : "Name", value: values.name },
    { label: locale === "he" ? "כתובת" : "Address", value: `${values.slug}.coursefocus.ai` },
    { label: locale === "he" ? "שפה" : "Language", value: values.locale },
    { label: locale === "he" ? "מטבע" : "Currency", value: values.currency },
    { label: locale === "he" ? "אזור זמן" : "Timezone", value: values.timezone.replace(/_/g, " ") },
  ];
  return (
    <section className="panel-premium max-w-2xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden
          className="size-8 rounded-lg"
          style={{ backgroundImage: `linear-gradient(135deg, ${brandPrimary}, ${brandAccent})` }}
        />
        <p className="text-sm text-ink-soft">
          {locale === "he"
            ? "תצוגה בלבד — רק בעלים ומנהלים יכולים לערוך."
            : "View only — only owners and admins can edit."}
        </p>
      </div>
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {r.label}
            </dt>
            <dd className="mt-1 text-sm text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
