-- ============================================================================
-- CE Mozambique Operations Dashboard — Backend Phase 1 schema (foundation)
-- ============================================================================
-- Applied on first Docker Postgres boot via docker-entrypoint-initdb.d.
-- Supabase cloud: see supabase/migrations/ and SUPABASE_SETUP.md.
--
-- Browser NEVER connects here directly.
-- Frontend uses VITE_DATA_SOURCE=mock|local until pilots migrate to supabase/api.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.schema_meta (
  key   text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.schema_meta (key, value)
VALUES
  ('app', 'ce_dashboard'),
  ('env', 'docker_dev'),
  ('backend_phase', '1_foundation')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- ---------------------------------------------------------------------------
-- CORE: roles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  display_name    text,
  level           integer DEFAULT 0,
  default_scope   text DEFAULT 'church',
  is_system_role  boolean NOT NULL DEFAULT false,
  status          text NOT NULL DEFAULT 'Active',
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid,
  updated_by      uuid
);

DROP TRIGGER IF EXISTS trg_roles_updated_at ON public.roles;
CREATE TRIGGER trg_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: churches
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.churches (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_name         text NOT NULL,
  public_name         text,
  type                text,
  province            text,
  city                text,
  district_or_area    text,
  address             text,
  pastor_in_charge    text,
  phone_primary       text,
  phone_secondary     text,
  email               text,
  service_times       jsonb NOT NULL DEFAULT '[]'::jsonb,
  parent_church_id    uuid,
  status              text NOT NULL DEFAULT 'Active',
  information_status  text,
  notes               text,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  created_by          uuid,
  updated_by          uuid
);

-- Compatibility for older local schema that used "name"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'churches' AND column_name = 'name'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'churches' AND column_name = 'church_name'
  ) THEN
    ALTER TABLE public.churches RENAME COLUMN name TO church_name;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Phase 3 additive columns (safe on existing volumes)
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS district_or_area text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS phone_secondary text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS parent_church_id uuid;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS information_status text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_churches_status ON public.churches (status);
CREATE INDEX IF NOT EXISTS idx_churches_province ON public.churches (province);
CREATE INDEX IF NOT EXISTS idx_churches_city ON public.churches (city);

DROP TRIGGER IF EXISTS trg_churches_updated_at ON public.churches;
CREATE TRIGGER trg_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: staff_members
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_code      text,
  full_name       text NOT NULL,
  phone           text,
  email           text,
  church_id       uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  department_id   uuid,
  role_title      text,
  supervisor_id   uuid,
  status          text NOT NULL DEFAULT 'Active',
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid,
  updated_by      uuid
);

DROP TRIGGER IF EXISTS trg_staff_members_updated_at ON public.staff_members;
CREATE TRIGGER trg_staff_members_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: users (app profile; auth_user_id maps to Supabase auth.users later)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Maps to Supabase auth.users.id after Auth pilot link (nullable until provisioned)
  auth_user_id            uuid UNIQUE,
  staff_id                uuid REFERENCES public.staff_members (id) ON DELETE SET NULL,
  full_name               text,
  email                   text UNIQUE,
  phone                   text,
  role_id                 uuid REFERENCES public.roles (id) ON DELETE SET NULL,
  church_id               uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  department_id           uuid,
  status                  text NOT NULL DEFAULT 'Active',
  preferred_language      text DEFAULT 'pt',
  last_login_at           timestamptz,
  last_active_at          timestamptz,
  failed_login_attempts   integer NOT NULL DEFAULT 0,
  locked_until            timestamptz,
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  created_by              uuid,
  updated_by              uuid
);

-- Phase 2: additive columns for older Docker volumes that already created users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at timestamptz;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS failed_login_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS locked_until timestamptz;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users (role_id);

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: permissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.permissions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id                 uuid REFERENCES public.roles (id) ON DELETE CASCADE,
  module                  text NOT NULL,
  can_view                boolean NOT NULL DEFAULT false,
  can_create              boolean NOT NULL DEFAULT false,
  can_edit                boolean NOT NULL DEFAULT false,
  can_delete              boolean NOT NULL DEFAULT false,
  can_approve             boolean NOT NULL DEFAULT false,
  can_verify              boolean NOT NULL DEFAULT false,
  can_release_resources   boolean NOT NULL DEFAULT false,
  can_export              boolean NOT NULL DEFAULT false,
  can_manage_settings     boolean NOT NULL DEFAULT false,
  scope                   text DEFAULT 'church',
  conditions              jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_sensitive            boolean NOT NULL DEFAULT false,
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_permissions_role_module ON public.permissions (role_id, module);
CREATE INDEX IF NOT EXISTS idx_permissions_role_id ON public.permissions (role_id);

DROP TRIGGER IF EXISTS trg_permissions_updated_at ON public.permissions;
CREATE TRIGGER trg_permissions_updated_at
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: members
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_code       text,
  full_name         text NOT NULL,
  first_name        text,
  last_name         text,
  title             text,
  gender            text,
  date_of_birth     date,
  phone             text,
  whatsapp          text,
  email             text,
  address           text,
  church_id         uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  church_name       text,
  cell_group_id     text,
  cell_group_name   text,
  cell_id           text,
  cell_name         text,
  department_id     text,
  department_name   text,
  status            text NOT NULL DEFAULT 'Active',
  entry_date        date,
  source            text,
  notes             text,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  created_by        uuid,
  updated_by        uuid
);

-- Phase 3 additive columns for older volumes
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

-- cell_group_id / cell_id may have been uuid; widen to text for pilot flexibility
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

DROP TRIGGER IF EXISTS trg_members_updated_at ON public.members;
CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: first_timers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.first_timers (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name               text NOT NULL,
  first_name              text,
  last_name               text,
  title                   text,
  gender                  text,
  date_of_birth           date,
  phone                   text,
  whatsapp                text,
  email                   text,
  address                 text,
  church_id               uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  church_name             text,
  cell_group_id           text,
  cell_group_name         text,
  cell_id                 text,
  cell_name               text,
  visit_date              date,
  service_name            text,
  invited_by              text,
  born_again              boolean DEFAULT false,
  foundation_interest     boolean DEFAULT false,
  counseling_interest     boolean DEFAULT false,
  cell_interest           boolean DEFAULT false,
  follow_up_status        text,
  assigned_to_user_id     uuid,
  assigned_to_name        text,
  converted_to_member     boolean DEFAULT false,
  member_id               uuid REFERENCES public.members (id) ON DELETE SET NULL,
  status                  text NOT NULL DEFAULT 'Active',
  notes                   text,
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  created_by              uuid,
  updated_by              uuid
);

-- Phase 4 additive columns
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS church_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS cell_group_id text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS cell_group_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS cell_id text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS cell_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS service_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS invited_by text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS counseling_interest boolean DEFAULT false;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS cell_interest boolean DEFAULT false;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS assigned_to_user_id uuid;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS assigned_to_name text;
ALTER TABLE public.first_timers ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_first_timers_church_id ON public.first_timers (church_id);
CREATE INDEX IF NOT EXISTS idx_first_timers_phone ON public.first_timers (phone);
CREATE INDEX IF NOT EXISTS idx_first_timers_visit_date ON public.first_timers (visit_date);
CREATE INDEX IF NOT EXISTS idx_first_timers_follow_up_status ON public.first_timers (follow_up_status);
CREATE INDEX IF NOT EXISTS idx_first_timers_foundation_interest ON public.first_timers (foundation_interest);
CREATE INDEX IF NOT EXISTS idx_first_timers_born_again ON public.first_timers (born_again);
CREATE INDEX IF NOT EXISTS idx_first_timers_member_id ON public.first_timers (member_id);

DROP TRIGGER IF EXISTS trg_first_timers_updated_at ON public.first_timers;
CREATE TRIGGER trg_first_timers_updated_at
  BEFORE UPDATE ON public.first_timers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Phase 4: follow_ups + timeline
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_timer_id          uuid REFERENCES public.first_timers (id) ON DELETE SET NULL,
  member_id               uuid REFERENCES public.members (id) ON DELETE SET NULL,
  person_type             text,
  person_id               uuid,
  person_name             text NOT NULL,
  phone                   text,
  whatsapp                text,
  email                   text,
  church_id               uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  church_name             text,
  cell_group_id           text,
  cell_group_name         text,
  cell_id                 text,
  cell_name               text,
  source                  text,
  category                text,
  status                  text NOT NULL DEFAULT 'Pending',
  priority                text DEFAULT 'Normal',
  responsible_user_id     uuid,
  responsible_name        text,
  next_contact_date       date,
  last_contact_date       date,
  last_contact_method     text,
  last_contact_result     text,
  notes                   text,
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  created_by              uuid,
  updated_by              uuid
);

CREATE INDEX IF NOT EXISTS idx_follow_ups_church_id ON public.follow_ups (church_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_first_timer_id ON public.follow_ups (first_timer_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_member_id ON public.follow_ups (member_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups (status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_responsible_user_id ON public.follow_ups (responsible_user_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_next_contact_date ON public.follow_ups (next_contact_date);
CREATE INDEX IF NOT EXISTS idx_follow_ups_source ON public.follow_ups (source);

DROP TRIGGER IF EXISTS trg_follow_ups_updated_at ON public.follow_ups;
CREATE TRIGGER trg_follow_ups_updated_at
  BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.follow_up_timeline_events (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follow_up_id            uuid NOT NULL REFERENCES public.follow_ups (id) ON DELETE CASCADE,
  first_timer_id          uuid REFERENCES public.first_timers (id) ON DELETE SET NULL,
  member_id               uuid REFERENCES public.members (id) ON DELETE SET NULL,
  event_type              text,
  title                   text,
  description             text,
  contact_method          text,
  contact_result          text,
  old_status              text,
  new_status              text,
  performed_by_user_id    uuid,
  performed_by_name       text,
  event_date              timestamptz NOT NULL DEFAULT now(),
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_follow_up_timeline_follow_up_id ON public.follow_up_timeline_events (follow_up_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_timeline_first_timer_id ON public.follow_up_timeline_events (first_timer_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_timeline_event_date ON public.follow_up_timeline_events (event_date);

-- ---------------------------------------------------------------------------
-- PILOT: finance_records
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.finance_records (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type        text,
  contribution_group      text,
  contribution_category   text,
  partnership_arm_id      uuid,
  partnership_arm_name    text,
  contributor_name        text,
  contributor_phone       text,
  member_id               uuid REFERENCES public.members (id) ON DELETE SET NULL,
  church_id               uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  cell_group_id           uuid,
  cell_id                 uuid,
  amount                  numeric(14, 2) DEFAULT 0,
  currency                text DEFAULT 'MZN',
  payment_method          text,
  payment_reference       text,
  payment_date            date,
  status                  text NOT NULL DEFAULT 'Pending Verification',
  source                  text,
  verified_by             uuid,
  verified_at             timestamptz,
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  created_by              uuid,
  updated_by              uuid
);

CREATE INDEX IF NOT EXISTS idx_finance_records_church ON public.finance_records (church_id);
CREATE INDEX IF NOT EXISTS idx_finance_records_status ON public.finance_records (status);

DROP TRIGGER IF EXISTS trg_finance_records_updated_at ON public.finance_records;
CREATE TRIGGER trg_finance_records_updated_at
  BEFORE UPDATE ON public.finance_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- PILOT: public_giving_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.public_giving_submissions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_group_id         text,
  full_name                   text,
  phone                       text,
  email                       text,
  church_id                   uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  cell_group_id               uuid,
  cell_id                     uuid,
  contributions               jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount                numeric(14, 2) DEFAULT 0,
  currency                    text DEFAULT 'MZN',
  payment_method              text,
  payment_reference           text,
  payment_date                date,
  proof_file_url              text,
  status                      text NOT NULL DEFAULT 'Pending Verification',
  created_finance_record_ids  jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata                    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  created_by                  uuid,
  updated_by                  uuid
);

DROP TRIGGER IF EXISTS trg_public_giving_updated_at ON public.public_giving_submissions;
CREATE TRIGGER trg_public_giving_updated_at
  BEFORE UPDATE ON public.public_giving_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- PILOT: documents (storage metadata)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module            text,
  entity_type       text,
  entity_id         uuid,
  document_type     text,
  file_url          text,
  file_name         text,
  storage_bucket    text,
  storage_path      text,
  status            text NOT NULL DEFAULT 'Uploaded',
  uploaded_by       uuid,
  verified_by       uuid,
  verified_at       timestamptz,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_documents_updated_at ON public.documents;
CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                     text,
  message                   text,
  type                      text DEFAULT 'info',
  module                    text,
  entity_type               text,
  entity_id                 uuid,
  priority                  text DEFAULT 'normal',
  recipient_user_id         uuid,
  recipient_role_id         uuid,
  recipient_department_id   uuid,
  recipient_church_id       uuid,
  scope                     text DEFAULT 'national',
  action_url                text,
  is_read                   boolean NOT NULL DEFAULT false,
  read_at                   timestamptz,
  metadata                  jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_user ON public.notifications (recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications (is_read) WHERE is_read = false;

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- CORE: audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid,
  user_name       text,
  user_role       text,
  module          text,
  action          text,
  entity_type     text,
  entity_id       text,
  entity_label    text,
  old_value       jsonb,
  new_value       jsonb,
  description     text,
  severity        text DEFAULT 'info',
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON public.audit_logs (module);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- CORE: system_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key           text NOT NULL UNIQUE,
  value         jsonb NOT NULL DEFAULT 'null'::jsonb,
  value_type    text DEFAULT 'string',
  module        text DEFAULT 'global',
  is_sensitive  boolean NOT NULL DEFAULT false,
  is_system     boolean NOT NULL DEFAULT false,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER trg_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
