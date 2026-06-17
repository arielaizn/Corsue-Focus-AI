import type { Locale } from "@/lib/i18n";
import type { LearnDict } from "@/components/learn/dictionary";

/* ---------------------------------------------------------------------------
   CertificateCard — the on-page, printable v1 certificate (pdf_url stays null).

   Server-safe (no "use client"): pure presentational. Renders the academy
   name, course title, learner name, issue date, and verification code in the
   "Obsidian Couture" editorial style. Uses logical CSS properties so it reads
   correctly in both RTL (he) and LTR (en). The `print:` utilities let a
   student print/save it cleanly from the browser.
--------------------------------------------------------------------------- */

export interface CertificateCardProps {
  locale: Locale;
  dict: LearnDict["complete"];
  academyName: string;
  courseTitle: string;
  learnerName: string;
  /** ISO date string (issued_at). */
  issuedAt: string;
  verificationCode: string;
}

function formatDate(iso: string, locale: Locale): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

export function CertificateCard({
  locale,
  dict,
  academyName,
  courseTitle,
  learnerName,
  issuedAt,
  verificationCode,
}: CertificateCardProps) {
  return (
    <div
      className="panel-couture gilt-rim relative overflow-hidden rounded-[8px] px-8 py-12 text-center print:border print:border-[color:var(--color-gold)] print:bg-white print:text-black sm:px-14"
      data-certificate
    >
      {/* Corner flourishes (logical insets keep them mirror-correct in RTL). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-block-start-4 inset-inline-start-4 size-10 rounded-[4px] border-s-2 border-t-2 border-[color:var(--color-gold)]/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-block-start-4 inset-inline-end-4 size-10 rounded-[4px] border-e-2 border-t-2 border-[color:var(--color-gold)]/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-block-end-4 inset-inline-start-4 size-10 rounded-[4px] border-b-2 border-s-2 border-[color:var(--color-gold)]/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-block-end-4 inset-inline-end-4 size-10 rounded-[4px] border-b-2 border-e-2 border-[color:var(--color-gold)]/40"
      />

      {/* Academy name (kicker). */}
      <p className="text-gilt text-xs font-semibold uppercase tracking-[0.28em] print:text-black">
        {academyName}
      </p>

      <div className="mx-auto mt-6 h-px w-16 bg-[color:var(--color-gold)]/50" />

      {/* Award line. */}
      <p className="mt-8 text-sm text-ink-soft print:text-black/70">
        {dict.certIssued}
      </p>

      {/* Learner name — the hero of the certificate. */}
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-h2 font-bold text-ink print:text-black">
        {learnerName}
      </h2>

      <p className="mt-6 text-sm text-ink-soft print:text-black/70">
        {dict.courseComplete}
      </p>

      {/* Course title. */}
      <p className="mt-2 font-[family-name:var(--font-display)] text-h3 font-semibold text-gold print:text-black">
        {courseTitle}
      </p>

      <div className="mx-auto mt-8 h-px w-16 bg-[color:var(--color-gold)]/50" />

      {/* Footer: issue date + verification code. */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row print:text-black/60">
        <span>
          {dict.issuedOn} {formatDate(issuedAt, locale)}
        </span>
        <span className="font-mono tracking-[0.12em]">
          {dict.verifyCode}:{" "}
          <span className="text-gilt print:text-black">{verificationCode}</span>
        </span>
      </div>
    </div>
  );
}

export default CertificateCard;
