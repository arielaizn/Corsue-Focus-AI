import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { learnDict } from "@/components/learn/dictionary";
import { CertificateCard } from "@/components/learn/CertificateCard";
import { Panel } from "@/components/dashboard/ui";
import {
  getMyCertificate,
  getMyReview,
} from "@/lib/data/certificates";
import { issueCertificateAction, submitReviewAction } from "./actions";

export const dynamic = "force-dynamic";

/**
 * Course completion screen.
 *
 * Guard: requireStudent, then verify (user-scoped read) that the user's
 * enrollment for this course is status='completed'. Completion is automatic
 * (a DB trigger flips the enrollment), so we only READ here — we never write
 * the enrollment. If the course isn't complete for this user, bounce back to
 * the course player.
 *
 * Shows: a celebratory header, an issue/view-certificate server-action form
 * (rendering the on-page CertificateCard once issued, with its verification
 * code), and a star-rating review form (addReview via submitReviewAction).
 */
export default async function CourseCompletePage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale: raw, courseId } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = learnDict[locale].complete;

  const user = await requireStudent(
    locale,
    `/${locale}/learn/c/${courseId}/complete`,
  );

  const supabase = createClient(await cookies());

  // Verify completion (user-scoped read — RLS proves ownership).
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, status, academy_id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Not enrolled, or not yet complete → back to the course player.
  if (!enrollment || enrollment.status !== "completed") {
    redirect(`/${locale}/learn/c/${courseId}`);
  }

  const academyId = enrollment.academy_id;

  // Course title, academy name, learner display name, existing cert + review.
  const [{ data: course }, { data: academy }, { data: profile }, certificate, review] =
    await Promise.all([
      supabase
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .maybeSingle(),
      supabase
        .from("academies")
        .select("name")
        .eq("id", academyId)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
      getMyCertificate(courseId),
      getMyReview(courseId),
    ]);

  const courseTitle = course?.title ?? "";
  const academyName = academy?.name ?? "";
  const learnerName =
    profile?.display_name?.trim() ||
    user.email?.split("@")[0] ||
    learnDict[locale].shell.learner;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      {/* Celebration header. */}
      <header className="panel-couture glow-aurora relative overflow-hidden rounded-[8px] px-6 py-12 text-center">
        <span
          aria-hidden
          className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface-2/70 text-3xl text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.35)]"
        >
          ✦
        </span>
        <p className="text-gilt mt-6 text-xs font-semibold uppercase tracking-[0.24em]">
          {t.congrats}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-h2 font-bold text-ink">
          {t.courseComplete}
        </h1>
        {courseTitle && (
          <p className="mt-2 font-[family-name:var(--font-display)] text-h3 font-semibold text-gold">
            {courseTitle}
          </p>
        )}
      </header>

      {/* Certificate: card if issued, otherwise the issue CTA. */}
      {certificate ? (
        <section className="flex flex-col gap-4">
          <CertificateCard
            locale={locale}
            dict={t}
            academyName={academyName}
            courseTitle={courseTitle}
            learnerName={learnerName}
            issuedAt={certificate.issued_at}
            verificationCode={certificate.verification_code}
          />
        </section>
      ) : (
        <Panel className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
            {t.getCertificate}
          </h2>
          <form action={issueCertificateAction} className="mt-5">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="academyId" value={academyId} />
            <input type="hidden" name="enrollmentId" value={enrollment.id} />
            <button
              type="submit"
              className="bg-ink text-bg-deep inline-flex items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:-translate-y-px hover:bg-ink-soft"
            >
              {t.getCertificate}
            </button>
          </form>
        </Panel>
      )}

      {/* Star-rating review. Each star is a submit button (pure RSC form). */}
      <Panel title={t.rateCourse}>
        {review ? (
          <div className="flex flex-col gap-3">
            <Stars value={review.rating} />
            {review.body && (
              <p className="text-sm text-ink-soft">{review.body}</p>
            )}
            <p className="text-sm font-medium text-gold">{t.rateThanks}</p>
          </div>
        ) : (
          <form action={submitReviewAction} className="flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="academyId" value={academyId} />

            {/* Radio stars — checking a star sets the rating. Rendered high-to-
                low inside a row-reverse track so 1★ is at the start and 5★ at
                the end in both RTL and LTR. The sibling chain lights the chosen
                star plus every lower star (which sit AFTER it in DOM order). */}
            <fieldset className="flex flex-col items-start gap-2 [&:has(input:checked)_label]:text-line">
              <div
                className="group flex flex-row-reverse items-center justify-end gap-1"
                role="radiogroup"
                aria-label={t.rateCourse}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <label
                    key={n}
                    className="cursor-pointer text-2xl leading-none text-line transition-colors hover:text-gold has-[input:checked]:text-gold [&:has(input:checked)~label]:text-gold"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      className="sr-only"
                      required
                    />
                    <span aria-hidden>★</span>
                    <span className="sr-only">{n}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <textarea
              name="body"
              rows={3}
              placeholder={learnDict[locale].courses.review}
              className="w-full resize-none rounded-[6px] bg-surface-2/60 px-3 py-2.5 text-sm text-ink placeholder:text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]"
            />

            <button
              type="submit"
              className="self-start rounded-[6px] px-5 py-2.5 text-sm font-semibold text-gold transition-colors [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)] hover:bg-surface-2/60"
            >
              {learnDict[locale].courses.rate}
            </button>
          </form>
        )}
      </Panel>

      {/* Back to courses. */}
      <div className="flex justify-center print:hidden">
        <Link
          href={`/${locale}/learn/courses`}
          className="text-sm font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {t.backToCourses}
        </Link>
      </div>
    </div>
  );
}

/** Static star display (filled up to `value`, out of 5). */
function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex flex-row-reverse justify-end gap-1 text-2xl leading-none">
      {[5, 4, 3, 2, 1].map((n) => (
        <span
          key={n}
          aria-hidden
          className={n <= v ? "text-gold" : "text-line"}
        >
          ★
        </span>
      ))}
      <span className="sr-only">{v} / 5</span>
    </div>
  );
}
