import { markLessonProgress } from "@/lib/data/learn";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/learn/progress — the player's watch-progress heartbeat.
 *
 * Body: { lessonId, positionS, watchPercent }. The player POSTs this on a
 * ~10s throttle plus on pause / tab-hide (via fetch keepalive or sendBeacon).
 * Auth: must be signed in. markLessonProgress re-derives the user + the
 * lesson's academy/course/enrollment server-side (never trusts client ids).
 */

interface ProgressBody {
  lessonId?: unknown;
  positionS?: unknown;
  watchPercent?: unknown;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function toNum(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(request: Request): Promise<Response> {
  // sendBeacon ships a Blob — parse defensively (it may arrive as text/plain).
  let body: ProgressBody;
  try {
    body = (await request.json()) as ProgressBody;
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  if (!lessonId) return json(400, { ok: false, error: "missing_lesson" });

  // Authenticate — reject anonymous heartbeats.
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json(401, { ok: false, error: "unauthorized" });

  const res = await markLessonProgress({
    lessonId,
    positionS: toNum(body.positionS),
    watchPercent: toNum(body.watchPercent),
  });

  return json(res.ok ? 200 : 422, { ok: res.ok });
}
