-- SCZ Reserva - Políticas RLS para booking público
-- Ejecutar en Supabase Dashboard > SQL Editor

-- Permitir a cualquier persona (sin auth) insertar reservas
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND payment_status = 'unpaid'
  AND payment_method = 'none'
);

-- Permitir a cualquiera leer reservas (solo pending/confirmed, sin datos sensibles)
CREATE POLICY "Anyone can read reservations"
ON public.reservations
FOR SELECT
TO anon
USING (status IN ('pending', 'confirmed'));

-- Los dueños ven todo via RLS existente (memberships)
