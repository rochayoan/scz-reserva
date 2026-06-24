-- =============================================================================
-- 20260623000006_functions_triggers.sql
-- Funciones y triggers: updated_at, alta de perfil, helper de RLS y
-- validacion de horario de apertura de reservas.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- set_updated_at(): mantiene la columna updated_at en cada UPDATE.
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated_at
  before update on organizations
  for each row execute function set_updated_at();

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_venues_updated_at
  before update on venues
  for each row execute function set_updated_at();

create trigger trg_courts_updated_at
  before update on courts
  for each row execute function set_updated_at();

create trigger trg_reservations_updated_at
  before update on reservations
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- handle_new_user(): crea automaticamente un profile cuando se registra un
-- usuario en auth.users (Supabase Auth).
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- auth_org_ids(): devuelve los IDs de organizacion a los que pertenece el
-- usuario actual. Usado por las politicas RLS para filtrar por tenant.
-- ---------------------------------------------------------------------------
create or replace function auth_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from memberships where user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- validate_reservation_hours(): valida que la ventana de la reserva caiga
-- dentro de algun rango de court_operating_hours del dia correspondiente.
-- Se evalua en hora local de Bolivia (America/La_Paz).
-- Si la cancha no tiene horarios definidos, no se valida (permite todo).
-- Nota: asume reservas dentro del mismo dia local (no cruzan medianoche).
-- ---------------------------------------------------------------------------
create or replace function validate_reservation_hours()
returns trigger
language plpgsql
as $$
declare
  local_start timestamp := new.starts_at at time zone 'America/La_Paz';
  local_end   timestamp := new.ends_at   at time zone 'America/La_Paz';
  dow         smallint  := extract(dow from local_start)::smallint;
  fits        boolean;
begin
  -- Si la cancha no define horarios, no se restringe.
  if not exists (select 1 from court_operating_hours where court_id = new.court_id) then
    return new;
  end if;

  select exists (
    select 1
    from court_operating_hours h
    where h.court_id = new.court_id
      and h.day_of_week = dow
      and h.open_time  <= local_start::time
      and h.close_time >= local_end::time
  ) into fits;

  if not fits then
    raise exception
      'La reserva (% - %) esta fuera del horario de apertura de la cancha',
      new.starts_at, new.ends_at
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger trg_reservations_validate_hours
  before insert or update of starts_at, ends_at, court_id on reservations
  for each row execute function validate_reservation_hours();
