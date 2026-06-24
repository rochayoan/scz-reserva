-- =============================================================================
-- 20260623000007_rls_policies.sql
-- Row Level Security: aislamiento por tenant + catalogo publico de canchas.
-- Depende de auth_org_ids() (migracion de funciones).
-- =============================================================================

alter table organizations        enable row level security;
alter table profiles             enable row level security;
alter table memberships          enable row level security;
alter table venues               enable row level security;
alter table courts               enable row level security;
alter table court_operating_hours enable row level security;
alter table reservations         enable row level security;

-- ---------------------------------------------------------------------------
-- organizations: solo miembros de la propia organizacion.
-- ---------------------------------------------------------------------------
create policy organizations_select on organizations
  for select to authenticated
  using (id in (select auth_org_ids()));

create policy organizations_update on organizations
  for update to authenticated
  using (id in (select auth_org_ids()))
  with check (id in (select auth_org_ids()));

-- ---------------------------------------------------------------------------
-- profiles: cada usuario ve y edita su propio perfil.
-- ---------------------------------------------------------------------------
create policy profiles_select_own on profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_update_own on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_insert_own on profiles
  for insert to authenticated
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- memberships: visibles para los miembros de la organizacion.
-- ---------------------------------------------------------------------------
create policy memberships_select on memberships
  for select to authenticated
  using (organization_id in (select auth_org_ids()));

-- ---------------------------------------------------------------------------
-- venues: catalogo publico (activos) para todos; gestion solo para el tenant.
-- ---------------------------------------------------------------------------
create policy venues_select_public on venues
  for select to anon, authenticated
  using (is_active = true or organization_id in (select auth_org_ids()));

create policy venues_write on venues
  for all to authenticated
  using (organization_id in (select auth_org_ids()))
  with check (organization_id in (select auth_org_ids()));

-- ---------------------------------------------------------------------------
-- courts: catalogo publico (activos) para todos; gestion solo para el tenant.
-- ---------------------------------------------------------------------------
create policy courts_select_public on courts
  for select to anon, authenticated
  using (is_active = true or organization_id in (select auth_org_ids()));

create policy courts_write on courts
  for all to authenticated
  using (organization_id in (select auth_org_ids()))
  with check (organization_id in (select auth_org_ids()));

-- ---------------------------------------------------------------------------
-- court_operating_hours: lectura publica; gestion solo el tenant dueno de la cancha.
-- ---------------------------------------------------------------------------
create policy coh_select_public on court_operating_hours
  for select to anon, authenticated
  using (true);

create policy coh_write on court_operating_hours
  for all to authenticated
  using (
    exists (
      select 1 from courts c
      where c.id = court_operating_hours.court_id
        and c.organization_id in (select auth_org_ids())
    )
  )
  with check (
    exists (
      select 1 from courts c
      where c.id = court_operating_hours.court_id
        and c.organization_id in (select auth_org_ids())
    )
  );

-- ---------------------------------------------------------------------------
-- reservations:
--  - el cliente ve y gestiona las suyas (user_id = auth.uid()),
--  - el staff ve y gestiona las de su organizacion (incluye invitados).
-- ---------------------------------------------------------------------------
create policy reservations_select on reservations
  for select to authenticated
  using (
    user_id = auth.uid()
    or organization_id in (select auth_org_ids())
  );

create policy reservations_insert on reservations
  for insert to authenticated
  with check (
    user_id = auth.uid()
    or organization_id in (select auth_org_ids())
  );

create policy reservations_update on reservations
  for update to authenticated
  using (
    user_id = auth.uid()
    or organization_id in (select auth_org_ids())
  )
  with check (
    user_id = auth.uid()
    or organization_id in (select auth_org_ids())
  );
