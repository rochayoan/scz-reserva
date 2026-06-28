import {
  courts,
  stats,
  benefitsUser,
  benefitsOwner,
  problems,
  steps,
  adminReservations,
} from "../data";
import { supabase } from "./supabaseClient";

const SPORT_LABELS = { futbol: "Fútbol", padel: "Pádel", tenis: "Tenis" };

function getBoliviaDayOfWeek() {
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/La_Paz",
    weekday: "short",
  }).format(new Date());
  return map[weekday] ?? new Date().getDay();
}

function buildHourlySlots(openTime, closeTime) {
  const openHour = parseInt(openTime.slice(0, 2), 10);
  const closeHour = parseInt(closeTime.slice(0, 2), 10);
  const slots = [];
  for (let h = openHour; h < closeHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

// Aproximacion visual estatica (horas en punto entre apertura y cierre).
// No representa disponibilidad real: eso llega en la etapa de reservas.
function generateTimesForCourt(court) {
  const hours = court.court_operating_hours ?? [];
  if (hours.length === 0) return [];

  const todayDow = getBoliviaDayOfWeek();
  const todayHours = hours.find((h) => h.day_of_week === todayDow) ?? hours[0];
  return buildHourlySlots(todayHours.open_time, todayHours.close_time);
}

// Un venue real puede tener varias canchas; la UI espera una tarjeta plana
// por "complejo" (igual que el mock). Se toma la cancha mas barata como
// representativa para sport/category/price; "featured" no existe en el
// esquema real, queda fija en false.
function mapVenueToCourtCard(venue) {
  const repCourt = venue.courts.reduce((cheapest, c) =>
    Number(c.price_per_hour) < Number(cheapest.price_per_hour) ? c : cheapest
  );

  return {
    id: venue.id,
    name: venue.name,
    sport: SPORT_LABELS[repCourt.sport] ?? repCourt.sport,
    category: repCourt.category ?? "",
    zone: venue.zone ?? "",
    price: Number(repCourt.price_per_hour),
    rating: venue.rating != null ? Number(venue.rating) : null,
    fields: venue.courts.length,
    image: venue.image_url ?? "",
    times: generateTimesForCourt(repCourt),
    featured: false,
    organization_id: venue.organization_id,
    qr_image_url: venue.organizations?.qr_image_url || null,
  };
}

async function fetchVenuesAsCourts() {
  const { data, error } = await supabase
    .from("venues")
    .select(
      `
    id, name, zone, image_url, rating, organization_id,
    organizations ( qr_image_url ),
    courts (
        id, sport, category, price_per_hour,
        court_operating_hours ( day_of_week, open_time, close_time )
      )
    `
    )
    .eq("is_active", true);

  if (error) throw error;
  if (!data) return [];

  return data
    .filter((venue) => Array.isArray(venue.courts) && venue.courts.length > 0)
    .map(mapVenueToCourtCard);
}

// Interruptor manual para forzar mock independientemente de si Supabase
// esta configurado (pruebas / rollback rapido sin tocar mas nada).
const USE_MOCK_DATA = false;

// getCourts() es async: intenta Supabase, cae a mock si falla o si la
// consulta no devuelve nada todavia (tabla vacia no se trata como error).
// El llamador (App.jsx) decide que hacer con `error` (ej. aviso no invasivo).
export async function getCourts() {
  if (USE_MOCK_DATA || !supabase) {
    return { data: courts, error: null };
  }

  try {
    const real = await fetchVenuesAsCourts();
    if (real.length === 0) return { data: courts, error: null };
    return { data: real, error: null };
  } catch (err) {
    return { data: courts, error: err };
  }
}

export function getStats() {
  return stats;
}

export function getBenefitsUser() {
  return benefitsUser;
}

export function getBenefitsOwner() {
  return benefitsOwner;
}

export function getProblems() {
  return problems;
}

export function getSteps() {
  return steps;
}

export function getAdminReservations() {
  return adminReservations;
}
