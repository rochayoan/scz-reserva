-- =============================================================================
-- 20260623000004_venues_courts.sql
-- Complejos deportivos (venues) -> canchas (courts) -> horarios de apertura.
-- Incluye FKs compuestas para garantizar la coherencia del organization_id
-- denormalizado (no puede haber una cancha cuyo tenant difiera del de su complejo).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- venues: complejo deportivo. Pertenece a una organizacion (tenant).
-- ---------------------------------------------------------------------------
create table venues (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name            text not null,
  description     text,
  zone            text,
  address         text,
  lat             double precision,
  lng             double precision,
  phone           text,
  image_url       text,
  rating          numeric(2, 1),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Apoyo para la FK compuesta desde courts (id + organization_id).
  constraint venues_id_org_uk unique (id, organization_id)
);

create index venues_org_idx  on venues (organization_id);
create index venues_zone_idx on venues (zone);

-- ---------------------------------------------------------------------------
-- courts: cancha individual dentro de un complejo.
-- organization_id se denormaliza desde el venue y se amarra con FK compuesta.
-- ---------------------------------------------------------------------------
create table courts (
  id              uuid not null default gen_random_uuid(),
  venue_id        uuid not null,
  organization_id uuid not null,
  name            text not null,
  sport           sport_type not null,
  category        text,
  price_per_hour  numeric(10, 2) not null,
  surface         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint courts_pkey primary key (id),
  constraint courts_price_chk check (price_per_hour >= 0),

  -- El venue debe pertenecer a la MISMA organizacion (integridad de tenant).
  constraint courts_venue_org_fk
    foreign key (venue_id, organization_id)
    references venues (id, organization_id) on delete cascade,

  -- Apoyo para la FK compuesta desde reservations (id + venue_id + organization_id).
  constraint courts_id_venue_org_uk unique (id, venue_id, organization_id)
);

create index courts_venue_idx on courts (venue_id);
create index courts_org_idx   on courts (organization_id);
create index courts_sport_idx on courts (sport);

-- ---------------------------------------------------------------------------
-- court_operating_hours: horarios de apertura por dia de la semana.
-- Se permiten varios rangos por dia (manana / noche) => sin unique por dia.
-- La disponibilidad real = horario abierto menos reservas existentes.
-- ---------------------------------------------------------------------------
create table court_operating_hours (
  id          uuid primary key default gen_random_uuid(),
  court_id    uuid not null references courts (id) on delete cascade,
  day_of_week smallint not null,  -- 0=domingo ... 6=sabado
  open_time   time not null,
  close_time  time not null,

  constraint coh_dow_chk   check (day_of_week between 0 and 6),
  constraint coh_range_chk check (close_time > open_time)
);

create index coh_court_idx on court_operating_hours (court_id, day_of_week);
