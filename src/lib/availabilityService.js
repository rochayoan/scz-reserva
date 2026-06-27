import { supabase } from "./supabaseClient";

/**
 * Genera slots de hora en punto entre open_time y close_time.
 * Ej: "08:00" a "17:00" → ["08:00", "09:00", ..., "16:00"]
 */
function buildHourlySlots(openTime, closeTime) {
  const openHour = parseInt(openTime.slice(0, 2), 10);
  const closeHour = parseInt(closeTime.slice(0, 2), 10);
  const slots = [];
  for (let h = openHour; h < closeHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

/**
 * Obtiene los slots disponibles para una cancha en una fecha específica.
 * Calcula: horarios_de_apertura - reservas_existentes
 */
export async function getAvailableSlots(courtId, date) {
  const dayOfWeek = date.getDay(); // 0=domingo ... 6=sábado

  // 1. Obtener operating hours para ese día
  const { data: hours } = await supabase
    .from("court_operating_hours")
    .select("*")
    .eq("court_id", courtId)
    .eq("day_of_week", dayOfWeek);

  if (!hours || hours.length === 0) return [];

  // 2. Construir todos los slots posibles
  const allSlots = hours.flatMap((h) => buildHourlySlots(h.open_time, h.close_time));

  // 3. Obtener reservas existentes para esa cancha en esa fecha
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: reservations } = await supabase
    .from("reservations")
    .select("starts_at, ends_at")
    .eq("court_id", courtId)
    .in("status", ["pending", "confirmed"])
    .gte("starts_at", dayStart.toISOString())
    .lte("starts_at", dayEnd.toISOString());

  // 4. Marcar slots ocupados
  const busySlots = new Set();
  if (reservations) {
    for (const r of reservations) {
      const startHour = new Date(r.starts_at).getHours();
      const endHour = new Date(r.ends_at).getHours();
      for (let h = startHour; h < endHour; h++) {
        busySlots.add(`${String(h).padStart(2, "0")}:00`);
      }
    }
  }

  // 5. Devolver solo slots libres
  return allSlots.filter((slot) => !busySlots.has(slot));
}

/**
 * Obtiene venues + canchas con disponibilidad calculada para hoy.
 * Usado por el frontend público.
 */
export async function getVenuesWithAvailability(date = new Date()) {
  const { data: venues } = await supabase
    .from("venues")
    .select(
      `
      id, name, zone, image_url, rating,
      courts (
        id, name, sport, category, price_per_hour, surface,
        venue_id, organization_id
      )
    `
    )
    .eq("is_active", true);

  if (!venues) return [];

  const result = [];

  for (const venue of venues) {
    if (!venue.courts || venue.courts.length === 0) continue;

    const courtsWithSlots = [];

    for (const court of venue.courts) {
      const availableSlots = await getAvailableSlots(court.id, date);
      courtsWithSlots.push({
        ...court,
        availableSlots,
        hasAvailability: availableSlots.length > 0,
      });
    }

    // Usar la cancha más barata como representativa
    const rep = courtsWithSlots.reduce((cheapest, c) =>
      Number(c.price_per_hour) < Number(cheapest.price_per_hour) ? c : cheapest
    );

    result.push({
      id: venue.id,
      name: venue.name,
      zone: venue.zone || "",
      image: venue.image_url || "",
      rating: venue.rating,
      sport: rep.sport,
      category: rep.category || "",
      price: Number(rep.price_per_hour),
      fields: courtsWithSlots.length,
      times: rep.availableSlots,
      featured: false,
      courts: courtsWithSlots,
    });
  }

  return result;
}
