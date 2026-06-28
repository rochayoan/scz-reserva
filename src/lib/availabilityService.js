import { supabase } from "./supabaseClient";

/**
 * Genera slots de 30 minutos entre open_time y close_time.
 * Ej: "08:00" a "17:00" → ["08:00","08:30","09:00",...,"16:30"]
 */
function buildSlots(openTime, closeTime) {
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const slots = [];
  for (let m = openMinutes; m < closeMinutes; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
}

/**
 * Convierte un string "HH:MM" a minutos desde medianoche.
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Obtiene los slots disponibles para una cancha/complejo en una fecha específica.
 * Acepta court_id (UUID de cancha) o venue_id (UUID de complejo).
 * Calcula: horarios_de_apertura - reservas_existentes
 * Devuelve slots de 30 minutos.
 */
export async function getAvailableSlots(courtOrVenueId, date) {
  const dayOfWeek = date.getDay(); // 0=domingo ... 6=sábado

  // Obtener court_ids: si es venue, buscar todas sus canchas
  let courtIds = [courtOrVenueId];

  const { data: venueCheck } = await supabase
    .from("venues")
    .select("id")
    .eq("id", courtOrVenueId)
    .limit(1);

  if (venueCheck && venueCheck.length > 0) {
    const { data: courts } = await supabase
      .from("courts")
      .select("id")
      .eq("venue_id", courtOrVenueId)
      .eq("is_active", true);

    if (!courts || courts.length === 0) return [];
    courtIds = courts.map((c) => c.id);
  }

  // 1. Obtener operating hours para ese día para todas las canchas
  const { data: hours } = await supabase
    .from("court_operating_hours")
    .select("court_id, open_time, close_time")
    .in("court_id", courtIds)
    .eq("day_of_week", dayOfWeek);

  if (!hours || hours.length === 0) return [];

  // Generar todos los slots de 30 min combinados de todas las canchas
  const allSlotsSet = new Set();
  for (const h of hours) {
    const slots = buildSlots(h.open_time, h.close_time);
    for (const s of slots) allSlotsSet.add(s);
  }
  const allSlots = [...allSlotsSet].sort();

  // 2. Obtener reservas existentes para todas estas canchas en esa fecha
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: reservations } = await supabase
    .from("reservations")
    .select("starts_at, ends_at")
    .in("court_id", courtIds)
    .in("status", ["pending", "confirmed"])
    .gte("starts_at", dayStart.toISOString())
    .lte("starts_at", dayEnd.toISOString());

  // 3. Marcar slots ocupados (cualquier slot que CAIGA dentro de [start, end) )
  const busySlots = new Set();
  if (reservations) {
    for (const r of reservations) {
      const startMin = new Date(r.starts_at).getHours() * 60 + new Date(r.starts_at).getMinutes();
      const endMin = new Date(r.ends_at).getHours() * 60 + new Date(r.ends_at).getMinutes();
      for (const slot of allSlots) {
        const slotMin = timeToMinutes(slot);
        if (slotMin >= startMin && slotMin < endMin) {
          busySlots.add(slot);
        }
      }
    }
  }

  // 4. Devolver solo slots libres
  return allSlots.filter((slot) => !busySlots.has(slot));
}

/**
 * Verifica si un rango [startTime, endTime) está completamente disponible
 * dentro de los slots libres.
 */
export function isRangeAvailable(availableSlots, startTime, endTime) {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  // Cada slot de 30 min dentro del rango debe estar disponible
  for (let m = startMin; m < endMin; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const slot = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    if (!availableSlots.includes(slot)) return false;
  }
  return true;
}
