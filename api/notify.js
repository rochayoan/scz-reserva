export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { venueName, courtName, guestName, guestPhone, startsAt, endsAt, price, status } = req.body;

    if (!venueName || !guestName) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const apiKey = process.env.KAPSO_API_KEY;
    const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID;
    const ownerPhone = process.env.KAPSO_OWNER_NUMBER || "59172654203";

    if (!apiKey || !phoneNumberId) {
      console.warn("WhatsApp no configurado (KAPSO_API_KEY o KAPSO_PHONE_NUMBER_ID faltantes)");
      return res.status(200).json({ sent: false, reason: "WhatsApp not configured" });
    }

    // Formatear fechas
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);
    const fecha = startDate.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
    });
    const horaInicio = startDate.toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const horaFin = endDate.toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `🆕 *Nueva reserva recibida*

━━━━━━━━━━━━━
🏟️ *${venueName}*
${courtName ? `🎾 *${courtName}*\n` : ""}👤 *${guestName}*
${guestPhone ? `📱 ${guestPhone}\n` : ""}📅 *${fecha}* — ${horaInicio} a ${horaFin}
💰 *Bs ${price}*
📌 *${status === "pending" ? "Pendiente de confirmación" : status}*
━━━━━━━━━━━━━

✅ Confírmala desde tu panel:
🔗 scz-reserva.vercel.app/admin/reservas`;

    // Enviar vía Kapso WhatsApp API
    const url = `https://api.kapso.ai/meta/whatsapp/v24.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: ownerPhone,
        type: "text",
        text: { body: message, preview_url: false },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error enviando WhatsApp:", result);
      return res.status(200).json({ sent: false, error: result });
    }

    return res.status(200).json({ sent: true, messageId: result?.messages?.[0]?.id });
  } catch (err) {
    console.error("Error en notify:", err);
    return res.status(500).json({ error: err.message });
  }
}
