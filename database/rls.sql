-- ============================================================================
-- CE Mozambique — RLS plan (Backend Phase 1 + Phase 2 Auth pilot)
-- ============================================================================
-- Policies are prepared but NOT aggressively enabled for local Docker yet.
-- Real auth + JWT claims must exist before strict RLS goes live.
-- See docs/backend/RLS_SECURITY_PLAN.md and docs/backend/SUPABASE_AUTH_PILOT_PLAN.md
--
-- Resolution chain:
--   auth.uid() / current_auth_uid()
--   → public.users.auth_user_id
--   → role_id
--   → permissions
--   → has_module_permission(module, action)
-- ============================================================================

-- Example enable (commented until Auth pilot is tested):
-- ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

/*
PRINCIPLES:

1. Super Admin / system roles: broad access via permissions table.
2. Main Pastor: national/all churches when role scope = all.
3. Church Pastor: church_id = app_user.church_id.
4. Department Head: department_id match + church scope.
5. Staff Member: own rows (created_by / staff_id / recipient_user_id).
6. Finance: only Finance Head / Finance Officer / Super Admin for verify/export.
7. Sensitive modules (counseling, salaries, documents): explicit can_view + is_sensitive.
8. Audit logs: insert allowed for authenticated app users; select restricted to admin roles.
9. Public forms (giving, cell report): constrained insert policies or Edge Functions later.
10. Service role key ONLY on server — never in browser.

Example policy sketches (do not apply until auth_user_id is wired in production):

-- Users can read own profile
-- CREATE POLICY users_select_self ON public.users
--   FOR SELECT TO authenticated
--   USING (auth_user_id = auth.uid() OR public.has_module_permission('accessControl', 'view'));

-- Finance select by permission
-- CREATE POLICY finance_select ON public.finance_records
--   FOR SELECT TO authenticated
--   USING (public.has_module_permission('finance', 'view'));
*/

-- ---------------------------------------------------------------------------
-- Helper functions (Phase 2 — safe stubs; used by future policies)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_auth_uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

COMMENT ON FUNCTION public.current_auth_uid() IS
  'JWT sub when using Supabase Auth; null without request JWT.';

CREATE OR REPLACE FUNCTION public.current_app_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id
  FROM public.users u
  WHERE u.auth_user_id = public.current_auth_uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_app_role_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.role_id
  FROM public.users u
  WHERE u.id = public.current_app_user_id()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_app_user_scope()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(r.default_scope, 'own')
  FROM public.users u
  LEFT JOIN public.roles r ON r.id = u.role_id
  WHERE u.id = public.current_app_user_id()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_module_permission(module_name text, action_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rid uuid;
  allowed boolean := false;
BEGIN
  rid := public.current_app_role_id();
  IF rid IS NULL THEN
    RETURN false;
  END IF;
  SELECT CASE lower(coalesce(action_name, 'view'))
    WHEN 'view' THEN p.can_view
    WHEN 'create' THEN p.can_create
    WHEN 'edit' THEN p.can_edit
    WHEN 'delete' THEN p.can_delete
    WHEN 'approve' THEN p.can_approve
    WHEN 'verify' THEN p.can_verify
    WHEN 'release' THEN p.can_release_resources
    WHEN 'export' THEN p.can_export
    WHEN 'manage_settings' THEN p.can_manage_settings
    ELSE false
  END
  INTO allowed
  FROM public.permissions p
  WHERE p.role_id = rid
    AND lower(p.module) = lower(module_name)
  LIMIT 1;
  RETURN coalesce(allowed, false);
END;
$$;

COMMENT ON FUNCTION public.has_module_permission(text, text) IS
  'Phase 2 helper: permissions for current JWT-linked app user. Not enforced until RLS enabled.';
