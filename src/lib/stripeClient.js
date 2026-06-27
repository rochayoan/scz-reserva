const API_BASE = import.meta.env.DEV
  ? "http://localhost:5173"
  : "";

/**
 * Crea una sesión de Stripe Checkout y redirige al usuario
 */
export async function createCheckoutSession(orgId) {
  const origin = window.location.origin;
  const res = await fetch(`${API_BASE}/api/stripe/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgId,
      successUrl: `${origin}/admin/precios?success=true`,
      cancelUrl: `${origin}/admin/precios?canceled=true`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al crear sesión de pago");
  }

  const data = await res.json();
  return data.url;
}

/**
 * Abre el portal de facturación de Stripe (cambiar plan, tarjeta, cancelar)
 */
export async function openBillingPortal(orgId) {
  const origin = window.location.origin;
  const res = await fetch(`${API_BASE}/api/stripe/portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgId,
      returnUrl: `${origin}/admin/configuracion`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al abrir portal");
  }

  const data = await res.json();
  return data.url;
}
