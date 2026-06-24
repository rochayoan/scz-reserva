-- =============================================================================
-- seed.sql
-- Datos de desarrollo derivados de src/data.js.
-- Se aplica DESPUES de las migraciones (Supabase CLI lo corre en `db reset`).
-- Solo para entornos de desarrollo / demo.
--
-- Nota: los complejos del mock (Pentagol, etc.) se modelan como VENUES, y su
-- campo `fields` se expande en N filas de COURTS. El contenido de marketing
-- (stats, problems, steps, benefits*) NO se siembra: permanece en data.js.
--
-- profiles / memberships NO se siembran aqui porque dependen de auth.users
-- (usuarios reales creados via Supabase Auth). Las reservas de ejemplo son
-- de invitado (user_id null), por lo que no requieren cuentas.
-- =============================================================================

-- Organizacion demo (tenant unico para todos los complejos de ejemplo).
insert into organizations (id, name, slug, subscription_plan, subscription_status)
values (
  '00000000-0000-0000-0000-000000000001',
  'SCZ Reserva Demo',
  'scz-demo',
  'pro',
  'active'
)
on conflict (id) do nothing;

-- Complejos + canchas + horarios de apertura.
do $$
declare
  org_id uuid := '00000000-0000-0000-0000-000000000001';
  rec    record;
  v_id   uuid;
  c_id   uuid;
  i      int;
begin
  for rec in
    select * from (values
      ('Pentagol Complejo Deportivo',    'Futbol 5, 6, 7 y 8',          'Santa Cruz de la Sierra',                      'futbol'::sport_type, 180, 4.8, 4, 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80'),
      ('La Bombonera',                   'Cancha sintetica',            'Av. Banzer, Zona Norte',                       'futbol'::sport_type, 160, 4.6, 1, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80'),
      ('Santa Cruz Padel Club',          '2 cubiertas y 2 al aire libre','Barrio La Madre, entre 3er y 4to anillo',     'padel'::sport_type,  120, 4.9, 4, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80'),
      ('Costanera Padel Club',           'Club de padel',               'Av. 4to Anillo, atras del Ventura Mall',       'padel'::sport_type,  130, 4.8, 8, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80'),
      ('Club de Tenis Santa Cruz',       'Tenis y padel',               'Av. Taruma #2120',                             'tenis'::sport_type,  110, 4.7, 6, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80'),
      ('Las Palmas Canchas Sinteticas',  'Canchas sinteticas',          'Doble via La Guardia, entre 3er y 4to anillo', 'futbol'::sport_type, 170, 4.5, 2, 'https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&w=900&q=80')
    ) as t(name, category, zone, sport, price, rating, fields, image)
  loop
    insert into venues (organization_id, name, description, zone, image_url, rating)
    values (org_id, rec.name, rec.category, rec.zone, rec.image, rec.rating)
    returning id into v_id;

    for i in 1..rec.fields loop
      insert into courts (venue_id, organization_id, name, sport, category, price_per_hour)
      values (v_id, org_id, rec.name || ' - Cancha ' || i, rec.sport, rec.category, rec.price)
      returning id into c_id;

      -- Horario de apertura 08:00-23:00 todos los dias (0..6).
      insert into court_operating_hours (court_id, day_of_week, open_time, close_time)
      select c_id, d, time '08:00', time '23:00'
      from generate_series(0, 6) as d;
    end loop;
  end loop;
end $$;

-- Reservas de ejemplo (de invitado) sobre la primera cancha sembrada.
do $$
declare
  org_id     uuid := '00000000-0000-0000-0000-000000000001';
  the_court  uuid;
  the_venue  uuid;
begin
  select c.id, c.venue_id into the_court, the_venue
  from courts c
  where c.organization_id = org_id
  order by c.created_at
  limit 1;

  if the_court is not null then
    insert into reservations (
      organization_id, venue_id, court_id,
      guest_name, guest_phone, notes,
      starts_at, ends_at,
      status, price_total, payment_method, payment_status
    )
    values (
      org_id, the_venue, the_court,
      'Carlos Rojas', '70000000', 'Reserva por WhatsApp',
      (current_date + interval '1 day' + time '19:00') at time zone 'America/La_Paz',
      (current_date + interval '1 day' + time '20:30') at time zone 'America/La_Paz',
      'confirmed', 270, 'qr', 'paid'
    );
  end if;
end $$;
