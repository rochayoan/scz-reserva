-- SCZ Reserva - Seed data de ejemplo
-- Ejecutar en Supabase Dashboard > SQL Editor

-- Reservas de ejemplo para los próximos días
INSERT INTO public.reservations (organization_id, venue_id, court_id, guest_name, guest_phone, starts_at, ends_at, status, price_total, payment_method, payment_status, notes, created_at)
SELECT
  '00000000-0000-0000-0000-000000000001',
  '95a2415e-234f-47be-83b1-d8263a8dfa11',
  '27aa8fe7-b32f-4bc4-a693-b2f1abceee03',
  'Carlos Rojas',
  '59170000001',
  NOW() + INTERVAL '1 day' + INTERVAL '10 hours',
  NOW() + INTERVAL '1 day' + INTERVAL '11 hours',
  'confirmed',
  180,
  'none',
  'unpaid',
  'Reservado desde la web',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.reservations WHERE guest_name = 'Carlos Rojas' AND starts_at::date = (NOW() + INTERVAL '1 day')::date);

INSERT INTO public.reservations (organization_id, venue_id, court_id, guest_name, guest_phone, starts_at, ends_at, status, price_total, payment_method, payment_status, notes, created_at)
SELECT
  '00000000-0000-0000-0000-000000000001',
  '95a2415e-234f-47be-83b1-d8263a8dfa11',
  '425b7124-34e2-4ab2-923a-01ef68ccf4f9',
  'Maria Gutierrez',
  '59170000002',
  NOW() + INTERVAL '1 day' + INTERVAL '14 hours',
  NOW() + INTERVAL '1 day' + INTERVAL '15 hours',
  'pending',
  180,
  'none',
  'unpaid',
  'Cumpleaños',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.reservations WHERE guest_name = 'Maria Gutierrez' AND starts_at::date = (NOW() + INTERVAL '1 day')::date);

INSERT INTO public.reservations (organization_id, venue_id, court_id, guest_name, guest_phone, starts_at, ends_at, status, price_total, payment_method, payment_status, notes, created_at)
SELECT
  '00000000-0000-0000-0000-000000000001',
  'b861f2f8-3112-479b-8052-f4d5d2c7034d',
  '13e11e64-aaba-43e9-b551-3b253f229480',
  'Pedro Vargas',
  '59170000003',
  NOW() + INTERVAL '2 days' + INTERVAL '16 hours',
  NOW() + INTERVAL '2 days' + INTERVAL '17 hours',
  'pending',
  120,
  'none',
  'unpaid',
  'Partido amistoso',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.reservations WHERE guest_name = 'Pedro Vargas' AND starts_at::date = (NOW() + INTERVAL '2 days')::date);

INSERT INTO public.reservations (organization_id, venue_id, court_id, guest_name, guest_phone, starts_at, ends_at, status, price_total, payment_method, payment_status, notes, created_at)
SELECT
  '00000000-0000-0000-0000-000000000001',
  '75a1ac48-a04f-4317-9859-6053f5526328',
  'a8a04780-0d64-477e-9e6f-4a2657976942',
  'Ana Suarez',
  '59170000004',
  NOW() + INTERVAL '1 day' + INTERVAL '18 hours',
  NOW() + INTERVAL '1 day' + INTERVAL '19 hours',
  'completed',
  160,
  'none',
  'paid',
  'Torneo',
  NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM public.reservations WHERE guest_name = 'Ana Suarez');

-- Insertar una reserva de hoy (para que se vea en "hoy")
INSERT INTO public.reservations (organization_id, venue_id, court_id, guest_name, guest_phone, starts_at, ends_at, status, price_total, payment_method, payment_status, notes, created_at)
SELECT
  '00000000-0000-0000-0000-000000000001',
  '95a2415e-234f-47be-83b1-d8263a8dfa11',
  '9a09d3ae-f957-4e76-9a00-346affa95470',
  'Luis Mendoza',
  '59170000005',
  NOW() + INTERVAL '2 hours',
  NOW() + INTERVAL '3 hours',
  'confirmed',
  180,
  'none',
  'unpaid',
  'Reservado desde la web',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.reservations WHERE guest_name = 'Luis Mendoza' AND starts_at::date = NOW()::date);
