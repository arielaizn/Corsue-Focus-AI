-- =============================================================================
-- 0006_learner.sql — CourseFocus AI
-- Phase 0 · learner-surface foundation (idempotent, safe to re-run)
-- =============================================================================
--   (A) handle_new_enrollment — on self-enroll, ensure the learner has a
--       role='student' membership so is_member_of() is true for the progress /
--       quiz / notes / community self-writes that gate on it. SECURITY DEFINER
--       (bypasses memberships WITH CHECK). Mirrors handle_new_academy in 0004.
--   (B) sync_enrollment_completion — students cannot UPDATE their own enrollment
--       (enrollments_update is owner/admin only), so completion is automated:
--       when the last published lesson of a course is marked complete, flip the
--       enrollment to 'completed'. SECURITY DEFINER.
--   (C) memberships_insert_student_self — defensive self-insert, gated on an
--       existing enrollment in that academy (no privilege leak).
--   (D) course_reviews — the missing course-rating write path (1..5 + body),
--       RLS-scoped, with a rollup trigger to courses.rating_avg / rating_count.
-- =============================================================================

-- (A) --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_enrollment()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.memberships (academy_id, user_id, role)
  VALUES (NEW.academy_id, NEW.user_id, 'student')
  ON CONFLICT (academy_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_enrollment_created ON enrollments;
CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_enrollment();

-- (B) --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_enrollment_completion()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course uuid;
  v_total  integer;
  v_done   integer;
BEGIN
  IF NEW.status <> 'completed' THEN
    RETURN NEW;
  END IF;

  SELECT course_id INTO v_course FROM public.lessons WHERE id = NEW.lesson_id;
  IF v_course IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO v_total
  FROM public.lessons
  WHERE course_id = v_course AND is_published = true AND deleted_at IS NULL;

  SELECT count(DISTINCT lp.lesson_id) INTO v_done
  FROM public.lesson_progress lp
  JOIN public.lessons l ON l.id = lp.lesson_id
  WHERE l.course_id = v_course AND l.is_published = true AND l.deleted_at IS NULL
    AND lp.user_id = NEW.user_id AND lp.status = 'completed';

  IF v_total > 0 AND v_done >= v_total THEN
    UPDATE public.enrollments
    SET status = 'completed', completed_at = COALESCE(completed_at, now())
    WHERE course_id = v_course AND user_id = NEW.user_id AND status <> 'completed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_lesson_progress_completion ON lesson_progress;
CREATE TRIGGER on_lesson_progress_completion
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.sync_enrollment_completion();

-- (C) --------------------------------------------------------------------------
-- Defensive self-insert: a learner may add their OWN role='student' membership,
-- but ONLY for an academy where they already hold an enrollment (no leak).
DROP POLICY IF EXISTS "memberships_insert_student_self" ON memberships;
CREATE POLICY "memberships_insert_student_self"
  ON memberships FOR INSERT
  WITH CHECK (
    user_id = auth_uid()
    AND role = 'student'
    AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.academy_id = memberships.academy_id
        AND e.user_id = auth_uid()
    )
  );

-- (D) --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  course_id   uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON public.course_reviews(course_id);

DROP TRIGGER IF EXISTS trg_course_reviews_updated_at ON public.course_reviews;
CREATE TRIGGER trg_course_reviews_updated_at
  BEFORE UPDATE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "course_reviews_select" ON public.course_reviews;
CREATE POLICY "course_reviews_select"
  ON public.course_reviews FOR SELECT
  USING (is_member_of(academy_id) OR is_listed_academy(academy_id));

DROP POLICY IF EXISTS "course_reviews_write_own" ON public.course_reviews;
CREATE POLICY "course_reviews_write_own"
  ON public.course_reviews FOR ALL
  USING (user_id = auth_uid())
  WITH CHECK (user_id = auth_uid() AND is_enrolled_in(course_id));

-- Rollup the average rating onto courses.rating_avg / rating_count.
CREATE OR REPLACE FUNCTION public.recalc_course_rating()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course uuid := COALESCE(NEW.course_id, OLD.course_id);
BEGIN
  UPDATE public.courses c
  SET rating_avg   = sub.avg_rating,
      rating_count = sub.cnt
  FROM (
    SELECT round(avg(rating)::numeric, 2) AS avg_rating, count(*) AS cnt
    FROM public.course_reviews
    WHERE course_id = v_course
  ) sub
  WHERE c.id = v_course;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_course_reviews_rollup ON public.course_reviews;
CREATE TRIGGER trg_course_reviews_rollup
  AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalc_course_rating();

-- =============================================================================
-- END OF 0006_learner.sql
-- =============================================================================
