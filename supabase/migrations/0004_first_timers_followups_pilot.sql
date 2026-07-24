-- ============================================================================
-- Migration 0004 — First Timers + Follow-Up pilot (Backend Phase 4)
-- ============================================================================
-- Safe additive. No drops. No secrets.
-- ============================================================================

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

INSERT INTO public.schema_meta (key, value)
VALUES ('backend_phase', '4_first_timers_followups_pilot')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

COMMENT ON TABLE public.first_timers IS
  'Phase 4 pilot: First Timers / Primeira Vez. No auto-convert to members.';
COMMENT ON TABLE public.follow_ups IS
  'Phase 4 pilot: Follow-Up / Acompanhamento.';
COMMENT ON TABLE public.follow_up_timeline_events IS
  'Phase 4 pilot: contact/status timeline for follow-ups.';

-- RLS sketches only (not enabled):
-- ALTER TABLE public.first_timers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
-- Church Pastor: church_id = current user church_id
-- Super Admin / Main Pastor: scope all
