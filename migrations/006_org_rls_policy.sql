-- Permitir a cualquiera ver datos básicos de organizaciones (nombre, QR)
-- Esto es necesario para que el QR de pago se muestre en el booking
CREATE POLICY "Anyone can read org basic info"
ON public.organizations
FOR SELECT
TO anon
USING (true);
