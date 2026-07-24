-- ============================================================================
-- Optional seed: Churches + Members pilot (no real private data / passwords)
-- Fixed UUIDs for stable FK links. Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================================

INSERT INTO public.churches (
  id, church_name, public_name, type, province, city, district_or_area,
  address, pastor_in_charge, phone_primary, email, status, information_status
) VALUES
  (
    'a1111111-1111-4111-8111-111111111101',
    'National HQ - Christ Embassy Mozambique',
    'Sede Nacional / HQ Maputo',
    'HQ',
    'Maputo',
    'Maputo',
    'Cidade',
    'Maputo',
    'Pastor Kene Ume',
    '+258 84 000 0001',
    'hq@ce-mozambique.org',
    'Active',
    'Complete'
  ),
  (
    'a1111111-1111-4111-8111-111111111102',
    'Christ Embassy Matola',
    'Matola',
    'Branch',
    'Maputo',
    'Matola',
    'Matola',
    'Matola',
    'Pastor Branch Matola',
    '+258 84 000 0002',
    'matola@ce-mozambique.org',
    'Active',
    'Complete'
  ),
  (
    'a1111111-1111-4111-8111-111111111103',
    'Christ Embassy Khongolote',
    'Khongolote',
    'Branch',
    'Maputo',
    'Maputo',
    'Khongolote',
    'Khongolote',
    'Pastor Branch Khongolote',
    '+258 84 000 0003',
    'khongolote@ce-mozambique.org',
    'Active',
    'Partial'
  ),
  (
    'a1111111-1111-4111-8111-111111111104',
    'Christ Embassy Beira',
    'Beira',
    'Branch',
    'Sofala',
    'Beira',
    'Beira',
    'Beira',
    'Pastor Branch Beira',
    '+258 84 000 0004',
    'beira@ce-mozambique.org',
    'Active',
    'Partial'
  ),
  (
    'a1111111-1111-4111-8111-111111111105',
    'Christ Embassy Nampula',
    'Nampula',
    'Branch',
    'Nampula',
    'Nampula',
    'Nampula',
    'Nampula',
    'Pastor Branch Nampula',
    '+258 84 000 0005',
    'nampula@ce-mozambique.org',
    'Active',
    'Partial'
  ),
  (
    'a1111111-1111-4111-8111-111111111106',
    'Christ Embassy Choupal',
    'Choupal',
    'Branch',
    'Maputo',
    'Maputo',
    'Choupal',
    'Choupal',
    'Pastor Branch Choupal',
    '+258 84 000 0006',
    'choupal@ce-mozambique.org',
    'Active',
    'Partial'
  ),
  (
    'a1111111-1111-4111-8111-111111111107',
    'Christ Embassy Online Church',
    'Online Church',
    'Online',
    'Maputo',
    'Maputo',
    'Virtual',
    'Online',
    'Pastor Online',
    '+258 84 000 0007',
    'online@ce-mozambique.org',
    'Active',
    'Complete'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.members (
  id, member_code, full_name, first_name, last_name, title, gender,
  phone, email, church_id, church_name, status, source, entry_date
) VALUES
  (
    'b2222222-2222-4222-8222-222222222201',
    'M-HQ-001',
    'Brother Demo HQ',
    'Demo',
    'HQ',
    'Brother',
    'M',
    '+258 84 100 0001',
    'member.hq1@example.com',
    'a1111111-1111-4111-8111-111111111101',
    'Sede Nacional / HQ Maputo',
    'Active',
    'Seed',
    CURRENT_DATE
  ),
  (
    'b2222222-2222-4222-8222-222222222202',
    'M-HQ-002',
    'Sister Demo HQ',
    'Demo',
    'Sister',
    'Sister',
    'F',
    '+258 84 100 0002',
    'member.hq2@example.com',
    'a1111111-1111-4111-8111-111111111101',
    'Sede Nacional / HQ Maputo',
    'Active',
    'Seed',
    CURRENT_DATE
  ),
  (
    'b2222222-2222-4222-8222-222222222203',
    'M-MAT-001',
    'Member Matola Demo',
    'Member',
    'Matola',
    'Brother',
    'M',
    '+258 84 100 0003',
    'member.matola@example.com',
    'a1111111-1111-4111-8111-111111111102',
    'Matola',
    'Active',
    'Seed',
    CURRENT_DATE
  ),
  (
    'b2222222-2222-4222-8222-222222222204',
    'M-BEI-001',
    'Member Beira Demo',
    'Member',
    'Beira',
    'Sister',
    'F',
    '+258 84 100 0004',
    'member.beira@example.com',
    'a1111111-1111-4111-8111-111111111104',
    'Beira',
    'Active',
    'Seed',
    CURRENT_DATE
  ),
  (
    'b2222222-2222-4222-8222-222222222205',
    'M-ONL-001',
    'Online Member Demo',
    'Online',
    'Member',
    'Brother',
    'M',
    '+258 84 100 0005',
    'member.online@example.com',
    'a1111111-1111-4111-8111-111111111107',
    'Online Church',
    'Active',
    'Seed',
    CURRENT_DATE
  )
ON CONFLICT (id) DO NOTHING;
