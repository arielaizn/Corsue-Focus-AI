/* ---------------------------------------------------------------------------
   Shared action-state shapes for the SETTINGS forms. A plain module (NOT
   "use server") because a server-action file may export only async functions.
--------------------------------------------------------------------------- */

/** Echoed account fields so the form keeps user input across a round-trip. */
export interface AccountValues {
  display_name: string;
  bio: string;
  locale: "he" | "en";
  timezone: string;
  website_url: string;
  avatar_url: string;
  is_public: boolean;
  /** The user's own id — the ACL key (first folder) for the avatar path.
   *  Not posted; used only client-side to build the storage path. */
  avatarKey: string;
}

export interface AccountActionState {
  status: "idle" | "error" | "success";
  /** Coarse, localizable error code (not a raw message). */
  error?: "generic" | "notSignedIn" | "nameRequired";
  /** Echo the submitted values so the form survives a validation error. */
  values?: AccountValues;
  /** Present on a successful save (bumps to re-trigger the success notice). */
  savedAt?: number;
}

export const initialAccountState: AccountActionState = { status: "idle" };

export interface DeleteAcademyState {
  status: "idle" | "error" | "success";
  error?: "generic" | "notSignedIn" | "notOwner" | "confirmMismatch";
}

export const initialDeleteState: DeleteAcademyState = { status: "idle" };
