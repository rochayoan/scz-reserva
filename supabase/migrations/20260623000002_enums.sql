-- =============================================================================
-- 20260623000002_enums.sql
-- Tipos enumerados del dominio.
-- =============================================================================

-- Deportes del MVP (segun CLAUDE.md: solo Futbol, Padel, Tenis).
-- Ampliar en el futuro con: alter type sport_type add value 'volley';
create type sport_type as enum ('futbol', 'padel', 'tenis');

-- Rol de un usuario dentro de una organizacion (tenant).
create type member_role as enum ('owner', 'manager', 'staff');

-- Estado de una reserva.
create type reservation_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

-- Metodo de pago de la reserva.
create type payment_method as enum ('qr', 'cash', 'transfer', 'card', 'none');

-- Estado del pago de la reserva.
create type payment_status as enum ('unpaid', 'pending', 'paid', 'refunded');

-- Plan de suscripcion de la organizacion.
create type subscription_plan as enum ('trial', 'basic', 'pro');

-- Estado de la suscripcion de la organizacion.
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');
