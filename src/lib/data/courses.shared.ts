import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   COURSES — pure, isomorphic types, enums, and constants.
   Safe to import from BOTH client and server components (no "server-only").
   The RLS-safe server reads live in `courses.ts`, which re-exports everything
   here for backwards-compatible server imports.
--------------------------------------------------------------------------- */

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type ModuleRow = Database["public"]["Tables"]["modules"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type CourseType = Database["public"]["Enums"]["course_type_enum"];
export type ContentType = Database["public"]["Enums"]["content_type_enum"];

export const COURSE_TYPES: readonly CourseType[] = [
  "free",
  "one_time",
  "subscription",
  "vip",
  "private",
  "cohort",
] as const;

export const CONTENT_TYPES: readonly ContentType[] = [
  "video",
  "audio",
  "pdf",
  "ppt",
  "image",
  "text",
  "embed",
  "link",
] as const;

/** A course list row + its lesson count (for the index page). */
export interface CourseListItem {
  id: string;
  title: string;
  short_desc: string | null;
  course_type: CourseType;
  price: number | null;
  currency: string;
  is_published: boolean;
  enrolled_count: number;
  created_at: string;
  lessonCount: number | null;
  moduleCount: number | null;
}

/** A module with its ordered lessons (for the builder). */
export interface ModuleWithLessons extends ModuleRow {
  lessons: Lesson[];
}
