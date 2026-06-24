-- =============================================================================
-- 20260623000005_reservations.sql
-- Reservas de duracion variable con anti-doble-reserva a nivel de base de datos.
-- =============================================================================

create table reservations (
  id              uuid primary key default gen_random_uuid(),

  -- Tenant denormalizado (amarrado a la cancha via FK compuesta mas abajo).
  organization_id uuid not null,
  venue_id        uuid not null,
  court_id        uuid not null,

  -- Titular de la reserva: usuario registrado (nullable) o invitado.
  user_id     uuid references profiles (id) on delete set null,
  guest_name  text,
  guest_phone text,
  notes       text,

  -- Ventana de la reserva. 'during' es una columna generada usada por el
  -- exclusion constraint. Rango semiabierto [inicio, fin) => reservas
  -- contiguas (20:30 fin / 20:30 inicio) NO se consideran solapadas.
  starts_at timestamptz not null,
  ends_at   timestamptz not null,
  during    tstzrange generated always as (tstzrange(starts_at, ends_at, '[)')) stored,

  status         reservation_status not null default 'pending',
  price_total    numeric(10, 2) not null,
  payment_method payment_method not null default 'none',
  payment_status payment_status not null default 'unpaid',

  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- La ventana debe ser valida.
  constraint reservations_range_chk check (ends_at > starts_at),

  -- Toda reserva tiene titular: cuenta registrada o, al menos, nombre de invitado.
  constraint reservations_holder_chk check (user_id is not null or guest_name is not null),

  -- Coherencia de tenant: la cancha + complejo + organizacion deben encajar.
  constraint reservations_court_fk
    foreign key (court_id, venue_id, organization_id)
    references courts (id, venue_id, organization_id) on delete restrict,

  -- ANTI-DOBLE-RESERVA (clave del diseno):
  -- Dos reservas ACTIVAS (pending/confirmed) sobre la MISMA cancha cuyas
  -- ventanas se SOLAPAN son rechazadas atomicamente por la base, incluso bajo
  -- concurrencia. Las canceladas/completadas/no_show no bloquean el horario
  -- porque el constraint es parcial (clausula WHERE).
  constraint reservations_no_overlap
    exclude using gist (
      court_id with =,
      during   with &&
    )
    where (status in ('pending', 'confirmed'))
);

-- Indices de apoyo para consultas frecuentes.
-- (El exclusion constraint ya crea el indice GiST sobre court_id + during.)
create index reservations_org_start_idx   on reservations (organization_id, starts_at);
create index reservations_court_start_idx on reservations (court_id, starts_at);
create index reservations_user_idx        on reservations (user_id);
create index reservations_status_idx      on reservations (status);
