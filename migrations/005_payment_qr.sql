-- Agregar columna para QR de pago por organización
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS payment_qr_url TEXT;
