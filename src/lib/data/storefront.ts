import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";
import { getUser } from "@/lib/auth";
import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   PUBLIC STOREFRONT data layer — anonymous-accessible academy + course reads.

   These pages render for logged-out visitors (no requireStudent), so every
   read is best-effort and degrades to null/[] instead of throwing.

   RLS strategy: read AS the visitor first (createClient(await cookies())).
   Public listings/courses are visible under RLS to anonymous users, but the
   seeded policies on `academies`/`courses` can intermittently raise "infinite
   recursion in policy" and a brand-new academy may not be listed yet — so when
   the RLS read yields nothing we fall back to the service-role client. The
   fallback is read-only and re-applies the SAME public predicates (non-deleted,
   published) so we never leak private/unpublished content.

   IMPORTANT — preview gating: lesson `body`/`media_url`/`media_meta`/markdown
   are only ever returned for `is_free_preview` lessons. For locked lessons we
   return title + metadata (position, content_type, duration) ONLY.
--------------------------------------------------------------------------- */

type AcademyRow = Database["public"]["Tables"]["academies"]["Row"];
type AcademyListingRow = Database["public"]["Tables"]["academy_listings"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

type RlsClient = Awaited<ReturnType<typeof rlsClient>>;
type AnyClient = RlsClient | ReturnType<typeof createServiceClient>;

async function rlsClient() {
  return createClient(await cookies());
}

/** Service-role client, or null if env is missing (never throw out of here). */
function svcClient(): ReturnType<typeof createServiceClient> | null {
  try {
    return createServiceClient();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public shapes (only what the storefront renders — never is_correct, etc.)
// ---------------------------------------------------------------------------

/** Academy meta + its public listing (tagline/cover/social proof). */
export interface PublicAcademy {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  favicon_url: string | null;
  brand_colors: AcademyRow["brand_colors"];
  hide_platform_badge: boolean;
  meta_title: string | null;
  meta_description: string | null;
  listing: {
    tagline: string | null;
    cover_url: string | null;
    student_count: number;
    rating_avg: number | null;
    rating_count: number;
    is_featured: boolean;
  } | null;
}

/** A published course card for the storefront grids. */
export interface PublicCourseCard {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  cover_url: string | null;
  course_type: CourseRow["course_type"];
  price: number | null;
  currency: string;
  enrolled_count: number;
  rating_avg: number | null;
  rating_count: number;
  is_featured: boolean;
  lessonCount: number;
  moduleCount: number;
}

/** A lesson row in the curriculum outline. Body/media only when free-preview. */
export interface PublicLessonOutline {
  id: string;
  title: string;
  position: number;
  content_type: string;
  duration_s: number | null;
  is_free_preview: boolean;
  /** Only populated for is_free_preview lessons. */
  body: string | null;
  media_url: string | null;
  media_meta: Database["public"]["Tables"]["lessons"]["Row"]["media_meta"];
}

export interface PublicModuleOutline {
  id: string;
  title: string;
  position: number;
  lessons: PublicLessonOutline[];
}

/** Full public course detail: academy chrome + course meta + curriculum. */
export interface PublicCourse {
  academy: PublicAcademy;
  course: {
    id: string;
    slug: string;
    title: string;
    short_desc: string | null;
    description: string | null;
    cover_url: string | null;
    course_type: CourseRow["course_type"];
    price: number | null;
    currency: string;
    enrolled_count: number;
    rating_avg: number | null;
    rating_count: number;
    instructorName: string | null;
  };
  modules: PublicModuleOutline[];
  lessonCount: number;
  freePreviewCount: number;
}

// ---------------------------------------------------------------------------
// getAcademyBySlug — RLS first, service-role fallback. Non-deleted only.
// ---------------------------------------------------------------------------

const ACADEMY_COLS =
  "id, slug, name, description, logo_url, cover_url, favicon_url, brand_colors, hide_platform_badge, meta_title, meta_description, deleted_at";

function shapeAcademy(
  a: Pick<
    AcademyRow,
    | "id"
    | "slug"
    | "name"
    | "description"
    | "logo_url"
    | "cover_url"
    | "favicon_url"
    | "brand_colors"
    | "hide_platform_badge"
    | "meta_title"
    | "meta_description"
  >,
  listing: AcademyListingRow | null,
): PublicAcademy {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    description: a.description,
    logo_url: a.logo_url,
    cover_url: a.cover_url,
    favicon_url: a.favicon_url,
    brand_colors: a.brand_colors,
    hide_platform_badge: a.hide_platform_badge,
    meta_title: a.meta_title,
    meta_description: a.meta_description,
    listing: listing
      ? {
          tagline: listing.tagline,
          cover_url: listing.cover_url,
          student_count: listing.student_count,
          rating_avg: listing.rating_avg,
          rating_count: listing.rating_count,
          is_featured: listing.is_featured,
        }
      : null,
  };
}

/** Read one non-deleted academy row by slug from a given client. */
async function readAcademyRow(
  client: AnyClient,
  slug: string,
): Promise<AcademyRow | null> {
  const { data } = await client
    .from("academies")
    .select(ACADEMY_COLS)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();
  return (data as AcademyRow | null) ?? null;
}

/** Read the academy_listing for an academy from a given client. */
async function readListing(
  client: AnyClient,
  academyId: string,
): Promise<AcademyListingRow | null> {
  const { data } = await client
    .from("academy_listings")
    .select("*")
    .eq("academy_id", academyId)
    .maybeSingle();
  return (data as AcademyListingRow | null) ?? null;
}

/**
 * Resolve a public academy by slug. Tries the visitor (RLS) read first; if the
 * row is unreadable (recursion / unlisted), falls back to the service-role
 * client. Returns null when truly absent or soft-deleted.
 */
export async function getAcademyBySlug(
  slug: string,
): Promise<PublicAcademy | null> {
  const clean = slug.trim().toLowerCase();
  if (!clean) return null;

  // 1) RLS read as the visitor.
  try {
    const supabase = await rlsClient();
    const row = await readAcademyRow(supabase, clean);
    if (row) {
      const listing = await readListing(supabase, row.id);
      return shapeAcademy(row, listing);
    }
  } catch {
    // fall through to service-role
  }

  // 2) Service-role fallback (re-applies non-deleted predicate).
  try {
    const svc = svcClient();
    if (!svc) return null;
    const row = await readAcademyRow(svc, clean);
    if (!row) return null;
    const listing = await readListing(svc, row.id);
    return shapeAcademy(row, listing);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// getPublicCatalog — published, non-deleted courses for an academy.
// ---------------------------------------------------------------------------

const COURSE_CARD_COLS =
  "id, slug, title, short_desc, cover_url, course_type, price, currency, enrolled_count, rating_avg, rating_count, is_featured, is_published, deleted_at, created_at";

async function readPublishedCourses(
  client: AnyClient,
  academyId: string,
): Promise<CourseRow[]> {
  const { data } = await client
    .from("courses")
    .select(COURSE_CARD_COLS)
    .eq("academy_id", academyId)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  return (data as CourseRow[] | null) ?? [];
}

/** Published-lesson + module counts for a course (the curriculum size). */
async function courseCounts(
  client: AnyClient,
  courseId: string,
): Promise<{ lessonCount: number; moduleCount: number }> {
  const [{ count: lessonCount }, { count: moduleCount }] = await Promise.all([
    client
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId)
      .eq("is_published", true)
      .is("deleted_at", null),
    client
      .from("modules")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId),
  ]);
  return { lessonCount: lessonCount ?? 0, moduleCount: moduleCount ?? 0 };
}

function shapeCard(
  c: CourseRow,
  counts: { lessonCount: number; moduleCount: number },
): PublicCourseCard {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    short_desc: c.short_desc,
    cover_url: c.cover_url,
    course_type: c.course_type,
    price: c.price,
    currency: c.currency,
    enrolled_count: c.enrolled_count,
    rating_avg: c.rating_avg,
    rating_count: c.rating_count,
    is_featured: c.is_featured,
    lessonCount: counts.lessonCount,
    moduleCount: counts.moduleCount,
  };
}

/**
 * The published course catalog for an academy. RLS read first; service-role
 * fallback when the RLS read returns nothing (recursion-safe). Each card
 * carries its published-lesson + module counts.
 */
export async function getPublicCatalog(
  academyId: string,
): Promise<PublicCourseCard[]> {
  if (!academyId) return [];

  // Counts (lessons + modules) are non-sensitive aggregates that anon CANNOT
  // read under RLS (modules denied, only preview lessons visible → "0 lessons").
  // Resolve the service client once and ALWAYS compute counts with it, no matter
  // which tier read the course rows. courseCounts already filters is_published +
  // deleted_at null, so this exposes no locked/private content.
  const svc = svcClient();

  const build = async (
    rows: CourseRow[],
  ): Promise<PublicCourseCard[]> =>
    Promise.all(
      rows.map(async (c) =>
        shapeCard(c, svc ? await courseCounts(svc, c.id) : { lessonCount: 0, moduleCount: 0 }),
      ),
    );

  // 1) RLS read (course cards).
  try {
    const supabase = await rlsClient();
    const rows = await readPublishedCourses(supabase, academyId);
    if (rows.length > 0) return build(rows);
  } catch {
    // fall through
  }

  // 2) Service-role fallback (course cards).
  try {
    if (!svc) return [];
    const rows = await readPublishedCourses(svc, academyId);
    return build(rows);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// getPublicCourse — academy + course + curriculum (preview-gated bodies/media).
// ---------------------------------------------------------------------------

const COURSE_DETAIL_COLS =
  "id, slug, title, short_desc, description, cover_url, course_type, price, currency, enrolled_count, rating_avg, rating_count, instructor_id, academy_id, is_published, deleted_at";

async function readCourseDetail(
  client: AnyClient,
  academyId: string,
  courseId: string,
): Promise<CourseRow | null> {
  const { data } = await client
    .from("courses")
    .select(COURSE_DETAIL_COLS)
    .eq("id", courseId)
    .eq("academy_id", academyId)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();
  return (data as CourseRow | null) ?? null;
}

/** Build the preview-gated curriculum outline for a published course. */
async function readCurriculum(
  client: AnyClient,
  academyId: string,
  courseId: string,
): Promise<{
  modules: PublicModuleOutline[];
  lessonCount: number;
  freePreviewCount: number;
}> {
  const [{ data: modules }, { data: lessons }] = await Promise.all([
    client
      .from("modules")
      .select("id, title, position")
      .eq("course_id", courseId)
      .eq("academy_id", academyId)
      .order("position", { ascending: true }),
    client
      .from("lessons")
      .select(
        "id, module_id, title, position, content_type, is_free_preview, body, media_url, media_meta",
      )
      .eq("course_id", courseId)
      .eq("academy_id", academyId)
      .eq("is_published", true)
      .is("deleted_at", null)
      .order("position", { ascending: true }),
  ]);

  const byModule = new Map<string, PublicLessonOutline[]>();
  let lessonCount = 0;
  let freePreviewCount = 0;

  for (const l of lessons ?? []) {
    lessonCount += 1;
    const isPreview = Boolean(l.is_free_preview);
    if (isPreview) freePreviewCount += 1;

    const meta =
      l.media_meta && typeof l.media_meta === "object" && !Array.isArray(l.media_meta)
        ? (l.media_meta as Record<string, unknown>)
        : null;
    const durationRaw = meta?.duration_s;
    const duration_s = typeof durationRaw === "number" ? durationRaw : null;

    const outline: PublicLessonOutline = {
      id: l.id,
      title: l.title,
      position: l.position,
      content_type: l.content_type,
      duration_s,
      is_free_preview: isPreview,
      // PREVIEW GATE: never expose body/media for locked lessons.
      body: isPreview ? l.body : null,
      media_url: isPreview ? l.media_url : null,
      media_meta: isPreview ? l.media_meta : null,
    };

    const arr = byModule.get(l.module_id) ?? [];
    arr.push(outline);
    byModule.set(l.module_id, arr);
  }

  const shaped: PublicModuleOutline[] = (modules ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    position: m.position,
    lessons: byModule.get(m.id) ?? [],
  }));

  return { modules: shaped, lessonCount, freePreviewCount };
}

/** Best-effort instructor display name (public profile field). */
async function readInstructorName(
  client: AnyClient,
  instructorId: string | null,
): Promise<string | null> {
  if (!instructorId) return null;
  try {
    // Re-apply the public-profile predicate even on the service-role client
    // (which bypasses RLS) so a non-public instructor profile is never exposed
    // to anon — matches profiles_select_public (is_public = true).
    const { data } = await client
      .from("profiles")
      .select("display_name")
      .eq("id", instructorId)
      .eq("is_public", true)
      .maybeSingle();
    return data?.display_name ?? null;
  } catch {
    return null;
  }
}

function shapeCourseDetail(
  c: CourseRow,
  instructorName: string | null,
): PublicCourse["course"] {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    short_desc: c.short_desc,
    description: c.description,
    cover_url: c.cover_url,
    course_type: c.course_type,
    price: c.price,
    currency: c.currency,
    enrolled_count: c.enrolled_count,
    rating_avg: c.rating_avg,
    rating_count: c.rating_count,
    instructorName,
  };
}

/**
 * Full public course detail by academy slug + course id. Resolves the academy
 * (RLS→service fallback), then the published course + its preview-gated
 * curriculum from the SAME client tier that could read the course. Returns null
 * if the academy or course is absent / unpublished / soft-deleted.
 */
export async function getPublicCourse(
  slug: string,
  courseId: string,
): Promise<PublicCourse | null> {
  const academy = await getAcademyBySlug(slug);
  if (!academy || !courseId) return null;

  const assemble = async (
    client: AnyClient,
  ): Promise<PublicCourse | null> => {
    const course = await readCourseDetail(client, academy.id, courseId);
    if (!course) return null;
    const [curriculum, instructorName] = await Promise.all([
      readCurriculum(client, academy.id, courseId),
      readInstructorName(client, course.instructor_id),
    ]);
    return {
      academy,
      course: shapeCourseDetail(course, instructorName),
      modules: curriculum.modules,
      lessonCount: curriculum.lessonCount,
      freePreviewCount: curriculum.freePreviewCount,
    };
  };

  // 1) RLS read — only trustworthy for an AUTHENTICATED visitor. Anonymous
  //    visitors are denied `modules` under RLS (modules_select = is_member_of),
  //    so the RLS assemble would return a truthy course with modules:[] and the
  //    service-role fallback would never run. For anon we skip straight to the
  //    service-role assemble below.
  const user = await getUser();
  if (user) {
    try {
      const supabase = await rlsClient();
      const result = await assemble(supabase);
      if (result) return result;
    } catch {
      // fall through
    }
  }

  // 2) Service-role assemble (re-applies is_published + deleted_at-null and
  //    JS-gates body/media to is_free_preview only — no locked content leaks).
  try {
    const svc = svcClient();
    if (!svc) return null;
    return await assemble(svc);
  } catch {
    return null;
  }
}
