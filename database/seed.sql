-- ============================================================================
-- CE Mozambique — foundation seed (no real passwords / secrets)
-- ============================================================================
-- auth_user_id should be linked after Supabase Auth users are created.
-- Do not store passwords in this seed.
-- Demo app users live in the frontend data layer (USERS_SEED); SQL seed covers roles/settings.
-- ============================================================================

-- Roles
INSERT INTO public.roles (id, name, display_name, level, default_scope, is_system_role, status)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'super_admin', 'Super Admin', 100, 'all', true, 'Active'),
  ('11111111-1111-1111-1111-111111111102', 'main_pastor', 'Main Pastor', 90, 'all', true, 'Active'),
  ('11111111-1111-1111-1111-111111111103', 'finance_head', 'Finance Head', 70, 'all', true, 'Active'),
  ('11111111-1111-1111-1111-111111111104', 'hr_manager', 'HR Manager', 70, 'all', true, 'Active'),
  ('11111111-1111-1111-1111-111111111105', 'staff_member', 'Staff Member', 10, 'own', true, 'Active')
ON CONFLICT (name) DO NOTHING;

-- Sample HQ church (dev only) — full churches/members seed: supabase/seeds/churches_members_seed.sql
INSERT INTO public.churches (id, church_name, public_name, type, province, city, status)
VALUES (
  '22222222-2222-2222-2222-222222222201',
  'National HQ - Christ Embassy Mozambique',
  'National HQ',
  'HQ',
  'Maputo',
  'Maputo',
  'Active'
)
ON CONFLICT (id) DO NOTHING;

-- System settings defaults
INSERT INTO public.system_settings (key, value, value_type, module, is_system)
VALUES
  ('default_language', '"pt"'::jsonb, 'string', 'global', true),
  ('default_currency', '"MZN"'::jsonb, 'string', 'finance', true),
  ('timezone', '"Africa/Maputo"'::jsonb, 'string', 'global', true),
  ('public_site_enabled', 'true'::jsonb, 'boolean', 'public_site', false),
  ('enable_notifications', 'true'::jsonb, 'boolean', 'notifications', false),
  ('enable_audit_log', 'true'::jsonb, 'boolean', 'access_control', true),
  ('enable_reports_export', 'true'::jsonb, 'boolean', 'reports', false)
ON CONFLICT (key) DO NOTHING;

-- Super Admin broad view permission sample (module: finance)
INSERT INTO public.permissions (
  role_id, module, can_view, can_create, can_edit, can_delete,
  can_approve, can_verify, can_release_resources, can_export, can_manage_settings, scope
)
SELECT r.id, m.module, true, true, true, true, true, true, true, true, true, 'all'
FROM public.roles r
CROSS JOIN (VALUES
  ('finance'), ('accessControl'), ('settings'), ('staffHr'), ('churches'), ('members')
) AS m(module)
WHERE r.name = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.permissions p
    WHERE p.role_id = r.id AND p.module = m.module
  );
