-- =============================================================================
-- 20260629000001_payment_reference.sql
-- Agrega columna payment_reference a reservations para que el cliente
-- ingrese el número de referencia de su transferencia bancaria.
-- =============================================================================

alter table reservations
  add column if not exists payment_reference text;

-- Índice para buscar por referencia (útil para el dueño)
create index if not exists reservations_payment_ref_idx
  on reservations (payment_reference)
  where payment_reference is not null;
