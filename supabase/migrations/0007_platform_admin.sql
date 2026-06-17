-- =============================================================================
-- 0007_platform_admin.sql — CourseFocus AI
-- Phase 0 · platform super-admin (idempotent, safe to re-run)
-- =============================================================================
-- Adds a platform-wide super-admin tier ABOVE the academy-scoped role_enum.
--   - profiles.is_platform_admin boolean (default false → existing rows unchanged)
--   - is_platform_admin() SECURITY DEFINER helper (reads profiles by PK ONLY, so
--     it cannot recurse into the academies/courses/listings policy cycle)
--   - flags the founding super-admin by email
--   - ADDITIVE "<table>_admin_all" policies (OR-combined with existing policies)
--     so the admin reads/manages every tenant WITHOUT a membership. Additive
--     (not rewriting the recursion-prone predicates) keeps 0004's fix intact.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_platform_admin boolean NOT NULL DEFAULT false;

-- explicit-uid overload
CREATE OR REPLACE FUNCTION public.is_platform_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND is_platform_admin = true
  );
$$;

-- no-arg overload (current user)
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT public.is_platform_admin(auth.uid());
$$;

-- Flag the founding super-admin by email (resolved through auth.users → no
-- hardcoded uid). 0004's handle_new_user + backfill guarantees the profile row
-- exists; if the user has never signed up this UPDATE affects 0 rows (no error).
UPDATE public.profiles p
SET is_platform_admin = true
FROM auth.users u
WHERE u.id = p.id AND lower(u.email) = lower('aa046114609@gmail.com');

-- ---------------------------------------------------------------------------
-- Additive admin-bypass policies (permissive → OR-combined per table).
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  t text;
  admin_tables text[] := ARRAY[
    'academies','courses','memberships','enrollments','payments',
    'posts','comments','profiles','subscriptions','plans','academy_listings'
  ];
BEGIN
  FOREACH t IN ARRAY admin_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_admin_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
      t || '_admin_all', t
    );
  END LOOP;
END $$;

-- =============================================================================
-- END OF 0007_platform_admin.sql
-- =============================================================================
