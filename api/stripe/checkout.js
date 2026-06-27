import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Precio mensual del plan (en centavos)
const PRICE_AMOUNT = 2900; // $29.00
const PRICE_CURRENCY = "usd";
const PRODUCT_NAME = "SCZ Reserva - Plan Mensual";
const TRIAL_DAYS = 14;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { orgId, successUrl, cancelUrl } = req.body;

    if (!orgId) {
      return res.status(400).json({ error: "Falta orgId" });
    }

    // Obtener datos de la organización
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, stripe_customer_id")
      .eq("id", orgId)
      .single();

    if (orgError || !org) {
      return res.status(404).json({ error: "Organización no encontrada" });
    }

    // Buscar o crear el producto en Stripe
    const products = await stripe.products.list({ active: true, limit: 100 });
    let product = products.data.find((p) => p.name === PRODUCT_NAME);

    if (!product) {
      product = await stripe.products.create({
        name: PRODUCT_NAME,
        description: "Suscripción mensual al panel de administración SCZ Reserva",
      });
    }

    // Buscar o crear el precio
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 10,
    });
    let price = prices.data.find(
      (p) => p.unit_amount === PRICE_AMOUNT && p.currency === PRICE_CURRENCY
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: PRICE_AMOUNT,
        currency: PRICE_CURRENCY,
        recurring: { interval: "month" },
      });
    }

    // Crear o reusar customer de Stripe
    let customerId = org.stripe_customer_id;

    if (!customerId) {
      const { data: membership } = await supabase
        .from("memberships")
        .select("user_id")
        .eq("organization_id", orgId)
        .eq("role", "owner")
        .single();

      let customerEmail = null;
      if (membership) {
        const { data: user } = await supabase.auth.admin.getUserById(
          membership.user_id
        );
        customerEmail = user?.user?.email;
      }

      const customer = await stripe.customers.create({
        name: org.name,
        email: customerEmail,
        metadata: { org_id: orgId },
      });
      customerId = customer.id;

      // Guardar customer ID en la organización
      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq("id", orgId);
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { org_id: orgId },
      },
      success_url: successUrl || `${req.headers.origin}/admin/precios?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/admin/precios?canceled=true`,
      client_reference_id: orgId,
      metadata: { org_id: orgId },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return res.status(500).json({ error: err.message });
  }
}
