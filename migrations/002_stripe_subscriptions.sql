-- SCZ Reserva - Stripe + Suscripciones
-- Ejecutar en Supabase Dashboard > SQL Editor

-- Agregar columnas para Stripe y suscripciones a la tabla organizations
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Actualizar la organización demo con trial de 14 días
UPDATE organizations
SET trial_ends_at = NOW() + INTERVAL '14 days',
    subscription_plan = 'trial',
    subscription_status = 'trialing'
WHERE id = '00000000-0000-0000-0000-000000000001'
  AND trial_ends_at IS NULL;

-- Crear índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_org_stripe_customer ON organizations(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_org_stripe_subscription ON organizations(stripe_subscription_id);
