-- =============================================================================
-- 20260628000001_qr_payment.sql
-- Agrega soporte para QR de pago por organizacion.
-- =============================================================================

alter table organizations
  add column if not exists qr_image_url text;

-- Opcional: actualizar la organizacion demo con un QR por defecto
-- update organizations set qr_image_url = 'URL_DEL_QR_AQUI'
-- where slug = 'scz-demo';
