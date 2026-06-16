-- =============================================================================
-- 0001_init.sql — CourseFocus AI  |  Supabase Postgres 15+
-- Extensions · Enums · Helper functions · All tables · Indexes · Triggers
-- =============================================================================
-- Idempotency: uses CREATE TABLE IF NOT EXISTS + CREATE TYPE ... IF NOT EXISTS
-- (Postgres 14+ supports IF NOT EXISTS on CREATE TYPE).
-- Run via: Supabase SQL editor  OR  `supabase db push`
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- GIN trigram indexes for search
-- NOTE: pgvector (vector similarity for AI embeddings) is deferred.
--       Enable with:  CREATE EXTENSION IF NOT EXISTS vector;
--       Then add:     embedding vector(1536) to knowledge_documents.

-- ---------------------------------------------------------------------------
-- UPDATED-AT TRIGGER (shared, applied per table below)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Macro to attach the trigger — call after each CREATE TABLE
-- (Can't use a loop here; just inline the trigger per table.)

-- =============================================================================
-- SECTION A — ENUMS
-- =============================================================================

-- Membership / access roles within an academy
DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('owner','admin','instructor','student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Course access / pricing model
DO $$ BEGIN
  CREATE TYPE course_type_enum AS ENUM ('free','one_time','subscription','vip','private','cohort');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Course unlock strategy
DO $$ BEGIN
  CREATE TYPE drip_type_enum AS ENUM ('immediate','date','progress','xp');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Lesson content format
DO $$ BEGIN
  CREATE TYPE content_type_enum AS ENUM ('video','audio','pdf','ppt','image','text','embed','link');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Enrollment state
DO $$ BEGIN
  CREATE TYPE enrollment_status_enum AS ENUM ('active','paused','expired','completed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Lesson progress state
DO $$ BEGIN
  CREATE TYPE lesson_status_enum AS ENUM ('not_started','in_progress','completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Quiz question types
DO $$ BEGIN
  CREATE TYPE question_type_enum AS ENUM ('multiple_choice','open','true_false','match','fill_blank');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Submission content types
DO $$ BEGIN
  CREATE TYPE submission_type_enum AS ENUM ('text','file','video','url');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Community group visibility
DO $$ BEGIN
  CREATE TYPE group_visibility_enum AS ENUM ('public','private','vip');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Post/comment parent entity type (polymorphic)
DO $$ BEGIN
  CREATE TYPE comment_entity_enum AS ENUM ('lesson','post','assignment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- XP event sources
DO $$ BEGIN
  CREATE TYPE xp_source_enum AS ENUM (
    'lesson_complete','quiz_pass','assignment_submit','streak_bonus',
    'challenge_complete','badge_earned','post_created','comment_created',
    'login_daily','referral','manual_grant'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Payment providers
DO $$ BEGIN
  CREATE TYPE payment_provider_enum AS ENUM ('sumit','stripe','paypal','tranzila','pelecard','manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Payment status
DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending','succeeded','failed','refunded','disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subscription billing interval
DO $$ BEGIN
  CREATE TYPE billing_interval_enum AS ENUM ('monthly','annual','lifetime');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subscription state
DO $$ BEGIN
  CREATE TYPE subscription_status_enum AS ENUM ('trialing','active','past_due','canceled','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Live session providers
DO $$ BEGIN
  CREATE TYPE live_provider_enum AS ENUM ('zoom','google_meet','teams','custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AI model identifiers
DO $$ BEGIN
  CREATE TYPE ai_model_enum AS ENUM ('gpt','claude','gemini','grok','deepseek','mistral','llama','auto');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Knowledge document source types
DO $$ BEGIN
  CREATE TYPE kb_source_enum AS ENUM ('pdf','word','ppt','url','text','video_transcript');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Automation trigger/action category
DO $$ BEGIN
  CREATE TYPE automation_status_enum AS ENUM ('active','paused','draft');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Email campaign status
DO $$ BEGIN
  CREATE TYPE campaign_status_enum AS ENUM ('draft','scheduled','sending','sent','canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Invitation status
DO $$ BEGIN
  CREATE TYPE invitation_status_enum AS ENUM ('pending','accepted','expired','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Message attachment type
DO $$ BEGIN
  CREATE TYPE attachment_type_enum AS ENUM ('image','file','audio','video','link');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- SECTION B — TENANCY & IDENTITY
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    text NOT NULL DEFAULT '',
  avatar_url      text,
  bio             text,
  locale          text NOT NULL DEFAULT 'he',
  timezone        text NOT NULL DEFAULT 'Asia/Jerusalem',
  -- public profile fields
  website_url     text,
  social_links    jsonb NOT NULL DEFAULT '{}',  -- {twitter, linkedin, instagram, ...}
  is_public       boolean NOT NULL DEFAULT true,
  -- timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- academies  (one row = one tenant)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academies (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,          -- subdomain / URL slug
  custom_domain     text UNIQUE,                  -- e.g. academy.mysite.com
  logo_url          text,
  favicon_url       text,
  brand_colors      jsonb NOT NULL DEFAULT '{}',  -- {primary, secondary, background, accent}
  locale            text NOT NULL DEFAULT 'he',
  currency          text NOT NULL DEFAULT 'ILS',
  timezone          text NOT NULL DEFAULT 'Asia/Jerusalem',
  white_label       boolean NOT NULL DEFAULT false,
  hide_platform_badge boolean NOT NULL DEFAULT false,
  -- metadata / SEO
  description       text,
  meta_title        text,
  meta_description  text,
  cover_url         text,
  -- plan limits (denormalized for fast checks)
  plan_id           uuid,                          -- FK added after plans table
  max_students      integer,                       -- null = unlimited
  -- soft delete
  deleted_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_academies_updated_at
  BEFORE UPDATE ON academies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_academies_owner    ON academies(owner_id);
CREATE INDEX IF NOT EXISTS idx_academies_slug     ON academies(slug);
CREATE INDEX IF NOT EXISTS idx_academies_domain   ON academies(custom_domain) WHERE custom_domain IS NOT NULL;

-- ---------------------------------------------------------------------------
-- memberships  (user × academy × role)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memberships (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  role        role_enum NOT NULL DEFAULT 'student',
  joined_at   timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, user_id)
);

CREATE TRIGGER trg_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_memberships_academy  ON memberships(academy_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user     ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role     ON memberships(academy_id, role);

-- ---------------------------------------------------------------------------
-- invitations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  invited_by  uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  email       text NOT NULL,
  role        role_enum NOT NULL DEFAULT 'student',
  token       text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status      invitation_status_enum NOT NULL DEFAULT 'pending',
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_invitations_academy ON invitations(academy_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email   ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token   ON invitations(token);

-- =============================================================================
-- SECTION C — CATALOG
-- =============================================================================

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text,
  icon_url    text,
  position    integer NOT NULL DEFAULT 0,
  parent_id   uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, slug)
);

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_categories_academy ON categories(academy_id);

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  category_id     uuid REFERENCES categories(id) ON DELETE SET NULL,
  instructor_id   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title           text NOT NULL,
  slug            text NOT NULL,
  description     text,
  short_desc      text,
  cover_url       text,
  trailer_url     text,
  -- pricing & access
  course_type     course_type_enum NOT NULL DEFAULT 'free',
  price           numeric(12,2),
  currency        text NOT NULL DEFAULT 'ILS',
  -- drip / access rules
  drip_type       drip_type_enum NOT NULL DEFAULT 'immediate',
  drip_config     jsonb NOT NULL DEFAULT '{}',   -- {days_after_enroll, unlock_date, ...}
  -- AI metadata
  ai_syllabus     jsonb,                          -- AI-generated course outline
  ai_generated    boolean NOT NULL DEFAULT false,
  -- status & visibility
  is_published    boolean NOT NULL DEFAULT false,
  is_featured     boolean NOT NULL DEFAULT false,
  -- stats (denormalized for performance)
  enrolled_count  integer NOT NULL DEFAULT 0,
  rating_avg      numeric(3,2),
  rating_count    integer NOT NULL DEFAULT 0,
  -- soft delete
  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, slug)
);

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_courses_academy      ON courses(academy_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug         ON courses(academy_id, slug);
CREATE INDEX IF NOT EXISTS idx_courses_type         ON courses(academy_id, course_type);
CREATE INDEX IF NOT EXISTS idx_courses_published    ON courses(academy_id, is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_courses_instructor   ON courses(instructor_id);
-- Full-text search on title
CREATE INDEX IF NOT EXISTS idx_courses_title_trgm   ON courses USING GIN (title gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- modules  (ordered sections within a course)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  course_id   uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  position    integer NOT NULL DEFAULT 0,
  is_free_preview boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id, position);

-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lessons (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  module_id       uuid NOT NULL REFERENCES modules(id)   ON DELETE CASCADE,
  course_id       uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  title           text NOT NULL,
  content_type    content_type_enum NOT NULL DEFAULT 'text',
  -- content body (markdown / rich-text for text; metadata jsonb for others)
  body            text,
  media_url       text,                           -- video/audio/pdf/etc CDN URL
  media_meta      jsonb NOT NULL DEFAULT '{}',    -- duration_s, size_bytes, chapters[], captions_url, transcript_url, thumbnail_url
  -- AI-generated lesson aids
  ai_summary      text,
  ai_transcript   text,
  -- ordering & access
  position        integer NOT NULL DEFAULT 0,
  is_free_preview boolean NOT NULL DEFAULT false,
  is_published    boolean NOT NULL DEFAULT false,
  -- soft delete
  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_lessons_module    ON lessons(module_id, position);
CREATE INDEX IF NOT EXISTS idx_lessons_course    ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_academy   ON lessons(academy_id);

-- ---------------------------------------------------------------------------
-- lesson_resources  (downloadable attachments per lesson)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lesson_resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  lesson_id   uuid NOT NULL REFERENCES lessons(id)   ON DELETE CASCADE,
  title       text NOT NULL,
  url         text NOT NULL,
  mime_type   text,
  size_bytes  bigint,
  position    integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_lesson_resources_updated_at
  BEFORE UPDATE ON lesson_resources
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON lesson_resources(lesson_id);

-- =============================================================================
-- SECTION D — LEARNING & PROGRESS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  course_id       uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  status          enrollment_status_enum NOT NULL DEFAULT 'active',
  -- access dates
  enrolled_at     timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz,
  completed_at    timestamptz,
  -- source tracking
  coupon_id       uuid,                           -- FK added after coupons table
  payment_id      uuid,                           -- FK added after payments table
  affiliate_id    uuid,                           -- FK added after affiliates table
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, user_id)
);

CREATE TRIGGER trg_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_enrollments_course   ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user     ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_academy  ON enrollments(academy_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status   ON enrollments(status);

-- ---------------------------------------------------------------------------
-- lesson_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  lesson_id       uuid NOT NULL REFERENCES lessons(id)   ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  enrollment_id   uuid REFERENCES enrollments(id)        ON DELETE SET NULL,
  status          lesson_status_enum NOT NULL DEFAULT 'not_started',
  -- video playback tracking
  last_position_s integer NOT NULL DEFAULT 0,    -- seconds
  watch_percent   numeric(5,2) NOT NULL DEFAULT 0,
  completed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, user_id)
);

CREATE TRIGGER trg_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user     ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson   ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_academy  ON lesson_progress(academy_id);

-- ---------------------------------------------------------------------------
-- notes  (personal per user per lesson)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  lesson_id   uuid NOT NULL REFERENCES lessons(id)   ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  body        text NOT NULL,
  position_s  integer,                            -- video timestamp if applicable
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_notes_lesson_user ON notes(lesson_id, user_id);

-- ---------------------------------------------------------------------------
-- bookmarks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookmarks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  lesson_id   uuid NOT NULL REFERENCES lessons(id)   ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  position_s  integer,
  label       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, user_id, position_s)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user    ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_lesson  ON bookmarks(lesson_id);

-- ---------------------------------------------------------------------------
-- comments  (polymorphic: lesson / post / assignment)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  entity_type     comment_entity_enum NOT NULL,
  entity_id       uuid NOT NULL,
  parent_id       uuid REFERENCES comments(id)  ON DELETE CASCADE,  -- threaded
  body            text NOT NULL,
  is_pinned       boolean NOT NULL DEFAULT false,
  -- moderation
  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_comments_entity   ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_user     ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent   ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_academy  ON comments(academy_id);

-- =============================================================================
-- SECTION E — ASSESSMENTS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  course_id       uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  lesson_id       uuid REFERENCES lessons(id)            ON DELETE SET NULL,
  title           text NOT NULL,
  description     text,
  instructions    text,
  due_days        integer,                        -- days after enrollment
  max_score       integer NOT NULL DEFAULT 100,
  ai_review_enabled boolean NOT NULL DEFAULT false,
  allowed_types   submission_type_enum[] NOT NULL DEFAULT '{text,file}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);

-- ---------------------------------------------------------------------------
-- submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)   ON DELETE CASCADE,
  assignment_id   uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
  submission_type submission_type_enum NOT NULL DEFAULT 'text',
  body            text,
  file_url        text,
  video_url       text,
  -- grading
  score           integer,
  max_score       integer,
  feedback        text,
  graded_by       uuid REFERENCES profiles(id) ON DELETE SET NULL,
  graded_at       timestamptz,
  -- ai review reference
  ai_review_id    uuid,                           -- FK after ai_reviews
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user       ON submissions(user_id);

-- ---------------------------------------------------------------------------
-- quizzes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quizzes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id          uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  course_id           uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  lesson_id           uuid REFERENCES lessons(id)            ON DELETE SET NULL,
  title               text NOT NULL,
  description         text,
  time_limit_s        integer,                    -- null = untimed
  pass_score          integer NOT NULL DEFAULT 70,-- percent
  max_attempts        integer,                    -- null = unlimited
  shuffle_questions   boolean NOT NULL DEFAULT false,
  ai_generated        boolean NOT NULL DEFAULT false,
  show_correct_after  boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);

-- ---------------------------------------------------------------------------
-- questions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  quiz_id         uuid NOT NULL REFERENCES quizzes(id)   ON DELETE CASCADE,
  question_type   question_type_enum NOT NULL DEFAULT 'multiple_choice',
  body            text NOT NULL,
  explanation     text,                           -- shown after answer
  points          integer NOT NULL DEFAULT 1,
  position        integer NOT NULL DEFAULT 0,
  media_url       text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id, position);

-- ---------------------------------------------------------------------------
-- question_options  (for multiple_choice / true_false / match)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_options (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  body        text NOT NULL,
  is_correct  boolean NOT NULL DEFAULT false,
  position    integer NOT NULL DEFAULT 0,
  match_key   text,                               -- for match-type questions
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options(question_id);

-- ---------------------------------------------------------------------------
-- attempts  (one per quiz per user per sitting)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  quiz_id     uuid NOT NULL REFERENCES quizzes(id)   ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  score       integer,
  max_score   integer,
  passed      boolean,
  started_at  timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_attempts_updated_at
  BEFORE UPDATE ON attempts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_attempts_quiz ON attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);

-- ---------------------------------------------------------------------------
-- attempt_answers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempt_answers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      uuid NOT NULL REFERENCES attempts(id)          ON DELETE CASCADE,
  question_id     uuid NOT NULL REFERENCES questions(id)         ON DELETE CASCADE,
  selected_option uuid REFERENCES question_options(id)           ON DELETE SET NULL,
  open_answer     text,
  is_correct      boolean,
  points_earned   integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt  ON attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_question ON attempt_answers(question_id);

-- ---------------------------------------------------------------------------
-- ai_reviews
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)   ON DELETE CASCADE,
  submission_id   uuid REFERENCES submissions(id)          ON DELETE CASCADE,
  attempt_id      uuid REFERENCES attempts(id)             ON DELETE CASCADE,
  model           ai_model_enum NOT NULL DEFAULT 'gpt',
  grade           integer,                        -- 0–100
  feedback        text NOT NULL,
  strengths       jsonb,                          -- []string
  improvements    jsonb,                          -- []string
  token_count     integer,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_reviews_submission ON ai_reviews(submission_id) WHERE submission_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_reviews_attempt    ON ai_reviews(attempt_id)    WHERE attempt_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id        uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  course_id         uuid NOT NULL REFERENCES courses(id)   ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  enrollment_id     uuid REFERENCES enrollments(id)        ON DELETE SET NULL,
  verification_code text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  qr_url            text,
  pdf_url           text,
  template_id       uuid,                         -- extensible: custom templates
  issued_at         timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_certificates_user          ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course        ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification  ON certificates(verification_code);

-- =============================================================================
-- SECTION F — COMMUNITY
-- =============================================================================

-- ---------------------------------------------------------------------------
-- groups
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS groups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  name            text NOT NULL,
  slug            text NOT NULL,
  description     text,
  cover_url       text,
  visibility      group_visibility_enum NOT NULL DEFAULT 'public',
  created_by      uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  member_count    integer NOT NULL DEFAULT 0,
  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, slug)
);

CREATE TRIGGER trg_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_groups_academy ON groups(academy_id);

-- ---------------------------------------------------------------------------
-- group_members
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS group_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    uuid NOT NULL REFERENCES groups(id)    ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'member',    -- member / moderator / admin
  joined_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user  ON group_members(user_id);

-- ---------------------------------------------------------------------------
-- hashtags
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hashtags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  tag         text NOT NULL,
  post_count  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, tag)
);

CREATE INDEX IF NOT EXISTS idx_hashtags_academy ON hashtags(academy_id);

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  group_id        uuid REFERENCES groups(id)             ON DELETE CASCADE,
  title           text,
  body            text NOT NULL,
  media_urls      text[] NOT NULL DEFAULT '{}',
  is_pinned       boolean NOT NULL DEFAULT false,
  is_announcement boolean NOT NULL DEFAULT false,
  like_count      integer NOT NULL DEFAULT 0,
  comment_count   integer NOT NULL DEFAULT 0,
  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_posts_academy    ON posts(academy_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user       ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_group      ON posts(group_id) WHERE group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_body_trgm  ON posts USING GIN (body gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- post_hashtags  (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id     uuid NOT NULL REFERENCES posts(id)    ON DELETE CASCADE,
  hashtag_id  uuid NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

-- ---------------------------------------------------------------------------
-- post_reactions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_reactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid NOT NULL REFERENCES posts(id)    ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji       text NOT NULL DEFAULT 'like',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON post_reactions(post_id);

-- ---------------------------------------------------------------------------
-- mentions  (user mentions in posts / comments)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mentions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  mentioned_user  uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  entity_type     comment_entity_enum NOT NULL,
  entity_id       uuid NOT NULL,
  created_by      uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentions_user   ON mentions(mentioned_user);
CREATE INDEX IF NOT EXISTS idx_mentions_entity ON mentions(entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- conversations  (1:1 or group chat threads)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  title       text,                               -- null for 1:1
  is_group    boolean NOT NULL DEFAULT false,
  created_by  uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_conversations_academy ON conversations(academy_id);

-- ---------------------------------------------------------------------------
-- conversation_members
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)      ON DELETE CASCADE,
  joined_at       timestamptz NOT NULL DEFAULT now(),
  last_read_at    timestamptz,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_members_user ON conversation_members(user_id);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id          uuid NOT NULL REFERENCES academies(id)       ON DELETE CASCADE,
  conversation_id     uuid NOT NULL REFERENCES conversations(id)   ON DELETE CASCADE,
  sender_id           uuid NOT NULL REFERENCES profiles(id)        ON DELETE CASCADE,
  body                text,
  -- rich media refs
  attachment_type     attachment_type_enum,
  attachment_url      text,
  -- voice/video call references (stored after session ends)
  call_session_id     text,
  -- metadata
  reply_to_id         uuid REFERENCES messages(id) ON DELETE SET NULL,
  deleted_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender       ON messages(sender_id);

-- =============================================================================
-- SECTION G — GAMIFICATION
-- =============================================================================

-- ---------------------------------------------------------------------------
-- levels  (global, not per-academy — academy can reference these thresholds)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS levels (
  level_number    integer PRIMARY KEY,
  xp_required     integer NOT NULL,
  title           text NOT NULL,
  badge_url       text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- badges
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS badges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid REFERENCES academies(id) ON DELETE CASCADE,  -- null = global badge
  name        text NOT NULL,
  description text,
  icon_url    text NOT NULL,
  criteria    jsonb NOT NULL DEFAULT '{}',        -- {type, threshold, course_id, ...}
  rarity      text NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_badges_updated_at
  BEFORE UPDATE ON badges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_badges_academy ON badges(academy_id);

-- ---------------------------------------------------------------------------
-- user_badges
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_badges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  badge_id    uuid NOT NULL REFERENCES badges(id)    ON DELETE CASCADE,
  earned_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user    ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_academy ON user_badges(academy_id);

-- ---------------------------------------------------------------------------
-- xp_events  (append-only ledger)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS xp_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  source      xp_source_enum NOT NULL,
  amount      integer NOT NULL,
  entity_id   uuid,                               -- lesson_id, challenge_id, etc.
  note        text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

-- Append-only: no UPDATE trigger needed
CREATE INDEX IF NOT EXISTS idx_xp_events_user       ON xp_events(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_events_academy    ON xp_events(academy_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_occurred   ON xp_events(occurred_at DESC);

-- ---------------------------------------------------------------------------
-- user_xp  (materialized rollup per academy per user — updated by trigger)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_xp (
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  total_xp        integer NOT NULL DEFAULT 0,
  current_level   integer NOT NULL DEFAULT 1,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (academy_id, user_id)
);

-- Trigger to keep user_xp in sync when an xp_event is inserted
CREATE OR REPLACE FUNCTION sync_user_xp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO user_xp (academy_id, user_id, total_xp, current_level, updated_at)
  VALUES (
    NEW.academy_id,
    NEW.user_id,
    NEW.amount,
    1,
    now()
  )
  ON CONFLICT (academy_id, user_id) DO UPDATE
    SET total_xp      = user_xp.total_xp + NEW.amount,
        current_level = COALESCE(
          (SELECT level_number FROM levels
           WHERE xp_required <= user_xp.total_xp + NEW.amount
           ORDER BY xp_required DESC LIMIT 1), 1),
        updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_xp_events_sync
  AFTER INSERT ON xp_events
  FOR EACH ROW EXECUTE FUNCTION sync_user_xp();

CREATE INDEX IF NOT EXISTS idx_user_xp_academy_xp ON user_xp(academy_id, total_xp DESC);

-- ---------------------------------------------------------------------------
-- streaks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS streaks (
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  current_streak  integer NOT NULL DEFAULT 0,
  longest_streak  integer NOT NULL DEFAULT 0,
  last_activity   date,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (academy_id, user_id)
);

-- ---------------------------------------------------------------------------
-- challenges
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  criteria        jsonb NOT NULL DEFAULT '{}',    -- {type, target_count, course_id, ...}
  xp_reward       integer NOT NULL DEFAULT 0,
  badge_id        uuid REFERENCES badges(id) ON DELETE SET NULL,
  starts_at       timestamptz,
  ends_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_challenges_academy ON challenges(academy_id);

-- ---------------------------------------------------------------------------
-- challenge_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenge_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  academy_id    uuid NOT NULL REFERENCES academies(id)  ON DELETE CASCADE,
  progress      integer NOT NULL DEFAULT 0,
  completed     boolean NOT NULL DEFAULT false,
  completed_at  timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, user_id)
);

CREATE TRIGGER trg_challenge_progress_updated_at
  BEFORE UPDATE ON challenge_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- leaderboard  (VIEW — computed at query time from user_xp)
-- A materialized view or a scheduled refresh is the recommended upgrade path
-- for academies with >10k students.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  ux.academy_id,
  ux.user_id,
  p.display_name,
  p.avatar_url,
  ux.total_xp,
  ux.current_level,
  RANK() OVER (PARTITION BY ux.academy_id ORDER BY ux.total_xp DESC) AS rank_all_time
FROM user_xp ux
JOIN profiles p ON p.id = ux.user_id;

-- =============================================================================
-- SECTION H — MONETIZATION
-- =============================================================================

-- ---------------------------------------------------------------------------
-- plans  (SaaS plans for academy owners)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,                  -- Starter / Pro / Scale / Enterprise
  slug            text NOT NULL UNIQUE,
  price_monthly   numeric(10,2),
  price_annual    numeric(10,2),
  currency        text NOT NULL DEFAULT 'USD',
  features        jsonb NOT NULL DEFAULT '{}',
  max_academies   integer,
  max_students    integer,
  is_public       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Now add the FK from academies to plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_academies_plan'
  ) THEN
    ALTER TABLE academies ADD CONSTRAINT fk_academies_plan
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- subscriptions  (academy owners' SaaS subscription)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id          uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  plan_id             uuid NOT NULL REFERENCES plans(id)     ON DELETE RESTRICT,
  user_id             uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  interval            billing_interval_enum NOT NULL DEFAULT 'monthly',
  status              subscription_status_enum NOT NULL DEFAULT 'active',
  provider            payment_provider_enum NOT NULL DEFAULT 'stripe',
  provider_sub_id     text,                       -- Stripe subscription ID, etc.
  current_period_start timestamptz,
  current_period_end   timestamptz,
  trial_ends_at       timestamptz,
  canceled_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscriptions_academy ON subscriptions(academy_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user    ON subscriptions(user_id);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  enrollment_id   uuid REFERENCES enrollments(id)        ON DELETE SET NULL,
  subscription_id uuid REFERENCES subscriptions(id)      ON DELETE SET NULL,
  amount          numeric(12,2) NOT NULL,
  currency        text NOT NULL DEFAULT 'ILS',
  provider        payment_provider_enum NOT NULL,
  provider_txn_id text,
  status          payment_status_enum NOT NULL DEFAULT 'pending',
  metadata        jsonb NOT NULL DEFAULT '{}',
  paid_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_payments_academy      ON payments(academy_id);
CREATE INDEX IF NOT EXISTS idx_payments_user         ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status       ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_txn ON payments(provider_txn_id) WHERE provider_txn_id IS NOT NULL;

-- Now add the FK from enrollments to payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_enrollments_payment'
  ) THEN
    ALTER TABLE enrollments ADD CONSTRAINT fk_enrollments_payment
      FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- coupons
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  code            text NOT NULL,
  description     text,
  discount_type   text NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent','fixed')),
  discount_value  numeric(10,2) NOT NULL,
  max_uses        integer,
  uses_count      integer NOT NULL DEFAULT 0,
  valid_from      timestamptz,
  valid_until     timestamptz,
  course_id       uuid REFERENCES courses(id) ON DELETE CASCADE,  -- null = any course
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, code)
);

CREATE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_coupons_academy ON coupons(academy_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code    ON coupons(academy_id, code);

-- Now add FK from enrollments to coupons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_enrollments_coupon'
  ) THEN
    ALTER TABLE enrollments ADD CONSTRAINT fk_enrollments_coupon
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- coupon_redemptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id   uuid NOT NULL REFERENCES coupons(id)      ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)     ON DELETE CASCADE,
  payment_id  uuid REFERENCES payments(id)              ON DELETE SET NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON coupon_redemptions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user   ON coupon_redemptions(user_id);

-- ---------------------------------------------------------------------------
-- affiliates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  referral_code   text NOT NULL,
  commission_rate numeric(5,2) NOT NULL DEFAULT 10,      -- percent
  total_earned    numeric(12,2) NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, referral_code)
);

CREATE TRIGGER trg_affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Now add FK from enrollments to affiliates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_enrollments_affiliate'
  ) THEN
    ALTER TABLE enrollments ADD CONSTRAINT fk_enrollments_affiliate
      FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- referrals
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS referrals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_user   uuid NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  payment_id      uuid REFERENCES payments(id)            ON DELETE SET NULL,
  commission      numeric(12,2),
  paid_out        boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON referrals(affiliate_id);

-- ---------------------------------------------------------------------------
-- payouts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payouts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)  ON DELETE CASCADE,
  affiliate_id    uuid REFERENCES affiliates(id)          ON DELETE SET NULL,
  user_id         uuid NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  amount          numeric(12,2) NOT NULL,
  currency        text NOT NULL DEFAULT 'ILS',
  provider        payment_provider_enum NOT NULL DEFAULT 'manual',
  provider_ref    text,
  paid_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payouts_academy ON payouts(academy_id);
CREATE INDEX IF NOT EXISTS idx_payouts_user    ON payouts(user_id);

-- =============================================================================
-- SECTION I — CRM / MARKETING / OPS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- crm_contacts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crm_contacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES profiles(id)           ON DELETE SET NULL,
  email           text NOT NULL,
  first_name      text,
  last_name       text,
  phone           text,
  tags            text[] NOT NULL DEFAULT '{}',
  custom_fields   jsonb NOT NULL DEFAULT '{}',
  source          text,                           -- lead source
  subscribed      boolean NOT NULL DEFAULT true,
  unsubscribed_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, email)
);

CREATE TRIGGER trg_crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_crm_contacts_academy ON crm_contacts(academy_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email   ON crm_contacts(email);

-- ---------------------------------------------------------------------------
-- email_campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  subject         text NOT NULL,
  preview_text    text,
  body_html       text NOT NULL,
  status          campaign_status_enum NOT NULL DEFAULT 'draft',
  audience_filter jsonb NOT NULL DEFAULT '{}',    -- segment criteria
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  open_count      integer NOT NULL DEFAULT 0,
  click_count     integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_email_campaigns_academy ON email_campaigns(academy_id);

-- ---------------------------------------------------------------------------
-- email_sends  (per-recipient tracking)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_sends (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     uuid NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  contact_id      uuid NOT NULL REFERENCES crm_contacts(id)    ON DELETE CASCADE,
  sent_at         timestamptz,
  opened_at       timestamptz,
  clicked_at      timestamptz,
  bounced         boolean NOT NULL DEFAULT false,
  unsubscribed    boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_contact  ON email_sends(contact_id);

-- ---------------------------------------------------------------------------
-- push_subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  endpoint    text NOT NULL,
  p256dh      text,
  auth_key    text,
  device_type text,                               -- web / ios / android
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user    ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_academy ON push_subscriptions(academy_id);

-- ---------------------------------------------------------------------------
-- calendar_events
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  title           text NOT NULL,
  description     text,
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  location        text,
  is_recurring    boolean NOT NULL DEFAULT false,
  recurrence_rule text,                           -- iCal RRULE
  attendee_filter jsonb NOT NULL DEFAULT '{}',    -- who can see/join
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_event_dates CHECK (ends_at >= starts_at)
);

CREATE TRIGGER trg_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_calendar_events_academy ON calendar_events(academy_id, starts_at);

-- ---------------------------------------------------------------------------
-- live_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)    ON DELETE CASCADE,
  course_id       uuid REFERENCES courses(id)               ON DELETE SET NULL,
  calendar_event_id uuid REFERENCES calendar_events(id)    ON DELETE SET NULL,
  created_by      uuid NOT NULL REFERENCES profiles(id)     ON DELETE RESTRICT,
  title           text NOT NULL,
  provider        live_provider_enum NOT NULL DEFAULT 'zoom',
  provider_url    text,                           -- meeting join link
  provider_id     text,                           -- external meeting ID
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz,
  recording_url   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_live_sessions_updated_at
  BEFORE UPDATE ON live_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_live_sessions_academy ON live_sessions(academy_id, starts_at);

-- ---------------------------------------------------------------------------
-- automations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS automations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  name            text NOT NULL,
  description     text,
  trigger         jsonb NOT NULL DEFAULT '{}',    -- {event, conditions}
  actions         jsonb NOT NULL DEFAULT '[]',    -- [{type, config}]
  status          automation_status_enum NOT NULL DEFAULT 'draft',
  run_count       integer NOT NULL DEFAULT 0,
  last_run_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_automations_updated_at
  BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_automations_academy ON automations(academy_id);

-- ---------------------------------------------------------------------------
-- automation_runs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS automation_runs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id   uuid NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  trigger_payload jsonb NOT NULL DEFAULT '{}',
  result          jsonb NOT NULL DEFAULT '{}',
  success         boolean NOT NULL DEFAULT false,
  error_message   text,
  started_at      timestamptz NOT NULL DEFAULT now(),
  finished_at     timestamptz
);

CREATE INDEX IF NOT EXISTS idx_automation_runs_automation ON automation_runs(automation_id, started_at DESC);

-- ---------------------------------------------------------------------------
-- webhooks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webhooks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  url             text NOT NULL,
  events          text[] NOT NULL DEFAULT '{}',   -- ['enrollment.created', ...]
  secret          text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_active       boolean NOT NULL DEFAULT true,
  last_triggered  timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_webhooks_academy ON webhooks(academy_id);

-- ---------------------------------------------------------------------------
-- api_keys
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  created_by  uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  name        text NOT NULL,
  key_hash    text NOT NULL UNIQUE,               -- store SHA-256 of the key, never plaintext
  prefix      text NOT NULL,                      -- first 8 chars shown in UI (e.g. "cf_live_")
  scopes      text[] NOT NULL DEFAULT '{}',       -- ['courses:read', 'enrollments:write', ...]
  last_used   timestamptz,
  expires_at  timestamptz,
  revoked_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_academy   ON api_keys(academy_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash  ON api_keys(key_hash);

-- =============================================================================
-- SECTION J — AI LAYER
-- =============================================================================

-- ---------------------------------------------------------------------------
-- knowledge_bases
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  created_by  uuid NOT NULL REFERENCES profiles(id)  ON DELETE RESTRICT,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_knowledge_bases_updated_at
  BEFORE UPDATE ON knowledge_bases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_knowledge_bases_academy ON knowledge_bases(academy_id);

-- ---------------------------------------------------------------------------
-- knowledge_documents
-- TODO: After enabling `CREATE EXTENSION IF NOT EXISTS vector`,
--       add:  embedding vector(1536)
--       and:  CREATE INDEX ON knowledge_documents USING ivfflat (embedding vector_cosine_ops)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)         ON DELETE CASCADE,
  knowledge_base_id uuid NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  source          kb_source_enum NOT NULL DEFAULT 'pdf',
  title           text NOT NULL,
  file_url        text,
  web_url         text,
  content_text    text,                           -- extracted plain text
  chunk_count     integer NOT NULL DEFAULT 0,     -- number of embedding chunks
  status          text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','ready','error')),
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_knowledge_documents_updated_at
  BEFORE UPDATE ON knowledge_documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_knowledge_docs_kb      ON knowledge_documents(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_academy ON knowledge_documents(academy_id);

-- ---------------------------------------------------------------------------
-- ai_mentors  (named AI personas per academy, feature #49)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_mentors (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)   ON DELETE CASCADE,
  knowledge_base_id uuid REFERENCES knowledge_bases(id)    ON DELETE SET NULL,
  name            text NOT NULL,
  avatar_url      text,
  persona         text,                           -- system prompt / personality description
  model           ai_model_enum NOT NULL DEFAULT 'gpt',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_ai_mentors_updated_at
  BEFORE UPDATE ON ai_mentors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ai_mentors_academy ON ai_mentors(academy_id);

-- ---------------------------------------------------------------------------
-- ai_conversations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id)  ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  mentor_id       uuid REFERENCES ai_mentors(id)          ON DELETE SET NULL,
  context_type    text,                           -- 'lesson', 'course', 'global', 'assignment'
  context_id      uuid,                           -- lesson_id / course_id etc.
  title           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user    ON ai_conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_academy ON ai_conversations(academy_id);

-- ---------------------------------------------------------------------------
-- ai_messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_messages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id     uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role                text NOT NULL CHECK (role IN ('user','assistant','system')),
  content             text NOT NULL,
  model               ai_model_enum,              -- null for user messages
  token_count         integer,
  audio_url           text,                       -- Voice Coach (#48) output
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- ai_daily_tasks  (AI-generated personalized daily plan, feature #25)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_daily_tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  task_date   date NOT NULL,
  tasks       jsonb NOT NULL DEFAULT '[]',        -- [{title, type, entity_id, completed}]
  completed   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, user_id, task_date)
);

CREATE TRIGGER trg_ai_daily_tasks_updated_at
  BEFORE UPDATE ON ai_daily_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ai_daily_tasks_user ON ai_daily_tasks(user_id, task_date DESC);

-- =============================================================================
-- SECTION K — MARKETPLACE
-- =============================================================================

-- ---------------------------------------------------------------------------
-- academy_listings  (academies that opt-in to the public marketplace)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academy_listings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id      uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE UNIQUE,
  tagline         text,
  cover_url       text,
  categories      text[] NOT NULL DEFAULT '{}',
  language        text NOT NULL DEFAULT 'he',
  student_count   integer NOT NULL DEFAULT 0,
  rating_avg      numeric(3,2),
  rating_count    integer NOT NULL DEFAULT 0,
  is_featured     boolean NOT NULL DEFAULT false,
  listed_at       timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_academy_listings_updated_at
  BEFORE UPDATE ON academy_listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_academy_listings_featured  ON academy_listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_academy_listings_rating    ON academy_listings(rating_avg DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- academy_follows
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academy_follows (
  follower_id uuid NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  academy_id  uuid NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  followed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, academy_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_follows_academy ON academy_follows(academy_id);
CREATE INDEX IF NOT EXISTS idx_academy_follows_user    ON academy_follows(follower_id);

-- =============================================================================
-- END OF 0001_init.sql
-- =============================================================================
