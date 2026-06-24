-- =============================================================================
-- 20260624000001_security_hardening.sql
-- Correcciones detectadas por el advisor de seguridad de Supabase tras
-- aplicar el esquema inicial:
--  1) set_updated_at() y validate_reservation_hours() no fijaban search_path
--     (riesgo de "search path injection").
--  2) auth_org_ids() y handle_new_user() quedaban invocables publicamente
--     via /rest/v1/rpc/... (incluso por el rol anon), cuando son helpers
--     internos (uno usado solo dentro de políticas RLS, el otro solo por
--     el trigger de alta de usuario).
-- =============================================================================

-- 1) Fijar search_path en las funciones que no lo tenian.
create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function validate_reservation_hours()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  local_start timestamp := new.starts_at at time zone 'America/La_Paz';
  local_end   timestamp := new.ends_at   at time zone 'America/La_Paz';
  dow         smallint  := extract(dow from local_start)::smallint;
  fits        boolean;
begin
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

-- 2) Revocar ejecucion publica de los helpers internos.
-- auth_org_ids() solo se usa DENTRO de politicas RLS evaluadas por el rol
-- "authenticated"; no necesita ser invocable directamente por anon.
revoke execute on function auth_org_ids() from public;
revoke execute on function auth_org_ids() from anon;
grant  execute on function auth_org_ids() to authenticated;

-- handle_new_user() solo lo invoca el trigger on_auth_user_created; no debe
-- ser invocable por nadie via RPC.
revoke execute on function handle_new_user() from public;
revoke execute on function handle_new_user() from anon;
revoke execute on function handle_new_user() from authenticated;
