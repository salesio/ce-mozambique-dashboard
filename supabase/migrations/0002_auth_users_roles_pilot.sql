-- ============================================================================
-- Migration 0002 — Auth + Users/Roles pilot (Backend Phase 2)
-- ============================================================================
-- Safe additive changes only. No secrets. No passwords.
-- Source of truth also reflected in database/schema.sql.
-- ============================================================================

-- Ensure auth linkage + lockout columns exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id uuid;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at timestamptz;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS failed_login_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Unique auth_user_id when present (ignore if constraint already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_auth_user_id_key'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_auth_user_id_key UNIQUE (auth_user_id);
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users (role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_role_id ON public.permissions (role_id);

COMMENT ON COLUMN public.users.auth_user_id IS
  'Supabase auth.users.id. NULL until linked. Do not store passwords here.';

INSERT INTO public.schema_meta (key, value)
VALUES ('backend_phase', '2_auth_users_roles_pilot')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- RLS helper stubs (full enablement in a later hardening pass — see database/rls.sql)
CREATE OR REPLACE FUNCTION public.current_auth_uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

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

-- Policies remain commented until Auth is tested end-to-end:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY users_select_own ON public.users FOR SELECT TO authenticated
--   USING (auth_user_id = auth.uid() OR public.has_module_permission('accessControl', 'view'));
