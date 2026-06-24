-- =============================================================================
-- double_booking_test.sql
-- Prueba manual del anti-doble-reserva directamente en PostgreSQL.
-- Ejecutar en el SQL editor de Supabase o con psql, DESPUES de aplicar las
-- migraciones (no requiere el seed).
--
-- Se corre dentro de una transaccion con ROLLBACK final: no deja datos.
-- Cada bloque indica el resultado esperado.
-- =============================================================================

begin;

-- --- Datos de prueba: org, venue, dos canchas (X e Y) con horario amplio ----
insert into organizations (id, name, slug)
values ('11111111-1111-1111-1111-111111111111', 'Test Org', 'test-org');

insert into venues (id, organization_id, name, zone)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Test Venue', 'Centro'
);

-- Cancha X
insert into courts (id, venue_id, organization_id, name, sport, price_per_hour)
values (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Cancha X', 'futbol', 200
);

-- Cancha Y
insert into courts (id, venue_id, organization_id, name, sport, price_per_hour)
values (
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Cancha Y', 'futbol', 200
);

-- Horario abierto 08:00-23:00 todos los dias para ambas canchas.
insert into court_operating_hours (court_id, day_of_week, open_time, close_time)
select c.id, d, time '08:00', time '23:00'
from courts c
cross join generate_series(0, 6) as d
where c.organization_id = '11111111-1111-1111-1111-111111111111';

-- ===========================================================================
-- PASO 1: reserva 19:00-20:30 en cancha X  =>  EXITO
-- ===========================================================================
insert into reservations (organization_id, venue_id, court_id, guest_name,
                          starts_at, ends_at, status, price_total)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'Reserva 1',
  (current_date + interval '1 day' + time '19:00') at time zone 'America/La_Paz',
  (current_date + interval '1 day' + time '20:30') at time zone 'America/La_Paz',
  'confirmed', 300
);
-- Esperado: INSERT 0 1

-- ===========================================================================
-- PASO 2: reserva SOLAPADA 20:00-21:00 en cancha X (status activo)  =>  FALLA
-- Esperado: ERROR  23P01  conflicting key value violates exclusion
--           constraint "reservations_no_overlap"
-- Descomentar para verla fallar (abortaria la transaccion):
-- ===========================================================================
-- insert into reservations (organization_id, venue_id, court_id, guest_name,
--                           starts_at, ends_at, status, price_total)
-- values (
--   '11111111-1111-1111-1111-111111111111',
--   '22222222-2222-2222-2222-222222222222',
--   '33333333-3333-3333-3333-333333333333',
--   'Reserva 2 (solapada)',
--   (current_date + interval '1 day' + time '20:00') at time zone 'America/La_Paz',
--   (current_date + interval '1 day' + time '21:00') at time zone 'America/La_Paz',
--   'confirmed', 300
-- );

-- Alternativa sin abortar: usar un savepoint para capturar el error.
savepoint sp_overlap;
do $$
begin
  insert into reservations (organization_id, venue_id, court_id, guest_name,
                            starts_at, ends_at, status, price_total)
  values (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'Reserva 2 (solapada)',
    (current_date + interval '1 day' + time '20:00') at time zone 'America/La_Paz',
    (current_date + interval '1 day' + time '21:00') at time zone 'America/La_Paz',
    'confirmed', 300
  );
  raise notice 'PASO 2: INESPERADO -> la reserva solapada fue aceptada (BUG)';
exception
  when exclusion_violation then
    raise notice 'PASO 2: OK -> reserva solapada rechazada por exclusion constraint (23P01)';
end $$;
rollback to savepoint sp_overlap;

-- ===========================================================================
-- PASO 3: reserva CONTIGUA 20:30-21:30 en cancha X  =>  EXITO
-- (rango semiabierto [) : el fin 20:30 no solapa con el inicio 20:30)
-- ===========================================================================
insert into reservations (organization_id, venue_id, court_id, guest_name,
                          starts_at, ends_at, status, price_total)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'Reserva 3 (contigua)',
  (current_date + interval '1 day' + time '20:30') at time zone 'America/La_Paz',
  (current_date + interval '1 day' + time '21:30') at time zone 'America/La_Paz',
  'confirmed', 300
);
-- Esperado: INSERT 0 1

-- ===========================================================================
-- PASO 4: reserva solapada 20:00-21:00 pero en cancha Y  =>  EXITO
-- (distinta cancha => no hay conflicto)
-- ===========================================================================
insert into reservations (organization_id, venue_id, court_id, guest_name,
                          starts_at, ends_at, status, price_total)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  'Reserva 4 (otra cancha)',
  (current_date + interval '1 day' + time '20:00') at time zone 'America/La_Paz',
  (current_date + interval '1 day' + time '21:00') at time zone 'America/La_Paz',
  'confirmed', 300
);
-- Esperado: INSERT 0 1

-- ===========================================================================
-- PASO 5: cancelar la Reserva 1 y reintentar la solapada en cancha X => EXITO
-- (el constraint parcial ignora las reservas 'cancelled')
-- ===========================================================================
update reservations
set status = 'cancelled'
where guest_name = 'Reserva 1';

insert into reservations (organization_id, venue_id, court_id, guest_name,
                          starts_at, ends_at, status, price_total)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'Reserva 5 (tras cancelar)',
  (current_date + interval '1 day' + time '19:00') at time zone 'America/La_Paz',
  (current_date + interval '1 day' + time '20:15') at time zone 'America/La_Paz',
  'confirmed', 300
);
-- Esperado: INSERT 0 1

-- No dejar rastro de la prueba.
rollback;
