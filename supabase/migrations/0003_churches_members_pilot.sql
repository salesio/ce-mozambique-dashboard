-- ============================================================================
-- Migration 0003 — Churches + Members Supabase pilot (Backend Phase 3)
-- ============================================================================
-- Safe additive changes only. No drops. No secrets.
-- Canonical shape also in database/schema.sql.
-- ============================================================================

-- Churches expansions
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS district_or_area text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS phone_secondary text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS parent_church_id uuid;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS information_status text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_churches_status ON public.churches (status);
CREATE INDEX IF NOT EXISTS idx_churches_province ON public.churches (province);
CREATE INDEX IF NOT EXISTS idx_churches_city ON public.churches (city);

-- Members expansions
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS church_name text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS cell_group_name text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS cell_name text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS department_id text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS department_name text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS entry_date date;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS notes text;

DO $$
BEGIN
  ALTER TABLE public.members ALTER COLUMN cell_group_id TYPE text USING cell_group_id::text;
  ALTER TABLE public.members ALTER COLUMN cell_id TYPE text USING cell_id::text;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_members_church_id ON public.members (church_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members (status);
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members (phone);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members (email);
CREATE INDEX IF NOT EXISTS idx_members_full_name ON public.members (full_name);

INSERT INTO public.schema_meta (key, value)
VALUES ('backend_phase', '3_churches_members_pilot')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

COMMENT ON TABLE public.churches IS
  'Phase 3 pilot: Churches / Igrejas — browser uses anon key + optional RLS.';
COMMENT ON TABLE public.members IS
  'Phase 3 pilot: Members / Membros — scoped by church_id in future RLS.';

-- ---------------------------------------------------------------------------
-- RLS notes (dev-safe; not forced)
-- ---------------------------------------------------------------------------
-- For local pilot without Auth, Supabase may allow anon via dashboard policies
-- or temporary open SELECT/INSERT for authenticated role only.
-- Production intent:
--   Super Admin / Main Pastor: all churches/members
--   Church Pastor: church_id = current_app_user.church_id
--   Department Head: department scope
--   Staff: limited
--
-- Example (COMMENTED — apply only after Auth + testing):
--
-- ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY churches_select_auth ON public.churches
--   FOR SELECT TO authenticated
--   USING (
--     public.has_module_permission('churches', 'view')
--     OR public.current_app_user_scope() = 'all'
--   );
--
-- CREATE POLICY members_select_auth ON public.members
--   FOR SELECT TO authenticated
--   USING (
--     public.has_module_permission('members', 'view')
--     OR church_id = (
--       SELECT church_id FROM public.users WHERE id = public.current_app_user_id()
--     )
--   );
