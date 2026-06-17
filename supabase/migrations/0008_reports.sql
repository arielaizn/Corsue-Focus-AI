-- =============================================================================
-- 0008_reports.sql — CourseFocus AI
-- Phase 0 · content moderation reports (idempotent, safe to re-run)
-- =============================================================================
-- Backs the academy + platform moderation queues. No reporting data existed
-- before (posts/comments have only deleted_at, no flag column).
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE report_status_enum AS ENUM ('open','reviewing','actioned','dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.content_reports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id   uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  entity_type  text NOT NULL CHECK (entity_type IN ('post','comment')),
  entity_id    uuid NOT NULL,
  reporter_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason       text NOT NULL,
  status       report_status_enum NOT NULL DEFAULT 'open',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_reports_academy ON public.content_reports(academy_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_status  ON public.content_reports(status);

DROP TRIGGER IF EXISTS trg_content_reports_updated_at ON public.content_reports;
CREATE TRIGGER trg_content_reports_updated_at
  BEFORE UPDATE ON public.content_reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- members report content in their academy
DROP POLICY IF EXISTS "content_reports_insert" ON public.content_reports;
CREATE POLICY "content_reports_insert"
  ON public.content_reports FOR INSERT
  WITH CHECK (reporter_id = auth_uid() AND is_member_of(academy_id));

-- the reporter, academy owners/admins, and platform admins can read
DROP POLICY IF EXISTS "content_reports_select" ON public.content_reports;
CREATE POLICY "content_reports_select"
  ON public.content_reports FOR SELECT
  USING (
    public.is_platform_admin()
    OR reporter_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

-- academy owners/admins and platform admins resolve reports
DROP POLICY IF EXISTS "content_reports_manage" ON public.content_reports;
CREATE POLICY "content_reports_manage"
  ON public.content_reports FOR UPDATE
  USING (public.is_platform_admin() OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (public.is_platform_admin() OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- =============================================================================
-- END OF 0008_reports.sql
-- =============================================================================
