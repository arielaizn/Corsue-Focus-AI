-- =============================================================================
-- 0011_revenue_rpc.sql — CourseFocus AI (idempotent)
-- Platform revenue aggregates computed IN POSTGRES so the PostgREST 1000-row
-- cap never truncates the sum. SECURITY INVOKER so RLS still applies — the
-- platform admin's payments_admin_all bypass lets the sum span all tenants,
-- while a non-admin caller only ever aggregates their own rows (no leak).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.platform_total_revenue()
RETURNS numeric
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(sum(amount), 0)
  FROM public.payments
  WHERE status = 'succeeded';
$$;

CREATE OR REPLACE FUNCTION public.platform_revenue_by_academy()
RETURNS TABLE (academy_id uuid, revenue numeric, currency text)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    p.academy_id,
    COALESCE(sum(p.amount), 0) AS revenue,
    (array_agg(p.currency ORDER BY p.created_at DESC))[1] AS currency
  FROM public.payments p
  WHERE p.status = 'succeeded'
  GROUP BY p.academy_id;
$$;

-- =============================================================================
-- END OF 0011_revenue_rpc.sql
-- =============================================================================
