-- ============================================================================
-- Optional seed: Finance + Public Giving pilot (mock data only)
-- Requires churches seed (a1111111-... ids)
-- ============================================================================

INSERT INTO public.finance_records (
  id, transaction_type, contribution_group, contribution_category,
  partnership_arm_name, contributor_name, contributor_phone,
  church_id, church_name, amount, currency, payment_method, payment_date,
  source, status, verified_by_name, verified_at, notes
) VALUES
  (
    'f6666666-6666-4666-8666-666666666601',
    'income', 'Dízimos', 'Dízimo',
    NULL, 'Demo Tithe Giver', '+258 84 300 0001',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    1500, 'MZN', 'Transfer', CURRENT_DATE - 5,
    'Manual Entry', 'Verified', 'Finance Head Demo', now() - interval '4 days',
    'Verified tithe demo'
  ),
  (
    'f6666666-6666-4666-8666-666666666602',
    'income', 'Ofertas', 'Oferta de Culto',
    NULL, 'Demo Offering', '+258 84 300 0002',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    800, 'MZN', 'Cash', CURRENT_DATE - 3,
    'Manual Entry', 'Verified', 'Finance Head Demo', now() - interval '2 days',
    'Verified offering demo'
  ),
  (
    'f6666666-6666-4666-8666-666666666603',
    'income', 'Parcerias', 'Loveworld SAT',
    'Loveworld SAT', 'Demo Partner', '+258 84 300 0003',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    2500, 'MZN', 'Transfer', CURRENT_DATE - 2,
    'Manual Entry', 'Verified', 'Finance Head Demo', now() - interval '1 day',
    'Verified partnership — counts in Partnerships analytics'
  ),
  (
    'f6666666-6666-4666-8666-666666666604',
    'income', 'Ofertas', 'Oferta',
    NULL, 'Pending Demo', '+258 84 300 0004',
    'a1111111-1111-4111-8111-111111111102', 'Matola',
    500, 'MZN', 'M-Pesa', CURRENT_DATE,
    'Manual Entry', 'Pending Verification', NULL, NULL,
    'Pending — not in monthly verified'
  ),
  (
    'f6666666-6666-4666-8666-666666666605',
    'income', 'Outros', 'Outros',
    NULL, 'Rejected Demo', '+258 84 300 0005',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    100, 'MZN', 'Transfer', CURRENT_DATE - 10,
    'Manual Entry', 'Rejected', NULL, NULL,
    'Rejected demo'
  ),
  (
    'f6666666-6666-4666-8666-666666666606',
    'expense', 'Disbursement', 'Requisition Disbursement',
    NULL, 'Department Demo', NULL,
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    1200, 'MZN', 'Transfer', CURRENT_DATE - 1,
    'Requisition Disbursement', 'Verified', 'Finance Head Demo', now() - interval '1 day',
    'Expense demo — not in partnerships'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.public_giving_submissions (
  id, submission_group_id, full_name, phone, email,
  church_id, church_name, contributions, total_amount, currency,
  payment_method, payment_date, status, source, notes
) VALUES
  (
    'g7777777-7777-4777-8777-777777777701',
    'sg-demo-pending',
    'Public Giver Pending',
    '+258 84 310 0001',
    'public.pending@example.com',
    'a1111111-1111-4111-8111-111111111101',
    'Sede Nacional / HQ Maputo',
    '[{"contribution_group":"Ofertas","contribution_category":"Oferta","amount":300}]'::jsonb,
    300, 'MZN', 'M-Pesa', CURRENT_DATE,
    'Pending Verification', 'public_website', 'Pending public giving'
  ),
  (
    'g7777777-7777-4777-8777-777777777702',
    'sg-demo-verified',
    'Public Giver Verified',
    '+258 84 310 0002',
    'public.verified@example.com',
    'a1111111-1111-4111-8111-111111111101',
    'Sede Nacional / HQ Maputo',
    '[{"contribution_group":"Parcerias","contribution_category":"Visão 1","partnership_arm_name":"Visão 1","amount":1000}]'::jsonb,
    1000, 'MZN', 'Transfer', CURRENT_DATE - 4,
    'Verified', 'public_website', 'Already verified — has finance ids'
  ),
  (
    'g7777777-7777-4777-8777-777777777703',
    'sg-demo-rejected',
    'Public Giver Rejected',
    '+258 84 310 0003',
    'public.rejected@example.com',
    'a1111111-1111-4111-8111-111111111102',
    'Matola',
    '[{"contribution_group":"Ofertas","contribution_category":"Oferta","amount":50}]'::jsonb,
    50, 'MZN', 'Cash', CURRENT_DATE - 8,
    'Rejected', 'public_website', 'Rejected demo'
  )
ON CONFLICT (id) DO NOTHING;

UPDATE public.public_giving_submissions
SET
  verified_by_name = 'Finance Head Demo',
  verified_at = now() - interval '3 days',
  created_finance_record_ids = '["f6666666-6666-4666-8666-666666666603"]'::jsonb
WHERE id = 'g7777777-7777-4777-8777-777777777702';

UPDATE public.public_giving_submissions
SET
  rejected_by_name = 'Finance Head Demo',
  rejected_at = now() - interval '7 days',
  rejection_reason = 'Comprovativo ilegível (demo)'
WHERE id = 'g7777777-7777-4777-8777-777777777703';

INSERT INTO public.finance_disbursements (
  id, request_number, title, department_name, church_id, church_name,
  requested_by_name, approved_amount, released_amount, pending_amount,
  status, finance_record_id, notes
) VALUES
  (
    'h8888888-8888-4888-8888-888888888801',
    'REQ-DEMO-001',
    'Material de Escritório',
    'Admin',
    'a1111111-1111-4111-8111-111111111101',
    'Sede Nacional / HQ Maputo',
    'Staff Demo',
    1200, 1200, 0,
    'Released',
    'f6666666-6666-4666-8666-666666666606',
    'Released expense demo'
  ),
  (
    'h8888888-8888-4888-8888-888888888802',
    'REQ-DEMO-002',
    'Event Supplies',
    'Programs',
    'a1111111-1111-4111-8111-111111111101',
    'Sede Nacional / HQ Maputo',
    'Programs Demo',
    500, 0, 500,
    'Awaiting Release',
    NULL,
    'Awaiting release demo'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.documents (
  id, module, entity_type, entity_id, document_type, document_title,
  file_name, storage_bucket, storage_path, file_url, status, is_sensitive, uploaded_by_name
) VALUES
  (
    'i9999999-9999-4999-8999-999999999901',
    'finance',
    'public_giving_submission',
    'g7777777-7777-4777-8777-777777777701',
    'payment_proof',
    'Mock POP pending',
    'pop-pending-demo.pdf',
    'finance-proofs',
    'mock://proofs/pop-pending-demo.pdf',
    'mock://proofs/pop-pending-demo.pdf',
    'Pending Review',
    true,
    'Public Form'
  )
ON CONFLICT (id) DO NOTHING;
