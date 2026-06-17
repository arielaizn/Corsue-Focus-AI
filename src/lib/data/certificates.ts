import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";
import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   CERTIFICATES + COURSE REVIEWS — completion data layer.

   Reads run AS the signed-in student (createClient(await cookies())) so RLS
   provides tenant + ownership isolation. We NEVER trust a client-passed user
   id — the user is always re-derived via auth.getUser().

   Certificate INSERTs are service-role only (students can't insert under RLS),
   so issueCertificate() FIRST re-verifies, with a user-scoped read, that the
   user's enrollment for the course is status='completed', THEN service-inserts
   the certificate (idempotent upsert / ignoreDuplicates) and reads it back as
   the user. Every read is wrapped so a blocked/failed query degrades to a safe
   null / {ok:false} instead of throwing out of the data layer.
--------------------------------------------------------------------------- */

export type Certificate =
  Database["public"]["Tables"]["certificates"]["Row"];
export type CourseReview =
  Database["public"]["Tables"]["course_reviews"]["Row"];

async function client() {
  return createClient(await cookies());
}

/** Re-derive the current user id (never trust a client-passed one). */
async function currentUserId(
  supabase: Awaited<ReturnType<typeof client>>,
): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

/** The current user's certificate for a course, or null if not yet issued. */
export async function getMyCertificate(
  courseId: string,
): Promise<Certificate | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();

    return data ?? null;
  } catch {
    return null;
  }
}

/** All certificates the current user holds (newest first). */
export async function listMyCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return [];

    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}

/** The current user's existing review for a course, or null. */
export async function getMyReview(
  courseId: string,
): Promise<CourseReview | null> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return null;

    const { data } = await supabase
      .from("course_reviews")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();

    return data ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Issue certificate (service-role, guarded)
// ---------------------------------------------------------------------------

/**
 * Issue (or fetch) the completion certificate for the current user + course.
 *
 * 1. Re-derive the user server-side.
 * 2. With a USER-SCOPED read, verify the user's enrollment for this course is
 *    status='completed' (RLS proves ownership). If not, bail with
 *    code='not_complete' — we never issue early.
 * 3. Service-insert the certificate (academy_id, course_id, user_id,
 *    enrollment_id) idempotently via upsert with ignoreDuplicates on the
 *    (course_id,user_id) unique constraint, then read it back as the user
 *    (the read-back is authoritative even when the duplicate was ignored).
 *    verification_code is DB-
 *    defaulted; pdf_url stays null (the on-page card is the v1 cert).
 *
 * Returns the certificate + its verification code on success.
 */
export async function issueCertificate({
  academyId,
  courseId,
  enrollmentId,
}: {
  academyId: string;
  courseId: string;
  enrollmentId: string;
}): Promise<{
  ok: boolean;
  certificate?: Certificate;
  code?: "not_complete" | "error";
}> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false, code: "error" };

    // (2) GUARD — re-verify completion with a user-scoped read. We re-resolve
    // the enrollment by (course_id,user_id) rather than trusting the passed
    // ids, and confirm status='completed' + its real academy_id.
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id, status, academy_id")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!enrollment || enrollment.status !== "completed") {
      return { ok: false, code: "not_complete" };
    }

    // Trust server-resolved values over client-passed ones.
    const realAcademyId = enrollment.academy_id ?? academyId;
    const realEnrollmentId = enrollment.id ?? enrollmentId;

    // Already issued? Return it (idempotent).
    const existing = await getMyCertificate(courseId);
    if (existing) return { ok: true, certificate: existing };

    // (3) Service-insert (bypasses the student INSERT block). Genuinely
    // idempotent: upsert on the (course_id,user_id) unique constraint with
    // ignoreDuplicates, so a concurrent issue (or a row that slipped past the
    // getMyCertificate check above) collapses to a no-op instead of erroring.
    // The upsert may therefore return no row (the duplicate was ignored), so
    // we always read the cert back as the user — that read-back is the source
    // of truth and also re-enforces RLS ownership.
    const service = createServiceClient();
    await service
      .from("certificates")
      .upsert(
        {
          academy_id: realAcademyId,
          course_id: courseId,
          user_id: userId,
          enrollment_id: realEnrollmentId,
        },
        { onConflict: "course_id,user_id", ignoreDuplicates: true },
      );
    // Ignore upsert errors — the user-scoped read-back below is authoritative.

    const certificate = await getMyCertificate(courseId);
    if (!certificate) return { ok: false, code: "error" };

    return { ok: true, certificate };
  } catch {
    return { ok: false, code: "error" };
  }
}

// ---------------------------------------------------------------------------
// Course review
// ---------------------------------------------------------------------------

/**
 * Upsert the current user's review for a course (rating 1..5 + optional body).
 * Self-write is allowed by RLS when the user is enrolled. Re-derives the user
 * and re-resolves the academy_id from the enrollment (never client-trusted).
 */
export async function addReview({
  academyId,
  courseId,
  rating,
  body,
}: {
  academyId: string;
  courseId: string;
  rating: number;
  body?: string | null;
}): Promise<{ ok: boolean; code?: "invalid" | "denied" | "error" }> {
  try {
    const supabase = await client();
    const userId = await currentUserId(supabase);
    if (!userId) return { ok: false, code: "denied" };

    const safeRating = Math.round(rating);
    if (!Number.isFinite(safeRating) || safeRating < 1 || safeRating > 5) {
      return { ok: false, code: "invalid" };
    }

    // Re-resolve the academy_id from the user's enrollment (RLS-scoped).
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("academy_id")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();

    const realAcademyId = enrollment?.academy_id ?? academyId;
    const trimmed =
      typeof body === "string" && body.trim() ? body.trim() : null;

    const { error } = await supabase.from("course_reviews").upsert(
      {
        academy_id: realAcademyId,
        course_id: courseId,
        user_id: userId,
        rating: safeRating,
        body: trimmed,
      },
      { onConflict: "course_id,user_id" },
    );

    if (error) return { ok: false, code: "denied" };
    return { ok: true };
  } catch {
    return { ok: false, code: "error" };
  }
}
