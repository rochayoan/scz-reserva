-- =============================================================================
-- 20260623000003_core_tenancy.sql
-- Nucleo de multitenencia: organizations (tenant), profiles (usuarios),
-- memberships (usuario <-> organizacion con rol).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- organizations: el tenant raiz. La cuenta de negocio que paga la suscripcion.
-- ---------------------------------------------------------------------------
create table organizations (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  slug                    text not null unique,
  subscription_plan       subscription_plan   not null default 'trial',
  subscription_status     subscription_status not null default 'trialing',
  subscription_period_end timestamptz,
  created_at              timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  -- Clave unica de apoyo para FKs compuestas (integridad de tenant).
  constraint organizations_id_uk unique (id)
);

-- ---------------------------------------------------------------------------
-- profiles: extiende auth.users de Supabase con datos de aplicacion.
-- Se puebla por trigger al crearse un usuario (ver migracion de funciones).
-- Un cliente que solo reserva es un profile SIN membership.
-- ---------------------------------------------------------------------------
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  phone      text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- memberships: define quien es dueno/staff de un tenant.
-- Los clientes finales NO tienen fila aqui.
-- ---------------------------------------------------------------------------
create table memberships (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id         uuid not null references profiles (id) on delete cascade,
  role            member_role not null default 'staff',
  created_at      timestamptz not null default now(),

  constraint memberships_org_user_uk unique (organization_id, user_id)
);

create index memberships_user_idx on memberships (user_id);
create index memberships_org_idx  on memberships (organization_id);
