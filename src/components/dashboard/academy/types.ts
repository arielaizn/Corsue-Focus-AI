import type { AcademyFormValues, FieldErrors } from "@/lib/data/academies.shared";

/** The state object threaded through useActionState. */
export interface AcademyActionState {
  status: "idle" | "error" | "success";
  /** Coarse, localizable error code (not a raw message). */
  formError?: "denied" | "slug_taken" | "unknown" | "validation" | "slug_check";
  fieldErrors?: FieldErrors;
  /** Echo the submitted values so the form keeps user input on error. */
  values?: AcademyFormValues;
  /** Present on a successful in-place update (settings mode). */
  savedAt?: number;
}

export const initialAcademyState: AcademyActionState = { status: "idle" };
