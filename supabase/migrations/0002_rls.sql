-- =============================================================================
-- 0002_rls.sql — CourseFocus AI  |  Row Level Security
-- Enable RLS + helper functions + all policies
-- =============================================================================
-- Convention:
--   • "DROP POLICY IF EXISTS ... ON ..." before every CREATE POLICY → idempotent.
--   • Helper functions run as SECURITY DEFINER so they bypass RLS internally.
--   • All functions are in the public schema so RLS policies can call them.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- HELPER FUNCTIONS
-- ---------------------------------------------------------------------------

-- Returns the UUID of the currently authenticated user (thin alias for clarity)
CREATE OR REPLACE FUNCTION auth_uid()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT auth.uid();
$$;

-- True if the calling user has any active membership in the given academy
CREATE OR REPLACE FUNCTION is_member_of(p_academy_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE academy_id = p_academy_id
      AND user_id    = auth.uid()
  );
$$;

-- True if the calling user holds ANY of the supplied roles in the given academy
-- Example: has_role(academy_id, ARRAY['owner','admin'])
CREATE OR REPLACE FUNCTION has_role(p_academy_id uuid, p_roles role_enum[])
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE academy_id = p_academy_id
      AND user_id    = auth.uid()
      AND role       = ANY(p_roles)
  );
$$;

-- True if the caller owns the academy
CREATE OR REPLACE FUNCTION is_owner_of(p_academy_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM academies
    WHERE id       = p_academy_id
      AND owner_id = auth.uid()
  );
$$;

-- True if the caller is enrolled (active) in the given course
CREATE OR REPLACE FUNCTION is_enrolled_in(p_course_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrollments
    WHERE course_id = p_course_id
      AND user_id   = auth.uid()
      AND status    = 'active'
  );
$$;

-- =============================================================================
-- ENABLE RLS ON EVERY TENANT-SCOPED TABLE
-- =============================================================================

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships        ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules            ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources   ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options   ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups             ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels             ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp            ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges         ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans              ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns    ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends        ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys           ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases    ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mentors         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_daily_tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_listings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_follows    ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECTION 1 — PROFILES
-- =============================================================================

-- Anyone can read public profiles
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (is_public = true OR id = auth_uid());

-- Users can update only their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth_uid())
  WITH CHECK (id = auth_uid());

-- Profile is created automatically via a trigger on auth.users insert
-- (see application layer / Supabase auth hook)
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth_uid());

-- =============================================================================
-- SECTION 2 — ACADEMIES
-- =============================================================================

-- Public marketplace listings are readable by everyone (including anon)
-- Full academy details are readable by members
DROP POLICY IF EXISTS "academies_select_member" ON academies;
CREATE POLICY "academies_select_member"
  ON academies FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      is_member_of(id)                  -- authenticated member
      OR owner_id = auth_uid()          -- owner
      OR EXISTS (                       -- listed on marketplace
        SELECT 1 FROM academy_listings WHERE academy_id = academies.id
      )
    )
  );

-- Only the owner can INSERT their own academy
DROP POLICY IF EXISTS "academies_insert_owner" ON academies;
CREATE POLICY "academies_insert_owner"
  ON academies FOR INSERT
  WITH CHECK (owner_id = auth_uid());

-- Owners and admins can UPDATE academy settings
DROP POLICY IF EXISTS "academies_update_admin" ON academies;
CREATE POLICY "academies_update_admin"
  ON academies FOR UPDATE
  USING (has_role(id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(id, ARRAY['owner','admin']::role_enum[]));

-- Only owner can delete (soft)
DROP POLICY IF EXISTS "academies_delete_owner" ON academies;
CREATE POLICY "academies_delete_owner"
  ON academies FOR DELETE
  USING (owner_id = auth_uid());

-- =============================================================================
-- SECTION 3 — MEMBERSHIPS
-- =============================================================================

DROP POLICY IF EXISTS "memberships_select" ON memberships;
CREATE POLICY "memberships_select"
  ON memberships FOR SELECT
  USING (
    user_id = auth_uid()                                     -- own membership
    OR has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[])
  );

-- Members can be added by owners/admins
DROP POLICY IF EXISTS "memberships_insert_admin" ON memberships;
CREATE POLICY "memberships_insert_admin"
  ON memberships FOR INSERT
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- Owners/admins can change roles; users can remove themselves
DROP POLICY IF EXISTS "memberships_update_admin" ON memberships;
CREATE POLICY "memberships_update_admin"
  ON memberships FOR UPDATE
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

DROP POLICY IF EXISTS "memberships_delete" ON memberships;
CREATE POLICY "memberships_delete"
  ON memberships FOR DELETE
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

-- =============================================================================
-- SECTION 4 — INVITATIONS
-- =============================================================================

DROP POLICY IF EXISTS "invitations_select" ON invitations;
CREATE POLICY "invitations_select"
  ON invitations FOR SELECT
  USING (
    has_role(academy_id, ARRAY['owner','admin']::role_enum[])
    OR invited_by = auth_uid()
  );

DROP POLICY IF EXISTS "invitations_insert" ON invitations;
CREATE POLICY "invitations_insert"
  ON invitations FOR INSERT
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

DROP POLICY IF EXISTS "invitations_update" ON invitations;
CREATE POLICY "invitations_update"
  ON invitations FOR UPDATE
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

DROP POLICY IF EXISTS "invitations_delete" ON invitations;
CREATE POLICY "invitations_delete"
  ON invitations FOR DELETE
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- =============================================================================
-- SECTION 5 — CATALOG (categories, courses, modules, lessons, lesson_resources)
-- =============================================================================

-- CATEGORIES --
DROP POLICY IF EXISTS "categories_select" ON categories;
CREATE POLICY "categories_select"
  ON categories FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "categories_write" ON categories;
CREATE POLICY "categories_write"
  ON categories FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- COURSES --
DROP POLICY IF EXISTS "courses_select_member" ON courses;
CREATE POLICY "courses_select_member"
  ON courses FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      is_member_of(academy_id)             -- any member can see all courses
      OR (is_published = true AND EXISTS ( -- or course is listed in marketplace academy
        SELECT 1 FROM academy_listings WHERE academy_id = courses.academy_id
      ))
    )
  );

DROP POLICY IF EXISTS "courses_insert" ON courses;
CREATE POLICY "courses_insert"
  ON courses FOR INSERT
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

DROP POLICY IF EXISTS "courses_update" ON courses;
CREATE POLICY "courses_update"
  ON courses FOR UPDATE
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

DROP POLICY IF EXISTS "courses_delete" ON courses;
CREATE POLICY "courses_delete"
  ON courses FOR DELETE
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- MODULES --
DROP POLICY IF EXISTS "modules_select" ON modules;
CREATE POLICY "modules_select"
  ON modules FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "modules_write" ON modules;
CREATE POLICY "modules_write"
  ON modules FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- LESSONS --
DROP POLICY IF EXISTS "lessons_select" ON lessons;
CREATE POLICY "lessons_select"
  ON lessons FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[])
      OR (is_published = true AND is_member_of(academy_id))
      OR is_free_preview = true   -- free preview visible to any member
    )
  );

DROP POLICY IF EXISTS "lessons_write" ON lessons;
CREATE POLICY "lessons_write"
  ON lessons FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- LESSON RESOURCES --
DROP POLICY IF EXISTS "lesson_resources_select" ON lesson_resources;
CREATE POLICY "lesson_resources_select"
  ON lesson_resources FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "lesson_resources_write" ON lesson_resources;
CREATE POLICY "lesson_resources_write"
  ON lesson_resources FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- =============================================================================
-- SECTION 6 — LEARNING & PROGRESS
-- =============================================================================

-- ENROLLMENTS --
DROP POLICY IF EXISTS "enrollments_select" ON enrollments;
CREATE POLICY "enrollments_select"
  ON enrollments FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[])
  );

DROP POLICY IF EXISTS "enrollments_insert" ON enrollments;
CREATE POLICY "enrollments_insert"
  ON enrollments FOR INSERT
  WITH CHECK (
    -- Students enroll themselves; admins enroll others
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "enrollments_update" ON enrollments;
CREATE POLICY "enrollments_update"
  ON enrollments FOR UPDATE
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- LESSON PROGRESS --
DROP POLICY IF EXISTS "lesson_progress_select" ON lesson_progress;
CREATE POLICY "lesson_progress_select"
  ON lesson_progress FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[])
  );

DROP POLICY IF EXISTS "lesson_progress_insert" ON lesson_progress;
CREATE POLICY "lesson_progress_insert"
  ON lesson_progress FOR INSERT
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

DROP POLICY IF EXISTS "lesson_progress_update" ON lesson_progress;
CREATE POLICY "lesson_progress_update"
  ON lesson_progress FOR UPDATE
  USING (user_id = auth_uid())
  WITH CHECK (user_id = auth_uid());

-- NOTES --
DROP POLICY IF EXISTS "notes_own" ON notes;
CREATE POLICY "notes_own"
  ON notes FOR ALL
  USING (user_id = auth_uid() AND is_member_of(academy_id))
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

-- BOOKMARKS --
DROP POLICY IF EXISTS "bookmarks_own" ON bookmarks;
CREATE POLICY "bookmarks_own"
  ON bookmarks FOR ALL
  USING (user_id = auth_uid() AND is_member_of(academy_id))
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

-- COMMENTS --
DROP POLICY IF EXISTS "comments_select" ON comments;
CREATE POLICY "comments_select"
  ON comments FOR SELECT
  USING (
    deleted_at IS NULL
    AND is_member_of(academy_id)
  );

DROP POLICY IF EXISTS "comments_insert" ON comments;
CREATE POLICY "comments_insert"
  ON comments FOR INSERT
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

-- Authors can edit/delete their own; admins can delete any
DROP POLICY IF EXISTS "comments_update" ON comments;
CREATE POLICY "comments_update"
  ON comments FOR UPDATE
  USING (user_id = auth_uid())
  WITH CHECK (user_id = auth_uid());

DROP POLICY IF EXISTS "comments_delete" ON comments;
CREATE POLICY "comments_delete"
  ON comments FOR DELETE
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

-- =============================================================================
-- SECTION 7 — ASSESSMENTS
-- =============================================================================

-- ASSIGNMENTS --
DROP POLICY IF EXISTS "assignments_select" ON assignments;
CREATE POLICY "assignments_select"
  ON assignments FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "assignments_write" ON assignments;
CREATE POLICY "assignments_write"
  ON assignments FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- SUBMISSIONS --
DROP POLICY IF EXISTS "submissions_select" ON submissions;
CREATE POLICY "submissions_select"
  ON submissions FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[])
  );

DROP POLICY IF EXISTS "submissions_insert" ON submissions;
CREATE POLICY "submissions_insert"
  ON submissions FOR INSERT
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

DROP POLICY IF EXISTS "submissions_update_grade" ON submissions;
CREATE POLICY "submissions_update_grade"
  ON submissions FOR UPDATE
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- QUIZZES --
DROP POLICY IF EXISTS "quizzes_select" ON quizzes;
CREATE POLICY "quizzes_select"
  ON quizzes FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "quizzes_write" ON quizzes;
CREATE POLICY "quizzes_write"
  ON quizzes FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- QUESTIONS --
DROP POLICY IF EXISTS "questions_select" ON questions;
CREATE POLICY "questions_select"
  ON questions FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "questions_write" ON questions;
CREATE POLICY "questions_write"
  ON questions FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- QUESTION OPTIONS --
-- Join through questions to get academy_id
DROP POLICY IF EXISTS "question_options_select" ON question_options;
CREATE POLICY "question_options_select"
  ON question_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questions q
      WHERE q.id = question_options.question_id
        AND is_member_of(q.academy_id)
    )
  );

DROP POLICY IF EXISTS "question_options_write" ON question_options;
CREATE POLICY "question_options_write"
  ON question_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM questions q
      WHERE q.id = question_options.question_id
        AND has_role(q.academy_id, ARRAY['owner','admin','instructor']::role_enum[])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM questions q
      WHERE q.id = question_options.question_id
        AND has_role(q.academy_id, ARRAY['owner','admin','instructor']::role_enum[])
    )
  );

-- ATTEMPTS --
DROP POLICY IF EXISTS "attempts_select" ON attempts;
CREATE POLICY "attempts_select"
  ON attempts FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[])
  );

DROP POLICY IF EXISTS "attempts_insert" ON attempts;
CREATE POLICY "attempts_insert"
  ON attempts FOR INSERT
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

DROP POLICY IF EXISTS "attempts_update" ON attempts;
CREATE POLICY "attempts_update"
  ON attempts FOR UPDATE
  USING (user_id = auth_uid() OR has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- ATTEMPT ANSWERS --
DROP POLICY IF EXISTS "attempt_answers_select" ON attempt_answers;
CREATE POLICY "attempt_answers_select"
  ON attempt_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM attempts a
      WHERE a.id = attempt_answers.attempt_id
        AND (a.user_id = auth_uid()
             OR has_role(a.academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
    )
  );

DROP POLICY IF EXISTS "attempt_answers_insert" ON attempt_answers;
CREATE POLICY "attempt_answers_insert"
  ON attempt_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM attempts a
      WHERE a.id = attempt_answers.attempt_id
        AND a.user_id = auth_uid()
    )
  );

-- AI REVIEWS --
DROP POLICY IF EXISTS "ai_reviews_select" ON ai_reviews;
CREATE POLICY "ai_reviews_select"
  ON ai_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = ai_reviews.submission_id
        AND (s.user_id = auth_uid()
             OR has_role(s.academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
    )
    OR EXISTS (
      SELECT 1 FROM attempts a
      WHERE a.id = ai_reviews.attempt_id
        AND (a.user_id = auth_uid()
             OR has_role(a.academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
    )
  );

DROP POLICY IF EXISTS "ai_reviews_insert_service" ON ai_reviews;
CREATE POLICY "ai_reviews_insert_service"
  ON ai_reviews FOR INSERT
  WITH CHECK (is_member_of(academy_id));

-- CERTIFICATES --
DROP POLICY IF EXISTS "certificates_select" ON certificates;
CREATE POLICY "certificates_select"
  ON certificates FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

-- Public verification endpoint (check by code) uses service role / API route
DROP POLICY IF EXISTS "certificates_insert_service" ON certificates;
CREATE POLICY "certificates_insert_service"
  ON certificates FOR INSERT
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- =============================================================================
-- SECTION 8 — COMMUNITY
-- =============================================================================

-- GROUPS --
DROP POLICY IF EXISTS "groups_select" ON groups;
CREATE POLICY "groups_select"
  ON groups FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      visibility = 'public' AND is_member_of(academy_id)
      OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
      OR EXISTS (
        SELECT 1 FROM group_members
        WHERE group_id = groups.id AND user_id = auth_uid()
      )
    )
  );

DROP POLICY IF EXISTS "groups_write" ON groups;
CREATE POLICY "groups_write"
  ON groups FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- GROUP MEMBERS --
DROP POLICY IF EXISTS "group_members_select" ON group_members;
CREATE POLICY "group_members_select"
  ON group_members FOR SELECT
  USING (
    user_id = auth_uid()
    OR EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_members.group_id
        AND has_role(g.academy_id, ARRAY['owner','admin']::role_enum[])
    )
  );

DROP POLICY IF EXISTS "group_members_insert" ON group_members;
CREATE POLICY "group_members_insert"
  ON group_members FOR INSERT
  WITH CHECK (
    user_id = auth_uid()
    OR EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_members.group_id
        AND has_role(g.academy_id, ARRAY['owner','admin']::role_enum[])
    )
  );

DROP POLICY IF EXISTS "group_members_delete" ON group_members;
CREATE POLICY "group_members_delete"
  ON group_members FOR DELETE
  USING (
    user_id = auth_uid()
    OR EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_members.group_id
        AND has_role(g.academy_id, ARRAY['owner','admin']::role_enum[])
    )
  );

-- HASHTAGS --
DROP POLICY IF EXISTS "hashtags_select" ON hashtags;
CREATE POLICY "hashtags_select"
  ON hashtags FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "hashtags_write" ON hashtags;
CREATE POLICY "hashtags_write"
  ON hashtags FOR ALL
  USING (is_member_of(academy_id))
  WITH CHECK (is_member_of(academy_id));

-- POSTS --
DROP POLICY IF EXISTS "posts_select" ON posts;
CREATE POLICY "posts_select"
  ON posts FOR SELECT
  USING (
    deleted_at IS NULL
    AND is_member_of(academy_id)
    AND (
      group_id IS NULL                    -- academy-wide post
      OR EXISTS (
        SELECT 1 FROM group_members
        WHERE group_id = posts.group_id AND user_id = auth_uid()
      )
      OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
    )
  );

DROP POLICY IF EXISTS "posts_insert" ON posts;
CREATE POLICY "posts_insert"
  ON posts FOR INSERT
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

DROP POLICY IF EXISTS "posts_update" ON posts;
CREATE POLICY "posts_update"
  ON posts FOR UPDATE
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  )
  WITH CHECK (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "posts_delete" ON posts;
CREATE POLICY "posts_delete"
  ON posts FOR DELETE
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

-- POST HASHTAGS --
DROP POLICY IF EXISTS "post_hashtags_select" ON post_hashtags;
CREATE POLICY "post_hashtags_select"
  ON post_hashtags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_hashtags.post_id AND is_member_of(p.academy_id)
    )
  );

DROP POLICY IF EXISTS "post_hashtags_write" ON post_hashtags;
CREATE POLICY "post_hashtags_write"
  ON post_hashtags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_hashtags.post_id AND p.user_id = auth_uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_hashtags.post_id AND p.user_id = auth_uid()
    )
  );

-- POST REACTIONS --
DROP POLICY IF EXISTS "post_reactions_select" ON post_reactions;
CREATE POLICY "post_reactions_select"
  ON post_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_reactions.post_id AND is_member_of(p.academy_id)
    )
  );

DROP POLICY IF EXISTS "post_reactions_own" ON post_reactions;
CREATE POLICY "post_reactions_own"
  ON post_reactions FOR ALL
  USING (user_id = auth_uid())
  WITH CHECK (user_id = auth_uid());

-- MENTIONS --
DROP POLICY IF EXISTS "mentions_select" ON mentions;
CREATE POLICY "mentions_select"
  ON mentions FOR SELECT
  USING (
    mentioned_user = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "mentions_insert" ON mentions;
CREATE POLICY "mentions_insert"
  ON mentions FOR INSERT
  WITH CHECK (created_by = auth_uid() AND is_member_of(academy_id));

-- CONVERSATIONS --
DROP POLICY IF EXISTS "conversations_select" ON conversations;
CREATE POLICY "conversations_select"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = conversations.id AND user_id = auth_uid()
    )
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "conversations_insert" ON conversations;
CREATE POLICY "conversations_insert"
  ON conversations FOR INSERT
  WITH CHECK (created_by = auth_uid() AND is_member_of(academy_id));

-- CONVERSATION MEMBERS --
DROP POLICY IF EXISTS "conv_members_select" ON conversation_members;
CREATE POLICY "conv_members_select"
  ON conversation_members FOR SELECT
  USING (
    user_id = auth_uid()
    OR EXISTS (
      SELECT 1 FROM conversation_members cm2
      WHERE cm2.conversation_id = conversation_members.conversation_id
        AND cm2.user_id = auth_uid()
    )
  );

DROP POLICY IF EXISTS "conv_members_insert" ON conversation_members;
CREATE POLICY "conv_members_insert"
  ON conversation_members FOR INSERT
  WITH CHECK (
    user_id = auth_uid()
    OR EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_members.conversation_id
        AND c.created_by = auth_uid()
    )
  );

-- MESSAGES --
DROP POLICY IF EXISTS "messages_select" ON messages;
CREATE POLICY "messages_select"
  ON messages FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth_uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert" ON messages;
CREATE POLICY "messages_insert"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth_uid()
    AND EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth_uid()
    )
  );

DROP POLICY IF EXISTS "messages_delete" ON messages;
CREATE POLICY "messages_delete"
  ON messages FOR DELETE
  USING (
    sender_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

-- =============================================================================
-- SECTION 9 — GAMIFICATION
-- =============================================================================

-- LEVELS (global, read-only for all authenticated users)
DROP POLICY IF EXISTS "levels_select" ON levels;
CREATE POLICY "levels_select"
  ON levels FOR SELECT
  USING (true);

-- Only service role / admin can mutate levels
DROP POLICY IF EXISTS "levels_write_admin" ON levels;
CREATE POLICY "levels_write_admin"
  ON levels FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- BADGES --
DROP POLICY IF EXISTS "badges_select" ON badges;
CREATE POLICY "badges_select"
  ON badges FOR SELECT
  USING (
    academy_id IS NULL              -- global badges visible to all authed users
    OR is_member_of(academy_id)
  );

DROP POLICY IF EXISTS "badges_write" ON badges;
CREATE POLICY "badges_write"
  ON badges FOR ALL
  USING (academy_id IS NOT NULL AND has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (academy_id IS NOT NULL AND has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- USER BADGES --
DROP POLICY IF EXISTS "user_badges_select" ON user_badges;
CREATE POLICY "user_badges_select"
  ON user_badges FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "user_badges_insert_service" ON user_badges;
CREATE POLICY "user_badges_insert_service"
  ON user_badges FOR INSERT
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]) OR auth.role() = 'service_role');

-- XP EVENTS (append-only ledger) --
DROP POLICY IF EXISTS "xp_events_select" ON xp_events;
CREATE POLICY "xp_events_select"
  ON xp_events FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "xp_events_insert_service" ON xp_events;
CREATE POLICY "xp_events_insert_service"
  ON xp_events FOR INSERT
  WITH CHECK (is_member_of(academy_id));

-- USER XP --
DROP POLICY IF EXISTS "user_xp_select" ON user_xp;
CREATE POLICY "user_xp_select"
  ON user_xp FOR SELECT
  USING (is_member_of(academy_id));

-- user_xp is written by the sync_user_xp() SECURITY DEFINER trigger — no direct insert policy needed
-- But allow the trigger to insert via service role
DROP POLICY IF EXISTS "user_xp_insert_trigger" ON user_xp;
CREATE POLICY "user_xp_insert_trigger"
  ON user_xp FOR ALL
  USING (auth.role() = 'service_role' OR user_id = auth_uid())
  WITH CHECK (auth.role() = 'service_role' OR user_id = auth_uid());

-- STREAKS --
DROP POLICY IF EXISTS "streaks_select" ON streaks;
CREATE POLICY "streaks_select"
  ON streaks FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "streaks_write" ON streaks;
CREATE POLICY "streaks_write"
  ON streaks FOR ALL
  USING (user_id = auth_uid() OR auth.role() = 'service_role')
  WITH CHECK (user_id = auth_uid() OR auth.role() = 'service_role');

-- CHALLENGES --
DROP POLICY IF EXISTS "challenges_select" ON challenges;
CREATE POLICY "challenges_select"
  ON challenges FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "challenges_write" ON challenges;
CREATE POLICY "challenges_write"
  ON challenges FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- CHALLENGE PROGRESS --
DROP POLICY IF EXISTS "challenge_progress_select" ON challenge_progress;
CREATE POLICY "challenge_progress_select"
  ON challenge_progress FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "challenge_progress_write" ON challenge_progress;
CREATE POLICY "challenge_progress_write"
  ON challenge_progress FOR ALL
  USING (user_id = auth_uid() OR auth.role() = 'service_role')
  WITH CHECK (user_id = auth_uid() OR auth.role() = 'service_role');

-- =============================================================================
-- SECTION 10 — MONETIZATION
-- =============================================================================

-- PLANS (read-only for all; mutations via service role / migration only)
DROP POLICY IF EXISTS "plans_select" ON plans;
CREATE POLICY "plans_select"
  ON plans FOR SELECT
  USING (is_public = true OR auth.role() = 'service_role');

-- SUBSCRIPTIONS --
DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
CREATE POLICY "subscriptions_select"
  ON subscriptions FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "subscriptions_write_service" ON subscriptions;
CREATE POLICY "subscriptions_write_service"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role' OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (auth.role() = 'service_role' OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- PAYMENTS --
DROP POLICY IF EXISTS "payments_select" ON payments;
CREATE POLICY "payments_select"
  ON payments FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "payments_insert_service" ON payments;
CREATE POLICY "payments_insert_service"
  ON payments FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

DROP POLICY IF EXISTS "payments_update_service" ON payments;
CREATE POLICY "payments_update_service"
  ON payments FOR UPDATE
  USING (auth.role() = 'service_role' OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- COUPONS --
DROP POLICY IF EXISTS "coupons_select" ON coupons;
CREATE POLICY "coupons_select"
  ON coupons FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "coupons_write" ON coupons;
CREATE POLICY "coupons_write"
  ON coupons FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- COUPON REDEMPTIONS --
DROP POLICY IF EXISTS "coupon_redemptions_select" ON coupon_redemptions;
CREATE POLICY "coupon_redemptions_select"
  ON coupon_redemptions FOR SELECT
  USING (
    user_id = auth_uid()
    OR EXISTS (
      SELECT 1 FROM coupons c
      WHERE c.id = coupon_redemptions.coupon_id
        AND has_role(c.academy_id, ARRAY['owner','admin']::role_enum[])
    )
  );

DROP POLICY IF EXISTS "coupon_redemptions_insert" ON coupon_redemptions;
CREATE POLICY "coupon_redemptions_insert"
  ON coupon_redemptions FOR INSERT
  WITH CHECK (user_id = auth_uid());

-- AFFILIATES --
DROP POLICY IF EXISTS "affiliates_select" ON affiliates;
CREATE POLICY "affiliates_select"
  ON affiliates FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "affiliates_write" ON affiliates;
CREATE POLICY "affiliates_write"
  ON affiliates FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- REFERRALS --
DROP POLICY IF EXISTS "referrals_select" ON referrals;
CREATE POLICY "referrals_select"
  ON referrals FOR SELECT
  USING (
    referred_user = auth_uid()
    OR EXISTS (
      SELECT 1 FROM affiliates a
      WHERE a.id = referrals.affiliate_id
        AND (a.user_id = auth_uid()
             OR has_role(a.academy_id, ARRAY['owner','admin']::role_enum[]))
    )
  );

-- PAYOUTS --
DROP POLICY IF EXISTS "payouts_select" ON payouts;
CREATE POLICY "payouts_select"
  ON payouts FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "payouts_write_admin" ON payouts;
CREATE POLICY "payouts_write_admin"
  ON payouts FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]) OR auth.role() = 'service_role')
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]) OR auth.role() = 'service_role');

-- =============================================================================
-- SECTION 11 — CRM / MARKETING / OPS
-- =============================================================================

-- CRM CONTACTS --
DROP POLICY IF EXISTS "crm_contacts_select" ON crm_contacts;
CREATE POLICY "crm_contacts_select"
  ON crm_contacts FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "crm_contacts_write" ON crm_contacts;
CREATE POLICY "crm_contacts_write"
  ON crm_contacts FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- EMAIL CAMPAIGNS --
DROP POLICY IF EXISTS "email_campaigns_write" ON email_campaigns;
CREATE POLICY "email_campaigns_write"
  ON email_campaigns FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- EMAIL SENDS --
DROP POLICY IF EXISTS "email_sends_admin" ON email_sends;
CREATE POLICY "email_sends_admin"
  ON email_sends FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM email_campaigns ec
      WHERE ec.id = email_sends.campaign_id
        AND has_role(ec.academy_id, ARRAY['owner','admin']::role_enum[])
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (auth.role() = 'service_role');

-- PUSH SUBSCRIPTIONS --
DROP POLICY IF EXISTS "push_subs_own" ON push_subscriptions;
CREATE POLICY "push_subs_own"
  ON push_subscriptions FOR ALL
  USING (user_id = auth_uid())
  WITH CHECK (user_id = auth_uid());

-- CALENDAR EVENTS --
DROP POLICY IF EXISTS "calendar_events_select" ON calendar_events;
CREATE POLICY "calendar_events_select"
  ON calendar_events FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "calendar_events_write" ON calendar_events;
CREATE POLICY "calendar_events_write"
  ON calendar_events FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- LIVE SESSIONS --
DROP POLICY IF EXISTS "live_sessions_select" ON live_sessions;
CREATE POLICY "live_sessions_select"
  ON live_sessions FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "live_sessions_write" ON live_sessions;
CREATE POLICY "live_sessions_write"
  ON live_sessions FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- AUTOMATIONS --
DROP POLICY IF EXISTS "automations_write" ON automations;
CREATE POLICY "automations_write"
  ON automations FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- AUTOMATION RUNS --
DROP POLICY IF EXISTS "automation_runs_select" ON automation_runs;
CREATE POLICY "automation_runs_select"
  ON automation_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automations a
      WHERE a.id = automation_runs.automation_id
        AND has_role(a.academy_id, ARRAY['owner','admin']::role_enum[])
    )
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "automation_runs_insert_service" ON automation_runs;
CREATE POLICY "automation_runs_insert_service"
  ON automation_runs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- WEBHOOKS --
DROP POLICY IF EXISTS "webhooks_write" ON webhooks;
CREATE POLICY "webhooks_write"
  ON webhooks FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- API KEYS --
DROP POLICY IF EXISTS "api_keys_select" ON api_keys;
CREATE POLICY "api_keys_select"
  ON api_keys FOR SELECT
  USING (
    created_by = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "api_keys_write" ON api_keys;
CREATE POLICY "api_keys_write"
  ON api_keys FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- =============================================================================
-- SECTION 12 — AI LAYER
-- =============================================================================

-- KNOWLEDGE BASES --
DROP POLICY IF EXISTS "knowledge_bases_select" ON knowledge_bases;
CREATE POLICY "knowledge_bases_select"
  ON knowledge_bases FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "knowledge_bases_write" ON knowledge_bases;
CREATE POLICY "knowledge_bases_write"
  ON knowledge_bases FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- KNOWLEDGE DOCUMENTS --
DROP POLICY IF EXISTS "knowledge_documents_select" ON knowledge_documents;
CREATE POLICY "knowledge_documents_select"
  ON knowledge_documents FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "knowledge_documents_write" ON knowledge_documents;
CREATE POLICY "knowledge_documents_write"
  ON knowledge_documents FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin','instructor']::role_enum[]));

-- AI MENTORS --
DROP POLICY IF EXISTS "ai_mentors_select" ON ai_mentors;
CREATE POLICY "ai_mentors_select"
  ON ai_mentors FOR SELECT
  USING (is_member_of(academy_id));

DROP POLICY IF EXISTS "ai_mentors_write" ON ai_mentors;
CREATE POLICY "ai_mentors_write"
  ON ai_mentors FOR ALL
  USING (has_role(academy_id, ARRAY['owner','admin']::role_enum[]))
  WITH CHECK (has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

-- AI CONVERSATIONS --
DROP POLICY IF EXISTS "ai_conversations_own" ON ai_conversations;
CREATE POLICY "ai_conversations_own"
  ON ai_conversations FOR SELECT
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
  );

DROP POLICY IF EXISTS "ai_conversations_insert" ON ai_conversations;
CREATE POLICY "ai_conversations_insert"
  ON ai_conversations FOR INSERT
  WITH CHECK (user_id = auth_uid() AND is_member_of(academy_id));

-- AI MESSAGES --
DROP POLICY IF EXISTS "ai_messages_select" ON ai_messages;
CREATE POLICY "ai_messages_select"
  ON ai_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations ac
      WHERE ac.id = ai_messages.conversation_id
        AND (ac.user_id = auth_uid()
             OR has_role(ac.academy_id, ARRAY['owner','admin']::role_enum[]))
    )
  );

DROP POLICY IF EXISTS "ai_messages_insert" ON ai_messages;
CREATE POLICY "ai_messages_insert"
  ON ai_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations ac
      WHERE ac.id = ai_messages.conversation_id
        AND ac.user_id = auth_uid()
    )
    OR auth.role() = 'service_role'  -- AI responses written by backend
  );

-- AI DAILY TASKS --
DROP POLICY IF EXISTS "ai_daily_tasks_own" ON ai_daily_tasks;
CREATE POLICY "ai_daily_tasks_own"
  ON ai_daily_tasks FOR ALL
  USING (
    user_id = auth_uid()
    OR has_role(academy_id, ARRAY['owner','admin']::role_enum[])
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    user_id = auth_uid()
    OR auth.role() = 'service_role'
  );

-- =============================================================================
-- SECTION 13 — MARKETPLACE
-- =============================================================================

-- ACADEMY LISTINGS — publicly readable by everyone (including anon)
DROP POLICY IF EXISTS "academy_listings_select_public" ON academy_listings;
CREATE POLICY "academy_listings_select_public"
  ON academy_listings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "academy_listings_write" ON academy_listings;
CREATE POLICY "academy_listings_write"
  ON academy_listings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM academies a
      WHERE a.id = academy_listings.academy_id AND a.owner_id = auth_uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM academies a
      WHERE a.id = academy_listings.academy_id AND a.owner_id = auth_uid()
    )
  );

-- ACADEMY FOLLOWS --
DROP POLICY IF EXISTS "academy_follows_select" ON academy_follows;
CREATE POLICY "academy_follows_select"
  ON academy_follows FOR SELECT
  USING (follower_id = auth_uid() OR has_role(academy_id, ARRAY['owner','admin']::role_enum[]));

DROP POLICY IF EXISTS "academy_follows_own" ON academy_follows;
CREATE POLICY "academy_follows_own"
  ON academy_follows FOR ALL
  USING (follower_id = auth_uid())
  WITH CHECK (follower_id = auth_uid());

-- =============================================================================
-- END OF 0002_rls.sql
-- =============================================================================
