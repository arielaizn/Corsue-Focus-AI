-- =============================================================================
-- 0009_review_and_counters_fix.sql — CourseFocus AI (idempotent)
-- Fixes two defects found in the Phase-2 review:
--   (A) course_reviews write policy used is_enrolled_in() which is active-only,
--       but a learner reviews AFTER the completion trigger flips the enrollment
--       to 'completed' → reviews were always rejected. Allow active OR completed
--       enrollees (scoped to their own enrollment, not just academy membership).
--   (B) posts.like_count / comment_count had NO maintenance triggers → counters
--       were frozen at 0. Add SECURITY DEFINER triggers (they UPDATE posts, which
--       students cannot do under RLS).
-- =============================================================================

-- (A) course_reviews: active OR completed enrollees may write their own review.
DROP POLICY IF EXISTS "course_reviews_write_own" ON public.course_reviews;
CREATE POLICY "course_reviews_write_own"
  ON public.course_reviews FOR ALL
  USING (user_id = auth_uid())
  WITH CHECK (
    user_id = auth_uid()
    AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_reviews.course_id
        AND e.user_id = auth_uid()
        AND e.status IN ('active', 'completed')
    )
  );

-- (B1) like_count from post_reactions.
CREATE OR REPLACE FUNCTION public.sync_post_like_count()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_post_reactions_count ON public.post_reactions;
CREATE TRIGGER trg_post_reactions_count
  AFTER INSERT OR DELETE ON public.post_reactions
  FOR EACH ROW EXECUTE FUNCTION public.sync_post_like_count();

-- (B2) comment_count from comments (entity_type='post'), soft-delete aware.
CREATE OR REPLACE FUNCTION public.sync_post_comment_count()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.entity_type = 'post' AND NEW.deleted_at IS NULL THEN
      UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.entity_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.entity_type = 'post' THEN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = NEW.entity_id;
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.entity_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.entity_type = 'post' AND OLD.deleted_at IS NULL THEN
      UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.entity_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_comments_post_count ON public.comments;
CREATE TRIGGER trg_comments_post_count
  AFTER INSERT OR UPDATE OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_post_comment_count();

-- =============================================================================
-- END OF 0009_review_and_counters_fix.sql
-- =============================================================================
