import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const now = new Date().toISOString();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orgId = session.metadata?.org_id || session.client_reference_id;
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        if (!orgId) {
          console.error("No orgId in session metadata");
          return res.status(200).json({ received: true });
        }

        // Actualizar organización: suscripción activa
        const { error: updateError } = await supabase
          .from("organizations")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_plan: "monthly",
            subscription_status: "active",
            updated_at: now,
          })
          .eq("id", orgId);

        if (updateError) {
          console.error("Error updating org:", updateError);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const status = subscription.status;

        let subscriptionStatus = "inactive";
        if (status === "active" || status === "trialing") {
          subscriptionStatus = "active";
        } else if (status === "past_due") {
          subscriptionStatus = "past_due";
        } else if (status === "canceled" || status === "unpaid") {
          subscriptionStatus = "canceled";
        }

        // Buscar org por stripe_subscription_id
        const { data: orgs } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_subscription_id", subscription.id);

        if (orgs && orgs.length > 0) {
          await supabase
            .from("organizations")
            .update({
              subscription_status: subscriptionStatus,
              updated_at: now,
            })
            .eq("id", orgs[0].id);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const { data: orgs } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_subscription_id", subscription.id);

        if (orgs && orgs.length > 0) {
          await supabase
            .from("organizations")
            .update({
              subscription_status: "canceled",
              updated_at: now,
            })
            .eq("id", orgs[0].id);
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const { data: orgs } = await supabase
            .from("organizations")
            .select("id")
            .eq("stripe_subscription_id", subscriptionId);

          if (orgs && orgs.length > 0) {
            await supabase
              .from("organizations")
              .update({
                subscription_status: "active",
                updated_at: now,
              })
              .eq("id", orgs[0].id);
          }
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const { data: orgs } = await supabase
            .from("organizations")
            .select("id")
            .eq("stripe_subscription_id", subscriptionId);

          if (orgs && orgs.length > 0) {
            await supabase
              .from("organizations")
              .update({
                subscription_status: "past_due",
                updated_at: now,
              })
              .eq("id", orgs[0].id);
          }
        }

        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: err.message });
  }
}
