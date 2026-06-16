# CourseFocus AI — Supabase Schema

Target: Supabase Postgres 15+ (pgcrypto included; pgvector deferred).

---

## How to Apply

### Option 1 — Supabase SQL Editor (fastest for dev)

Open each file in the Supabase Dashboard SQL editor and run in order:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_seed.sql`

### Option 2 — Supabase CLI

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

All three files are idempotent (uses `CREATE TABLE IF NOT EXISTS`, `DO $$ ... EXCEPTION WHEN duplicate_object`, `DROP POLICY IF EXISTS`, `INSERT ... ON CONFLICT DO NOTHING`). Safe to re-run.

### Seed prerequisites

The seed file references two `auth.users` UUIDs that must exist before 0003 runs:

- `00000000-0000-0000-0000-000000000001` — demo-owner@coursefocus.ai
- `00000000-0000-0000-0000-000000000002` — demo-student@coursefocus.ai

Create them via Supabase Dashboard > Authentication > Users, or with:

```sql
-- Run in SQL editor (service role only)
SELECT supabase_admin.create_user('demo-owner@coursefocus.ai', 'ChangeMe123!');
SELECT supabase_admin.create_user('demo-student@coursefocus.ai', 'ChangeMe123!');
```

Then manually update their IDs to match the fixed UUIDs, or update the seed UUIDs to match the generated ones.

---

## ERD Overview — Domains and Tables

### A. Tenancy & Identity (4 tables)

```
auth.users (Supabase built-in)
  └── profiles          (1:1 with auth.users)
        └── memberships (user x academy x role)
        └── invitations

academies  (one row = one tenant)
  ├── memberships        (who belongs, what role)
  └── invitations        (pending invites by email)
```

### B. Catalog (5 tables)

```
academies
  └── categories
        └── courses  (type: free/one_time/subscription/vip/private/cohort)
              └── modules
                    └── lessons  (type: video/audio/pdf/ppt/image/text/embed/link)
                          └── lesson_resources
```

### C. Learning & Progress (6 tables)

```
courses + profiles --> enrollments
lessons + profiles --> lesson_progress
                  --> notes
                  --> bookmarks
                  --> comments  (polymorphic: lesson/post/assignment)
```

### D. Assessments (9 tables)

```
courses --> assignments --> submissions --> ai_reviews
        --> quizzes     --> questions   --> question_options
                        --> attempts   --> attempt_answers
courses --> certificates
```

### E. Community (10 tables)

```
academies --> groups --> group_members
          --> hashtags
          --> posts   --> post_hashtags
                      --> post_reactions
          --> mentions
          --> conversations --> conversation_members
                            --> messages
```

### F. Gamification (7 tables + 1 view)

```
levels            (global, 1..100 thresholds)
badges            (global or per-academy)
user_badges
xp_events         (append-only ledger)
user_xp           (rollup, updated by trigger)
streaks
challenges --> challenge_progress
leaderboard  (VIEW over user_xp — no separate table)
```

### G. Monetization (8 tables)

```
plans
subscriptions  (owner's SaaS subscription)
payments
coupons --> coupon_redemptions
affiliates --> referrals
payouts
```

### H. CRM / Marketing / Ops (9 tables)

```
crm_contacts
email_campaigns --> email_sends
push_subscriptions
calendar_events
live_sessions      (provider: zoom/google_meet/teams)
automations --> automation_runs
webhooks
api_keys
```

### I. AI Layer (6 tables)

```
knowledge_bases --> knowledge_documents  (TODO: + embedding vector(1536))
ai_mentors
ai_conversations --> ai_messages
ai_daily_tasks
```

### J. Marketplace (2 tables)

```
academy_listings   (opt-in public listing, readable by anon)
academy_follows
```

**Total: 66 tables + 1 view (leaderboard)**

---

## Table Count by Domain

| Domain | Tables |
|---|---|
| Tenancy & Identity | 4 |
| Catalog | 5 |
| Learning & Progress | 6 |
| Assessments | 9 |
| Community | 10 |
| Gamification | 7 + 1 view |
| Monetization | 8 |
| CRM / Marketing / Ops | 9 |
| AI Layer | 6 |
| Marketplace | 2 |
| **Total** | **66 tables + 1 view** |

---

## RLS Model

### Helper Functions (defined in 0002_rls.sql)

All are `SECURITY DEFINER`, `STABLE`, callable from any RLS policy:

| Function | Returns | Description |
|---|---|---|
| `auth_uid()` | uuid | Thin alias for `auth.uid()` |
| `is_member_of(academy_id)` | boolean | Caller has any membership in the academy |
| `has_role(academy_id, roles[])` | boolean | Caller holds one of the specified roles |
| `is_owner_of(academy_id)` | boolean | Caller is the academy owner |
| `is_enrolled_in(course_id)` | boolean | Caller has an active enrollment |

### Access Matrix

| Actor | Can read | Can write |
|---|---|---|
| Anonymous | `academy_listings` (public marketplace) only | Nothing |
| Any member | Their academy's catalog, community, gamification | Their own progress, posts, notes, messages |
| Student | Enrolled course content | Own progress, submissions, quiz attempts, posts |
| Instructor | All content in their academy | Courses, lessons, modules, assignments, quizzes they own |
| Admin | Everything in the academy | All content + CRM + automations |
| Owner | Everything | Everything + academy settings |
| Service role | Everything (bypasses RLS) | Everything (used by backend/edge functions) |

### Key Isolation Rule

Every tenant-scoped table carries `academy_id uuid references academies(id)`. Every RLS SELECT policy gates on `is_member_of(academy_id)` or `has_role(...)`, ensuring row-level cross-tenant leakage is impossible at the database layer regardless of application bugs.

---

## Key Design Decisions

**Multi-tenancy approach — discriminator column.** Every table carries `academy_id`. This is simpler than schema-per-tenant (no dynamic schema switching) and more manageable than row-level isolation via a separate tenant registry. Supabase's connection pooler works well with discriminator columns + RLS.

**UUIDs everywhere.** `gen_random_uuid()` (pgcrypto). Avoids sequential ID enumeration and works across distributed inserts.

**Postgres native enums.** 23 `DO $$ ... EXCEPTION WHEN duplicate_object` blocks make the enums idempotent. Using native enums rather than text+check gives compile-time validation and smaller storage; the cost of `ALTER TYPE ... ADD VALUE` for new variants is acceptable in this SaaS lifecycle.

**Leaderboard as a VIEW.** `leaderboard` is a plain view over `user_xp`. For academies with >10k students, materialize it with `CREATE MATERIALIZED VIEW leaderboard_mv AS ...` and refresh on a cron schedule (Supabase `pg_cron` or Edge Function). The `user_xp` rollup table (updated by an AFTER INSERT trigger on `xp_events`) keeps the underlying data fast.

**XP events as an append-only ledger.** `xp_events` is never updated or deleted — it is the audit log. `user_xp` is the fast-read rollup. The trigger `sync_user_xp()` keeps them in sync on every insert and also computes `current_level` by querying the `levels` table.

**Comments are polymorphic.** A single `comments` table with `entity_type` (lesson/post/assignment) + `entity_id` reduces table count and simplifies the "comment anywhere" feature. The trade-off is that FK integrity to the parent entity is enforced at the application layer, not the DB layer — acceptable for this pattern at this scale.

**Soft deletes.** Applied to: `academies`, `courses`, `lessons`, `groups`, `posts`, `comments`, `messages`. Hard deletes cascade from `academies` to prevent orphan data across all child tables.

**Deferred forward FKs.** Four FKs could not be declared inline (circular dependency order):
- `academies.plan_id → plans` — added via `ALTER TABLE` after `plans` is created
- `enrollments.payment_id → payments` — added after `payments`
- `enrollments.coupon_id → coupons` — added after `coupons`
- `enrollments.affiliate_id → affiliates` — added after `affiliates`

All four are added with `DO $$ ... IF NOT EXISTS` guards for idempotency.

---

## pgvector / Embeddings (TODO)

The `knowledge_documents` table has a `content_text` column and a `chunk_count` field, but no vector column yet. When ready:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE knowledge_documents ADD COLUMN IF NOT EXISTS embedding vector(1536);

CREATE INDEX ON knowledge_documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

Recommended: store chunks in a separate `knowledge_chunks` table (one row per ~512-token chunk) rather than a single embedding per document, to enable paragraph-level similarity search.

---

## Partitioning (Deferred)

`xp_events` and `ai_messages` are the highest-volume append tables. At significant scale (>100M rows), range-partition `xp_events` by `occurred_at` (monthly) and `ai_messages` by `created_at`. Deferred until actual volume warrants it — premature partitioning adds operational complexity in Supabase's managed environment.
