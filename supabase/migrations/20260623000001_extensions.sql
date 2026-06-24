-- =============================================================================
-- 20260623000001_extensions.sql
-- Extensiones requeridas por el esquema de SCZ-RESERVA.
-- =============================================================================

-- gen_random_uuid() para claves primarias uuid.
create extension if not exists "pgcrypto";

-- btree_gist permite combinar igualdad (court_id WITH =) con solape de rango
-- (during WITH &&) dentro del mismo indice GiST. Es imprescindible para el
-- exclusion constraint anti-doble-reserva de la tabla reservations.
create extension if not exists "btree_gist";
