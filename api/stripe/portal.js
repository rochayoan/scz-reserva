import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { orgId, returnUrl } = req.body;

    if (!orgId) {
      return res.status(400).json({ error: "Falta orgId" });
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", orgId)
      .single();

    if (!org?.stripe_customer_id) {
      return res.status(400).json({ error: "No hay customer de Stripe" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: returnUrl || `${req.headers.origin}/admin/configuracion`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating portal session:", err);
    return res.status(500).json({ error: err.message });
  }
}
