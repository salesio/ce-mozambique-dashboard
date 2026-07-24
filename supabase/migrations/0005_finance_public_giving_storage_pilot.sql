-- ============================================================================
-- Migration 0005 — Finance + Public Giving + Storage proofs pilot (Phase 5)
-- ============================================================================
-- Safe additive. No drops. No secrets. No real proof files.
-- ============================================================================

-- finance_records expansions (see database/schema.sql for full CREATE)
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS contributor_type text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS contributor_id uuid;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS contributor_email text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS first_timer_id uuid;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS church_name text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS cell_group_name text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS cell_name text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS source_module text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS source_id uuid;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS submission_group_id text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS received_by uuid;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS received_by_name text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS verified_by_name text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS rejected_by uuid;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS rejected_by_name text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS proof_document_id uuid;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS proof_file_url text;
ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_finance_records_church_id ON public.finance_records (church_id);
CREATE INDEX IF NOT EXISTS idx_finance_records_status ON public.finance_records (status);
CREATE INDEX IF NOT EXISTS idx_finance_records_transaction_type ON public.finance_records (transaction_type);
CREATE INDEX IF NOT EXISTS idx_finance_records_contribution_group ON public.finance_records (contribution_group);
CREATE INDEX IF NOT EXISTS idx_finance_records_partnership_arm_name ON public.finance_records (partnership_arm_name);
CREATE INDEX IF NOT EXISTS idx_finance_records_payment_date ON public.finance_records (payment_date);
CREATE INDEX IF NOT EXISTS idx_finance_records_source ON public.finance_records (source);
CREATE INDEX IF NOT EXISTS idx_finance_records_submission_group_id ON public.finance_records (submission_group_id);

ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS church_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS cell_group_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS cell_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS proof_document_id uuid;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS proof_file_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS reviewed_by uuid;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS reviewed_by_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS verified_by uuid;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS verified_by_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS rejected_by uuid;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS rejected_by_name text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS source text DEFAULT 'public_website';
ALTER TABLE public.public_giving_submissions ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_public_giving_status ON public.public_giving_submissions (status);
CREATE INDEX IF NOT EXISTS idx_public_giving_church_id ON public.public_giving_submissions (church_id);
CREATE INDEX IF NOT EXISTS idx_public_giving_submission_group_id ON public.public_giving_submissions (submission_group_id);
CREATE INDEX IF NOT EXISTS idx_public_giving_payment_date ON public.public_giving_submissions (payment_date);

CREATE TABLE IF NOT EXISTS public.finance_disbursements (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_id        uuid,
  request_number        text,
  title                 text,
  description           text,
  department_id         text,
  department_name       text,
  church_id             uuid REFERENCES public.churches (id) ON DELETE SET NULL,
  church_name           text,
  requested_by          uuid,
  requested_by_name     text,
  approved_by           uuid,
  approved_by_name      text,
  approved_at           timestamptz,
  approved_amount       numeric(14, 2) DEFAULT 0,
  released_amount       numeric(14, 2) DEFAULT 0,
  pending_amount        numeric(14, 2) DEFAULT 0,
  currency              text DEFAULT 'MZN',
  payment_method        text,
  payment_reference     text,
  release_date          date,
  status                text NOT NULL DEFAULT 'Awaiting Release',
  finance_record_id     uuid REFERENCES public.finance_records (id) ON DELETE SET NULL,
  notes                 text,
  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_finance_disbursements_status ON public.finance_disbursements (status);
CREATE INDEX IF NOT EXISTS idx_finance_disbursements_church_id ON public.finance_disbursements (church_id);
CREATE INDEX IF NOT EXISTS idx_finance_disbursements_requisition_id ON public.finance_disbursements (requisition_id);

DROP TRIGGER IF EXISTS trg_finance_disbursements_updated_at ON public.finance_disbursements;
CREATE TRIGGER trg_finance_disbursements_updated_at
  BEFORE UPDATE ON public.finance_disbursements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS document_title text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_size bigint;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS mime_type text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS uploaded_by_name text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS verified_by_name text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS rejected_by uuid;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS rejected_by_name text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS is_sensitive boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_documents_module ON public.documents (module);
CREATE INDEX IF NOT EXISTS idx_documents_entity ON public.documents (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_storage_path ON public.documents (storage_path);

INSERT INTO public.schema_meta (key, value)
VALUES ('backend_phase', '5_finance_public_giving_storage_pilot')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

COMMENT ON TABLE public.finance_records IS
  'Phase 5 pilot: income/expense. Public giving income only after explicit verify.';
COMMENT ON TABLE public.public_giving_submissions IS
  'Phase 5 pilot: public giving. No auto revenue until verification.';
COMMENT ON TABLE public.finance_disbursements IS
  'Phase 5 pilot: expense release side (not full requisitions module).';
COMMENT ON TABLE public.documents IS
  'Phase 5 pilot: storage metadata. finance-proofs bucket is PRIVATE.';

-- Storage bucket finance-proofs: create in Supabase Dashboard (private).
-- RLS sketches only — not enabled here.
