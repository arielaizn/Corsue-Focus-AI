"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  PUBLIC_BUCKETS,
  publicUrl,
  type BucketId,
} from "@/lib/data/storage";

/* ---------------------------------------------------------------------------
   Reusable media uploader (Supabase Storage). Uploads under the caller-supplied
   path (whose first folder is the academy/user id — see 0005_storage.sql RLS),
   then returns a usable URL (public URL for public buckets, signed URL for
   private ones). Image files get an inline preview.
--------------------------------------------------------------------------- */

const COPY = {
  he: {
    choose: "בחר קובץ",
    replace: "החלף",
    uploading: "מעלה…",
    tooBig: "הקובץ גדול מדי (מקסימום 50MB).",
    failed: "ההעלאה נכשלה. נסה שוב.",
  },
  en: {
    choose: "Choose file",
    replace: "Replace",
    uploading: "Uploading…",
    tooBig: "File too large (max 50MB).",
    failed: "Upload failed. Try again.",
  },
} as const;

const MAX_BYTES = 50 * 1024 * 1024;

export interface MediaUploadProps {
  locale: "he" | "en";
  bucket: BucketId;
  /** Build the storage path from the chosen filename (first folder = acl key). */
  buildPath: (filename: string) => string;
  /** Existing URL to preview, if any. */
  currentUrl?: string | null;
  accept?: string;
  /** Called with the resulting URL after a successful upload. */
  onUploaded: (url: string) => void;
}

export function MediaUpload({
  locale,
  bucket,
  buildPath,
  currentUrl,
  accept = "image/*",
  onUploaded,
}: MediaUploadProps) {
  const t = COPY[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError(t.tooBig);
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const path = buildPath(file.name);
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;

      let url: string;
      if (PUBLIC_BUCKETS.has(bucket)) {
        url = publicUrl(bucket, path);
      } else {
        const { data, error: signErr } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
        if (signErr || !data) throw signErr ?? new Error("sign failed");
        url = data.signedUrl;
      }
      setPreview(url);
      onUploaded(url);
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  }

  const isImage = accept.startsWith("image");

  return (
    <div className="flex items-center gap-4">
      {isImage && preview ? (
        <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-2/60 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          {/* unoptimized: external Supabase URL, avoids next/image domain config */}
          <Image
            src={preview}
            alt=""
            fill
            sizes="64px"
            unoptimized
            className="object-cover"
          />
        </span>
      ) : (
        <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-surface-2/60 text-xs text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          {busy ? "…" : "—"}
        </span>
      )}

      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex w-fit items-center rounded-lg bg-surface-2/60 px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-60 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          {busy ? t.uploading : preview ? t.replace : t.choose}
        </button>
        {error && (
          <span className="text-xs text-red-400" role="alert">
            {error}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
