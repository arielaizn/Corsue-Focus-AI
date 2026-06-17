-- =============================================================================
-- 0010_comments_moderation_fix.sql — CourseFocus AI (idempotent)
-- The comments_update policy only allowed the author (user_id = auth_uid()), so
-- an owner/admin soft-deleting (moderating) someone else's comment matched zero
-- rows — a silent no-op. Broaden it to allow academy owners/admins, mirroring
-- comments_delete and the posts UPDATE policy.
-- =============================================================================

DROP POLICY IF EXISTS "comments_update" ON public.comments;
CREATE POLICY "comments_update"
  ON public.comments FOR UPDATE
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner', 'admin']::role_enum[])
  )
  WITH CHECK (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner', 'admin']::role_enum[])
  );

-- =============================================================================
-- END OF 0010_comments_moderation_fix.sql
-- =============================================================================
