-- ============================================================================
-- Optional seed: First Timers + Follow-Ups pilot (mock data only)
-- Requires churches seed (a1111111-... ids from churches_members_seed.sql)
-- ============================================================================

INSERT INTO public.first_timers (
  id, full_name, first_name, last_name, title, gender, phone, email,
  church_id, church_name, visit_date, service_name, invited_by,
  born_again, foundation_interest, counseling_interest, cell_interest,
  follow_up_status, status, notes
) VALUES
  (
    'c3333333-3333-4333-8333-333333333301',
    'Visitor HQ One', 'Visitor', 'HQOne', 'Brother', 'M',
    '+258 84 200 0001', 'visitor.hq1@example.com',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    CURRENT_DATE - 3, '1º Culto', 'Cell Leader Demo',
    true, true, false, true, 'Pending', 'Active', 'Demo first timer HQ'
  ),
  (
    'c3333333-3333-4333-8333-333333333302',
    'Visitor HQ Two', 'Visitor', 'HQTwo', 'Sister', 'F',
    '+258 84 200 0002', 'visitor.hq2@example.com',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    CURRENT_DATE - 7, '2º Culto', 'Welcome Team',
    true, false, true, false, 'Contacted', 'Active', 'Demo contacted'
  ),
  (
    'c3333333-3333-4333-8333-333333333303',
    'Visitor Matola', 'Visitor', 'Matola', 'Brother', 'M',
    '+258 84 200 0003', 'visitor.matola@example.com',
    'a1111111-1111-4111-8111-111111111102', 'Matola',
    CURRENT_DATE - 2, 'Culto de Domingo', 'Pastor Branch',
    false, true, false, true, 'Pending', 'Active', 'Demo Matola'
  ),
  (
    'c3333333-3333-4333-8333-333333333304',
    'Visitor Beira', 'Visitor', 'Beira', 'Sister', 'F',
    '+258 84 200 0004', 'visitor.beira@example.com',
    'a1111111-1111-4111-8111-111111111104', 'Beira',
    CURRENT_DATE - 14, 'Culto', 'Invite Friend',
    true, true, false, true, 'Visit Scheduled', 'Active', 'Demo Beira'
  ),
  (
    'c3333333-3333-4333-8333-333333333305',
    'Visitor Online', 'Visitor', 'Online', 'Brother', 'M',
    '+258 84 200 0005', 'visitor.online@example.com',
    'a1111111-1111-4111-8111-111111111107', 'Online Church',
    CURRENT_DATE - 1, 'Online Service', 'Social Media',
    false, false, false, false, 'No Response', 'Active', 'Demo online'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.follow_ups (
  id, first_timer_id, person_type, person_name, phone, email,
  church_id, church_name, source, status, priority,
  responsible_name, next_contact_date, last_contact_date,
  last_contact_method, last_contact_result, notes
) VALUES
  (
    'd4444444-4444-4444-8444-444444444401',
    'c3333333-3333-4333-8333-333333333301',
    'First Timer', 'Visitor HQ One', '+258 84 200 0001', 'visitor.hq1@example.com',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    'First Timer', 'Pending', 'Normal',
    'Follow-Up Officer Demo', CURRENT_DATE + 1, CURRENT_DATE - 3,
    'WhatsApp', 'Message sent', 'Pending contact'
  ),
  (
    'd4444444-4444-4444-8444-444444444402',
    'c3333333-3333-4333-8333-333333333302',
    'First Timer', 'Visitor HQ Two', '+258 84 200 0002', 'visitor.hq2@example.com',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    'First Timer', 'Contacted', 'Normal',
    'Follow-Up Officer Demo', CURRENT_DATE + 3, CURRENT_DATE - 1,
    'Call', 'Answered', 'Interested in counseling'
  ),
  (
    'd4444444-4444-4444-8444-444444444403',
    'c3333333-3333-4333-8333-333333333303',
    'First Timer', 'Visitor Matola', '+258 84 200 0003', 'visitor.matola@example.com',
    'a1111111-1111-4111-8111-111111111102', 'Matola',
    'First Timer', 'No Response', 'High',
    'Cell Leader Demo', CURRENT_DATE, CURRENT_DATE - 2,
    'Call', 'No answer', 'Retry today'
  ),
  (
    'd4444444-4444-4444-8444-444444444404',
    'c3333333-3333-4333-8333-333333333304',
    'First Timer', 'Visitor Beira', '+258 84 200 0004', 'visitor.beira@example.com',
    'a1111111-1111-4111-8111-111111111104', 'Beira',
    'First Timer', 'Visit Scheduled', 'Normal',
    'Church Pastor Demo', CURRENT_DATE + 5, CURRENT_DATE - 5,
    'WhatsApp', 'Visit confirmed', 'Home visit'
  ),
  (
    'd4444444-4444-4444-8444-444444444405',
    'c3333333-3333-4333-8333-333333333305',
    'First Timer', 'Visitor Online', '+258 84 200 0005', 'visitor.online@example.com',
    'a1111111-1111-4111-8111-111111111107', 'Online Church',
    'First Timer', 'Sent to Foundation School', 'Normal',
    'Foundation Coordinator Demo', CURRENT_DATE + 7, CURRENT_DATE - 1,
    'Email', 'Referred', 'Foundation interest'
  ),
  (
    'd4444444-4444-4444-8444-444444444406',
    NULL,
    'Other', 'Closed Demo Contact', '+258 84 200 0099', 'closed.demo@example.com',
    'a1111111-1111-4111-8111-111111111101', 'Sede Nacional / HQ Maputo',
    'Manual', 'Closed', 'Low',
    'Admin Demo', NULL, CURRENT_DATE - 30,
    'Call', 'Completed', 'Closed case demo'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.follow_up_timeline_events (
  id, follow_up_id, first_timer_id, event_type, title, description,
  contact_method, contact_result, new_status, performed_by_name, event_date
) VALUES
  (
    'e5555555-5555-4555-8555-555555555501',
    'd4444444-4444-4444-8444-444444444401',
    'c3333333-3333-4333-8333-333333333301',
    'created', 'Acompanhamento criado', 'Novo registo',
    'WhatsApp', 'Message sent', 'Pending', 'System Seed', now() - interval '3 days'
  ),
  (
    'e5555555-5555-4555-8555-555555555502',
    'd4444444-4444-4444-8444-444444444402',
    'c3333333-3333-4333-8333-333333333302',
    'contacted', 'Contacted', 'Phone call answered',
    'Call', 'Answered', 'Contacted', 'Follow-Up Officer Demo', now() - interval '1 day'
  ),
  (
    'e5555555-5555-4555-8555-555555555503',
    'd4444444-4444-4444-8444-444444444404',
    'c3333333-3333-4333-8333-333333333304',
    'visit_scheduled', 'Visit Scheduled', 'Home visit confirmed',
    'WhatsApp', 'Visit confirmed', 'Visit Scheduled', 'Church Pastor Demo', now() - interval '5 days'
  ),
  (
    'e5555555-5555-4555-8555-555555555504',
    'd4444444-4444-4444-8444-444444444405',
    'c3333333-3333-4333-8333-333333333305',
    'sent_to_foundation', 'Sent to Foundation School', 'Referred to ESF',
    'Email', 'Referred', 'Sent to Foundation School', 'Foundation Coordinator Demo', now() - interval '1 day'
  )
ON CONFLICT (id) DO NOTHING;
