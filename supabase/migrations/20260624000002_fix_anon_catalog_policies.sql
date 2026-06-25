-- =============================================================================
-- 20260624000002_fix_anon_catalog_policies.sql
-- Corrige una regresion introducida por 20260624000001_security_hardening.sql:
-- esa migracion revoco EXECUTE sobre auth_org_ids() al rol anon, pero las
-- politicas venues_select_public / courts_select_public seguian evaluando
-- auth_org_ids() dentro de un OR tambien para el rol anon. Postgres exige
-- permiso de EXECUTE para evaluar la clausula aunque la otra rama (is_active
-- = true) sea la que finalmente aplique, asi que el catalogo publico quedo
-- inaccesible para anon ("permission denied for function auth_org_ids").
--
-- Fix: separar la politica en dos por rol, en vez de una compartida:
--  - anon: solo puede ver catalogo activo (is_active = true), sin tocar
--    auth_org_ids() en absoluto.
--  - authenticated: ademas puede ver sus propios registros inactivos
--    (los de su organizacion), usando auth_org_ids() como antes.
-- =============================================================================

drop policy venues_select_public on venues;

create policy venues_select_public_anon on venues
  for select to anon
  using (is_active = true);

create policy venues_select_public_authenticated on venues
  for select to authenticated
  using (is_active = true or organization_id in (select auth_org_ids()));

drop policy courts_select_public on courts;

create policy courts_select_public_anon on courts
  for select to anon
  using (is_active = true);

create policy courts_select_public_authenticated on courts
  for select to authenticated
  using (is_active = true or organization_id in (select auth_org_ids()));
