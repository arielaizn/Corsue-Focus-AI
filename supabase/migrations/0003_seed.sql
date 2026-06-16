-- =============================================================================
-- 0003_seed.sql — CourseFocus AI  |  Demo Seed Data (idempotent)
-- Uses fixed UUIDs throughout. Safe to re-run (INSERT ... ON CONFLICT DO NOTHING).
-- =============================================================================
-- NOTE: This seed does NOT insert into auth.users (Supabase Auth is managed
--       separately). Use Supabase Dashboard or a one-time SQL snippet to
--       create the auth user first, then this seed fills the app tables.
--
-- Demo owner auth.users UUID (create via Dashboard or auth hook):
--   '00000000-0000-0000-0000-000000000001'  →  demo-owner@coursefocus.ai
-- Demo student auth.users UUID:
--   '00000000-0000-0000-0000-000000000002'  →  demo-student@coursefocus.ai
-- =============================================================================

-- ---------------------------------------------------------------------------
-- LEVELS 1..100  (XP thresholds — simple quadratic curve)
-- Each level requires level^2 * 100 XP from zero.
-- ---------------------------------------------------------------------------
INSERT INTO levels (level_number, xp_required, title, badge_url)
VALUES
  (1,      0,      'Newcomer',       NULL),
  (2,      100,    'Explorer',       NULL),
  (3,      300,    'Learner',        NULL),
  (4,      600,    'Enthusiast',     NULL),
  (5,      1000,   'Practitioner',   NULL),
  (6,      1500,   'Achiever',       NULL),
  (7,      2100,   'Specialist',     NULL),
  (8,      2800,   'Proficient',     NULL),
  (9,      3600,   'Expert',         NULL),
  (10,     4500,   'Master',         NULL),
  (11,     5500,   'Sage',           NULL),
  (12,     6600,   'Scholar',        NULL),
  (13,     7800,   'Virtuoso',       NULL),
  (14,     9100,   'Champion',       NULL),
  (15,     10500,  'Maverick',       NULL),
  (16,     12000,  'Innovator',      NULL),
  (17,     13600,  'Visionary',      NULL),
  (18,     15300,  'Pioneer',        NULL),
  (19,     17100,  'Trailblazer',    NULL),
  (20,     19000,  'Luminary',       NULL),
  (21,     21000,  'Legend',         NULL),
  (22,     23100,  'Titan',          NULL),
  (23,     25300,  'Oracle',         NULL),
  (24,     27600,  'Architect',      NULL),
  (25,     30000,  'Grandmaster',    NULL),
  (26,     32500,  'Prodigy',        NULL),
  (27,     35100,  'Maestro',        NULL),
  (28,     37800,  'Virtuoso II',    NULL),
  (29,     40600,  'Savant',         NULL),
  (30,     43500,  'Mentor',         NULL),
  (31,     46500,  'Guide',          NULL),
  (32,     49600,  'Strategist',     NULL),
  (33,     52800,  'Catalyst',       NULL),
  (34,     56100,  'Dynamo',         NULL),
  (35,     59500,  'Vanguard',       NULL),
  (36,     63000,  'Sentinel',       NULL),
  (37,     66600,  'Curator',        NULL),
  (38,     70300,  'Philosopher',    NULL),
  (39,     74100,  'Theorist',       NULL),
  (40,     78000,  'Polymath',       NULL),
  (41,     82000,  'Luminary II',    NULL),
  (42,     86100,  'Alchemist',      NULL),
  (43,     90300,  'Conjurer',       NULL),
  (44,     94600,  'Wizard',         NULL),
  (45,     99000,  'Archmage',       NULL),
  (46,     103500, 'Sovereign',      NULL),
  (47,     108100, 'Overlord',       NULL),
  (48,     112800, 'Immortal',       NULL),
  (49,     117600, 'Transcendent',   NULL),
  (50,     122500, 'Demigod',        NULL),
  (51,     127500, 'Deity',          NULL),
  (52,     132600, 'Celestial',      NULL),
  (53,     137800, 'Astral',         NULL),
  (54,     143100, 'Cosmic',         NULL),
  (55,     148500, 'Nebular',        NULL),
  (56,     154000, 'Stellar',        NULL),
  (57,     159600, 'Nova',           NULL),
  (58,     165300, 'Supernova',      NULL),
  (59,     171100, 'Pulsar',         NULL),
  (60,     177000, 'Quasar',         NULL),
  (61,     183000, 'Singularity',    NULL),
  (62,     189100, 'Void Walker',    NULL),
  (63,     195300, 'Dark Matter',    NULL),
  (64,     201600, 'Event Horizon',  NULL),
  (65,     208000, 'Warp Drive',     NULL),
  (66,     214500, 'Light Year',     NULL),
  (67,     221100, 'Astronomer',     NULL),
  (68,     227800, 'Cosmologist',    NULL),
  (69,     234600, 'Astrophysicist', NULL),
  (70,     241500, 'Galaxy Maker',   NULL),
  (71,     248500, 'Universe',       NULL),
  (72,     255600, 'Multiverse',     NULL),
  (73,     262800, 'Omniscient',     NULL),
  (74,     270100, 'Omnipotent',     NULL),
  (75,     277500, 'Eternal',        NULL),
  (76,     285000, 'Infinite',       NULL),
  (77,     292600, 'Boundless',      NULL),
  (78,     300300, 'Absolute',       NULL),
  (79,     308100, 'Primordial',     NULL),
  (80,     316000, 'Origin',         NULL),
  (81,     324000, 'Genesis',        NULL),
  (82,     332100, 'Creator I',      NULL),
  (83,     340300, 'Creator II',     NULL),
  (84,     348600, 'Creator III',    NULL),
  (85,     357000, 'Ascendant',      NULL),
  (86,     365500, 'Apex',           NULL),
  (87,     374100, 'Summit',         NULL),
  (88,     382800, 'Pinnacle',       NULL),
  (89,     391600, 'Zenith',         NULL),
  (90,     400500, 'Acme',           NULL),
  (91,     409500, 'Paramount',      NULL),
  (92,     418600, 'Supreme',        NULL),
  (93,     427800, 'Ultimate',       NULL),
  (94,     437100, 'Final Form',     NULL),
  (95,     446500, 'Beyond',         NULL),
  (96,     456000, 'Transcended',    NULL),
  (97,     465600, 'Unbound',        NULL),
  (98,     475300, 'Limitless',      NULL),
  (99,     485100, 'Infinite II',    NULL),
  (100,    495000, 'Academy OS',     NULL)
ON CONFLICT (level_number) DO NOTHING;

-- ---------------------------------------------------------------------------
-- PLANS
-- ---------------------------------------------------------------------------
INSERT INTO plans (id, name, slug, price_monthly, price_annual, currency, features, max_academies, max_students, is_public)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Starter',    'starter',    0,     0,      'USD', '{"white_label":false,"ai_suite":false,"gamification":false,"api":false}',   1,    50,   true),
  ('a0000000-0000-0000-0000-000000000002', 'Pro',        'pro',        49,    470,    'USD', '{"white_label":true,"ai_suite":true,"gamification":true,"api":false}',     1,    NULL, true),
  ('a0000000-0000-0000-0000-000000000003', 'Scale',      'scale',      139,   1335,   'USD', '{"white_label":true,"ai_suite":true,"gamification":true,"api":true}',      10,   NULL, true),
  ('a0000000-0000-0000-0000-000000000004', 'Enterprise', 'enterprise', NULL,  NULL,   'USD', '{"white_label":true,"ai_suite":true,"gamification":true,"api":true,"sso":true}', NULL, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO PROFILES (matching auth.users UUIDs created separately)
-- ---------------------------------------------------------------------------
INSERT INTO profiles (id, display_name, avatar_url, bio, locale, is_public)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Demo Academy Owner',
    'https://api.dicebear.com/8.x/avataaars/svg?seed=owner',
    'Founder of the CourseFocus demo academy. AI educator and studio owner.',
    'he',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Demo Student',
    'https://api.dicebear.com/8.x/avataaars/svg?seed=student',
    'Lifelong learner exploring AI tools.',
    'he',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO ACADEMY
-- ---------------------------------------------------------------------------
INSERT INTO academies (
  id, owner_id, name, slug, logo_url, brand_colors,
  locale, currency, timezone, white_label, plan_id, description
)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'CourseFocus Demo Academy',
  'demo',
  'https://coursefocusai.com/logo.svg',
  '{"primary":"#7C3AED","secondary":"#C026D3","background":"#0B0F1A","accent":"#F59E0B"}',
  'he',
  'ILS',
  'Asia/Jerusalem',
  false,
  'a0000000-0000-0000-0000-000000000002',  -- Pro plan
  'The official CourseFocus AI demonstration academy — showcasing all 50 platform features.'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- MEMBERSHIPS
-- ---------------------------------------------------------------------------
INSERT INTO memberships (id, academy_id, user_id, role)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'owner'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'student'
  )
ON CONFLICT (academy_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
INSERT INTO categories (id, academy_id, name, slug, description, position)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'בינה מלאכותית', 'ai',          'קורסי AI ולמידת מכונה', 0),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'שיווק דיגיטלי', 'marketing',   'שיווק ומכירות דיגיטליות', 1),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'פיתוח',         'development', 'פיתוח תוכנה ועיצוב', 2)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- COURSES
-- ---------------------------------------------------------------------------
INSERT INTO courses (
  id, academy_id, category_id, instructor_id,
  title, slug, description, short_desc, cover_url,
  course_type, price, currency,
  drip_type, is_published, is_featured
)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'מהפכת ה-AI לעסקים',
    'ai-revolution',
    'קורס מקיף על אינטגרציה של בינה מלאכותית בעסקים קטנים ובינוניים. לומדים כיצד GPT, Claude, Gemini ועוד עושים מהפכה בפעילות העסקית.',
    'הקורס שיכניס את ה-AI לתוך העסק שלך.',
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
    'one_time',
    499,
    'ILS',
    'immediate',
    true,
    true
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'שיווק דיגיטלי עם AI',
    'digital-marketing-ai',
    'שיווק בדיגיטל בעידן ה-AI: יצירת תוכן, פרסום ממומן, ניתוח נתונים וצמיחה אורגנית — הכול עם עזרת AI.',
    'שיווק חכם יותר בפחות זמן.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    'subscription',
    149,
    'ILS',
    'immediate',
    true,
    false
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'מבוא לבינה מלאכותית',
    'intro-to-ai',
    'קורס פתיחה חינמי המסביר מהי בינה מלאכותית, כיצד היא עובדת, ומה ניתן לעשות איתה כיום.',
    'צעד ראשון בעולם ה-AI — בחינם.',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    'free',
    0,
    'ILS',
    'immediate',
    true,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- MODULES (for course 1: AI Revolution)
-- ---------------------------------------------------------------------------
INSERT INTO modules (id, academy_id, course_id, title, description, position)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'מודול 1 — יסודות ה-AI',            'מה זה AI ולמה זה חשוב לעסק שלך',          0),
  ('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'מודול 2 — כלים פרקטיים',           'ChatGPT, Claude, Gemini בפעולה',           1),
  ('f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'מודול 3 — אינטגרציה בעסק',         'Automations, CRM, ותהליכים חכמים',        2),
  -- For course 3: Intro to AI
  ('f0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'מה זו בינה מלאכותית?',             'הגדרה, היסטוריה, ומצב נוכחי',             0),
  ('f0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'מודלי שפה גדולים (LLM)',           'GPT, Claude, Gemini — איך הם עובדים',      1)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- LESSONS
-- ---------------------------------------------------------------------------
INSERT INTO lessons (
  id, academy_id, module_id, course_id,
  title, content_type, body, media_url, position,
  is_free_preview, is_published
)
VALUES
  -- Module 1, Course 1
  (
    'aa000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'ברוכים הבאים לקורס',
    'video',
    NULL,
    'https://storage.coursefocusai.com/demo/welcome.mp4',
    0, true, true
  ),
  (
    'aa000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'מה זה AI ולמה זה משנה?',
    'video',
    NULL,
    'https://storage.coursefocusai.com/demo/lesson-1-2.mp4',
    1, false, true
  ),
  (
    'aa000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'מפת הדרכים של הקורס',
    'text',
    '## מה נלמד?

בקורס זה נעבור על:
1. **יסודות הבינה המלאכותית** — הגדרות, היסטוריה, מצב נוכחי
2. **כלים פרקטיים** — ChatGPT, Claude, Gemini, Midjourney
3. **אינטגרציה עסקית** — כיצד לשלב AI בתהליכים קיימים
4. **מקרי בוחן** — עסקים ישראלים שמשתמשים ב-AI בהצלחה',
    NULL,
    2, false, true
  ),
  -- Module 2, Course 1
  (
    'aa000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'ChatGPT בעסק — המדריך המלא',
    'video',
    NULL,
    'https://storage.coursefocusai.com/demo/chatgpt-business.mp4',
    0, false, true
  ),
  (
    'aa000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'Claude ו-Gemini — השוואה מעשית',
    'video',
    NULL,
    'https://storage.coursefocusai.com/demo/claude-gemini.mp4',
    1, false, true
  ),
  -- Module 1, Course 3 (free intro)
  (
    'aa000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000004',
    'e0000000-0000-0000-0000-000000000003',
    'מהי בינה מלאכותית? — שיעור פתיחה',
    'video',
    NULL,
    'https://storage.coursefocusai.com/demo/intro-ai.mp4',
    0, true, true
  ),
  (
    'aa000000-0000-0000-0000-000000000007',
    'b0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000005',
    'e0000000-0000-0000-0000-000000000003',
    'כיצד עובד מודל שפה? (GPT, Claude)',
    'video',
    NULL,
    'https://storage.coursefocusai.com/demo/llm-explained.mp4',
    0, true, true
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO ENROLLMENT (student enrolled in course 3 — free intro)
-- ---------------------------------------------------------------------------
INSERT INTO enrollments (id, academy_id, course_id, user_id, status, enrolled_at)
VALUES (
  'bb000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'active',
  now()
)
ON CONFLICT (course_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO LESSON PROGRESS (student completed first lesson)
-- ---------------------------------------------------------------------------
INSERT INTO lesson_progress (id, academy_id, lesson_id, user_id, enrollment_id, status, watch_percent, completed_at)
VALUES (
  'cc000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'aa000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000002',
  'bb000000-0000-0000-0000-000000000001',
  'completed',
  100,
  now()
)
ON CONFLICT (lesson_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- BADGES
-- ---------------------------------------------------------------------------
INSERT INTO badges (id, academy_id, name, description, icon_url, criteria, rarity)
VALUES
  -- Global badges (academy_id = NULL)
  (
    'ba000000-0000-0000-0000-000000000001',
    NULL,
    'First Step',
    'Complete your very first lesson.',
    'https://coursefocusai.com/badges/first-step.svg',
    '{"type":"lesson_count","threshold":1}',
    'common'
  ),
  (
    'ba000000-0000-0000-0000-000000000002',
    NULL,
    'Week Streak',
    'Maintain a 7-day learning streak.',
    'https://coursefocusai.com/badges/streak-7.svg',
    '{"type":"streak","threshold":7}',
    'uncommon'
  ),
  (
    'ba000000-0000-0000-0000-000000000003',
    NULL,
    'Month Streak',
    'Maintain a 30-day learning streak.',
    'https://coursefocusai.com/badges/streak-30.svg',
    '{"type":"streak","threshold":30}',
    'rare'
  ),
  (
    'ba000000-0000-0000-0000-000000000004',
    NULL,
    'Course Completer',
    'Complete an entire course.',
    'https://coursefocusai.com/badges/course-complete.svg',
    '{"type":"course_completion","threshold":1}',
    'uncommon'
  ),
  (
    'ba000000-0000-0000-0000-000000000005',
    NULL,
    'Quiz Ace',
    'Score 100% on any quiz.',
    'https://coursefocusai.com/badges/quiz-ace.svg',
    '{"type":"quiz_score","threshold":100}',
    'rare'
  ),
  (
    'ba000000-0000-0000-0000-000000000006',
    NULL,
    'Community Starter',
    'Write your first community post.',
    'https://coursefocusai.com/badges/community.svg',
    '{"type":"post_count","threshold":1}',
    'common'
  ),
  (
    'ba000000-0000-0000-0000-000000000007',
    NULL,
    'Knowledge Seeker',
    'Complete 10 lessons.',
    'https://coursefocusai.com/badges/knowledge-seeker.svg',
    '{"type":"lesson_count","threshold":10}',
    'uncommon'
  ),
  (
    'ba000000-0000-0000-0000-000000000008',
    NULL,
    'XP Hunter',
    'Earn 1,000 XP.',
    'https://coursefocusai.com/badges/xp-hunter.svg',
    '{"type":"xp_total","threshold":1000}',
    'uncommon'
  ),
  (
    'ba000000-0000-0000-0000-000000000009',
    NULL,
    'Legend',
    'Reach Level 50.',
    'https://coursefocusai.com/badges/legend.svg',
    '{"type":"level","threshold":50}',
    'legendary'
  ),
  (
    'ba000000-0000-0000-0000-000000000010',
    NULL,
    'Academy OS Master',
    'Reach the ultimate Level 100.',
    'https://coursefocusai.com/badges/academy-os.svg',
    '{"type":"level","threshold":100}',
    'legendary'
  ),
  -- Academy-specific badge
  (
    'ba000000-0000-0000-0000-000000000011',
    'b0000000-0000-0000-0000-000000000001',
    'AI Pioneer',
    'First student to complete the AI Revolution course in this academy.',
    'https://coursefocusai.com/badges/ai-pioneer.svg',
    '{"type":"course_completion","course_id":"e0000000-0000-0000-0000-000000000001","first_only":true}',
    'epic'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO BADGE AWARD (student earned First Step)
-- ---------------------------------------------------------------------------
INSERT INTO user_badges (id, academy_id, user_id, badge_id)
VALUES (
  'ua000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'ba000000-0000-0000-0000-000000000001'
)
ON CONFLICT (academy_id, user_id, badge_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO XP EVENT + USER_XP ROLLUP
-- (We insert directly into user_xp since the trigger fires on xp_events insert
--  and the seed might run in a context where trigger is disabled.
--  Do both to be safe and idempotent.)
-- ---------------------------------------------------------------------------
INSERT INTO xp_events (id, academy_id, user_id, source, amount, note, occurred_at)
VALUES (
  'xe000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'lesson_complete',
  50,
  'Completed: מהי בינה מלאכותית? — שיעור פתיחה',
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_xp (academy_id, user_id, total_xp, current_level)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  50,
  1
)
ON CONFLICT (academy_id, user_id) DO UPDATE
  SET total_xp      = GREATEST(user_xp.total_xp, EXCLUDED.total_xp),
      current_level = EXCLUDED.current_level,
      updated_at    = now();

-- ---------------------------------------------------------------------------
-- DEMO STREAK
-- ---------------------------------------------------------------------------
INSERT INTO streaks (academy_id, user_id, current_streak, longest_streak, last_activity)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  1,
  1,
  CURRENT_DATE
)
ON CONFLICT (academy_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO QUIZ (attached to lesson 2 of Course 1)
-- ---------------------------------------------------------------------------
INSERT INTO quizzes (id, academy_id, course_id, lesson_id, title, pass_score, ai_generated)
VALUES (
  'qz000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  'aa000000-0000-0000-0000-000000000002',
  'בוחן — מה זה AI?',
  70,
  false
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, academy_id, quiz_id, question_type, body, explanation, points, position)
VALUES
  (
    'qq000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'qz000000-0000-0000-0000-000000000001',
    'multiple_choice',
    'מה ראשי התיבות של AI?',
    'AI = Artificial Intelligence = בינה מלאכותית.',
    1, 0
  ),
  (
    'qq000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'qz000000-0000-0000-0000-000000000001',
    'true_false',
    'ChatGPT הוא דוגמה למודל שפה גדול (LLM).',
    'נכון. ChatGPT מבוסס על GPT-4, שהוא Large Language Model.',
    1, 1
  ),
  (
    'qq000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'qz000000-0000-0000-0000-000000000001',
    'multiple_choice',
    'איזה מהמודלים הבאים אינו מודל AI של Google?',
    'Claude הוא של Anthropic, לא Google.',
    1, 2
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, body, is_correct, position)
VALUES
  -- Q1 options
  ('qo000000-0000-0000-0000-000000000001', 'qq000000-0000-0000-0000-000000000001', 'Artificial Intelligence',    true,  0),
  ('qo000000-0000-0000-0000-000000000002', 'qq000000-0000-0000-0000-000000000001', 'Automated Integration',      false, 1),
  ('qo000000-0000-0000-0000-000000000003', 'qq000000-0000-0000-0000-000000000001', 'Advanced Interface',         false, 2),
  ('qo000000-0000-0000-0000-000000000004', 'qq000000-0000-0000-0000-000000000001', 'Applied Innovation',         false, 3),
  -- Q2 options (true/false)
  ('qo000000-0000-0000-0000-000000000005', 'qq000000-0000-0000-0000-000000000002', 'נכון',                       true,  0),
  ('qo000000-0000-0000-0000-000000000006', 'qq000000-0000-0000-0000-000000000002', 'לא נכון',                    false, 1),
  -- Q3 options
  ('qo000000-0000-0000-0000-000000000007', 'qq000000-0000-0000-0000-000000000003', 'Gemini',                     false, 0),
  ('qo000000-0000-0000-0000-000000000008', 'qq000000-0000-0000-0000-000000000003', 'Bard',                       false, 1),
  ('qo000000-0000-0000-0000-000000000009', 'qq000000-0000-0000-0000-000000000003', 'Claude',                     true,  2),
  ('qo000000-0000-0000-0000-000000000010', 'qq000000-0000-0000-0000-000000000003', 'NotebookLM',                 false, 3)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO COMMUNITY GROUP
-- ---------------------------------------------------------------------------
INSERT INTO groups (id, academy_id, name, slug, description, visibility, created_by)
VALUES (
  'gr000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'בית AI',
  'ai-home',
  'הקהילה הראשית של לומדי AI באקדמיה',
  'public',
  '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO group_members (group_id, user_id, role)
VALUES
  ('gr000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('gr000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member')
ON CONFLICT (group_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO COMMUNITY POST
-- ---------------------------------------------------------------------------
INSERT INTO posts (id, academy_id, user_id, group_id, title, body, is_announcement)
VALUES (
  'po000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'gr000000-0000-0000-0000-000000000001',
  'ברוכים הבאים לאקדמיית ה-AI!',
  E'שלום וברוכים הבאים! 🎓\n\nאנחנו שמחים שהצטרפתם לאקדמיה. כאן תמצאו:\n- קורסים מתקדמים בבינה מלאכותית\n- קהילה תומכת ופעילה\n- AI אישי שמלווה אתכם לאורך כל הדרך\n\nהתחילו עם הקורס "מבוא לבינה מלאכותית" — חינם לחלוטין!',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- MARKETPLACE LISTING
-- ---------------------------------------------------------------------------
INSERT INTO academy_listings (id, academy_id, tagline, categories, language, student_count, is_featured)
VALUES (
  'ml000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'The AI-powered academy that runs itself — built on CourseFocus AI.',
  ARRAY['ai','technology','business'],
  'he',
  1,
  true
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEMO AI MENTOR
-- ---------------------------------------------------------------------------
INSERT INTO ai_mentors (id, academy_id, name, persona, model, is_active)
VALUES (
  'am000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Maya — AI Learning Coach',
  'You are Maya, a warm and encouraging AI learning coach for the CourseFocus Demo Academy. You specialize in AI for business, speak Hebrew fluently, and always respond with practical, actionable advice. You are patient, clear, and never condescending.',
  'gpt',
  true
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- END OF 0003_seed.sql
-- =============================================================================
