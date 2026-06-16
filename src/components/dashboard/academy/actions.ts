"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  createAcademy,
  updateAcademy,
  validateAcademy,
  hasErrors,
  isSlugAvailable,
  type AcademyFormValues,
  type FieldErrors,
} from "@/lib/data/academies";

// NOTE: a "use server" file may export ONLY async functions. The shared state
// type + initial-state constant live in ./types (a plain module).
import type { AcademyActionState } from "./types";

function resolveLocale(value: FormDataEntryValue | null): Locale {
  const v = typeof value === "string" ? value : "";
  return isLocale(v) ? v : defaultLocale;
}

function readValues(formData: FormData): AcademyFormValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase(),
    description: String(formData.get("description") ?? ""),
    locale: String(formData.get("locale_pref") ?? "he"),
    currency: String(formData.get("currency") ?? "ILS"),
    timezone: String(formData.get("timezone") ?? "Asia/Jerusalem"),
    white_label: formData.get("white_label") === "on",
    brandPrimary: String(formData.get("brandPrimary") ?? "").trim(),
    brandAccent: String(formData.get("brandAccent") ?? "").trim(),
  };
}

/** CREATE: insert academy + owner membership, then route into it. */
export async function createAcademyAction(
  _prev: AcademyActionState,
  formData: FormData,
): Promise<AcademyActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const values = readValues(formData);

  const fieldErrors = validateAcademy(values);
  if (hasErrors(fieldErrors)) {
    return { status: "error", formError: "validation", fieldErrors, values };
  }

  // Final server-side slug guard (unknown availability is allowed through —
  // the DB unique constraint is the real authority and maps to slug_taken).
  const available = await isSlugAvailable(values.slug);
  if (available === false) {
    return {
      status: "error",
      formError: "slug_taken",
      fieldErrors: { slug: "taken" },
      values,
    };
  }

  const result = await createAcademy(values);
  if (!result.ok || !result.academyId) {
    return {
      status: "error",
      formError: result.code ?? "unknown",
      fieldErrors:
        result.code === "slug_taken" ? { slug: "taken" } : undefined,
      values,
    };
  }

  revalidatePath(`/${locale}/dashboard`, "layout");
  redirect(`/${locale}/dashboard/academy?academy=${result.academyId}`);
}

/** UPDATE: settings save, in place (no redirect). */
export async function updateAcademyAction(
  _prev: AcademyActionState,
  formData: FormData,
): Promise<AcademyActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const academyId = String(formData.get("academyId") ?? "");
  const values = readValues(formData);

  if (!academyId) {
    return { status: "error", formError: "denied", values };
  }

  const fieldErrors = validateAcademy(values);
  if (hasErrors(fieldErrors)) {
    return { status: "error", formError: "validation", fieldErrors, values };
  }

  const available = await isSlugAvailable(values.slug, academyId);
  if (available === false) {
    return {
      status: "error",
      formError: "slug_taken",
      fieldErrors: { slug: "taken" },
      values,
    };
  }

  const result = await updateAcademy(academyId, values);
  if (!result.ok) {
    return {
      status: "error",
      formError: result.code ?? "unknown",
      fieldErrors:
        result.code === "slug_taken" ? { slug: "taken" } : undefined,
      values,
    };
  }

  revalidatePath(`/${locale}/dashboard/academy`, "page");
  revalidatePath(`/${locale}/dashboard`, "layout");
  return { status: "success", savedAt: Date.now(), values };
}

/** Lightweight slug availability probe used by the live hint (client → action). */
export async function checkSlugAction(
  slug: string,
  exceptId?: string,
): Promise<"available" | "taken" | "invalid" | "unknown"> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return "invalid";
  const res = await isSlugAvailable(normalized, exceptId);
  if (res === null) return "unknown";
  return res ? "available" : "taken";
}
