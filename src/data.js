// Data for courts in Santa Cruz de la Sierra
export const courts = [
  {
    id: 1,
    name: "Pentagol Complejo Deportivo",
    sport: "Fútbol",
    category: "Fútbol 5, 6, 7 y 8",
    zone: "Santa Cruz de la Sierra",
    price: 180,
    rating: 4.8,
    fields: 4,
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80",
    times: ["18:00", "19:00", "20:00", "21:00"],
    featured: true,
  },
  {
    id: 2,
    name: "La Bombonera",
    sport: "Fútbol",
    category: "Cancha sintética",
    zone: "Av. Banzer, Zona Norte",
    price: 160,
    rating: 4.6,
    fields: 1,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    times: ["17:00", "18:30", "20:00", "22:00"],
    featured: false,
  },
  {
    id: 3,
    name: "Santa Cruz Padel Club",
    sport: "Pádel",
    category: "2 cubiertas y 2 al aire libre",
    zone: "Barrio La Madre, entre 3er y 4to anillo",
    price: 120,
    rating: 4.9,
    fields: 4,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80",
    times: ["16:00", "17:30", "19:00", "20:30"],
    featured: true,
  },
  {
    id: 4,
    name: "Costanera Pádel Club",
    sport: "Pádel",
    category: "Club de pádel",
    zone: "Av. 4to Anillo, atrás del Ventura Mall",
    price: 130,
    rating: 4.8,
    fields: 8,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80",
    times: ["15:00", "18:00", "19:30", "21:00"],
    featured: false,
  },
  {
    id: 5,
    name: "Club de Tenis Santa Cruz",
    sport: "Tenis",
    category: "Tenis y pádel",
    zone: "Av. Taruma #2120",
    price: 110,
    rating: 4.7,
    fields: 6,
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80",
    times: ["07:00", "09:00", "18:00", "20:00"],
    featured: false,
  },
  {
    id: 6,
    name: "Las Palmas Canchas Sintéticas",
    sport: "Fútbol",
    category: "Canchas sintéticas",
    zone: "Doble vía La Guardia, entre 3er y 4to anillo",
    price: 170,
    rating: 4.5,
    fields: 2,
    image: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&w=900&q=80",
    times: ["18:00", "19:00", "21:00", "22:00"],
    featured: false,
  },
];

export const stats = [
  { label: "Reservas gestionadas", value: "+1.240" },
  { label: "Complejos piloto", value: "18" },
  { label: "Zonas cubiertas", value: "10" },
];

export const benefitsUser = [
  { icon: "Search", text: "Busca por deporte, zona y horario" },
  { icon: "Tag", text: "Compara precios antes de reservar" },
  { icon: "Zap", text: "Confirma tu cancha en segundos" },
  { icon: "CreditCard", text: "Paga por QR y evita perder tu turno" },
];

export const benefitsOwner = [
  { icon: "ClipboardCheck", text: "Evita doble reserva y desorden" },
  { icon: "MonitorSmartphone", text: "Administra horarios desde un panel web" },
  { icon: "TrendingDown", text: "Reduce cancelaciones de último minuto" },
  { icon: "TrendingUp", text: "Aumenta visibilidad en Santa Cruz" },
];

export const problems = [
  {
    icon: "Smartphone",
    title: "Reservas por WhatsApp",
    text: "Coordinar canchas por mensajes genera confusión, doble reserva y pérdida de clientes.",
  },
  {
    icon: "Clock",
    title: "Pérdida de tiempo",
    text: "Llamar, esperar confirmación y preguntar por disponibilidad es lento e ineficiente.",
  },
  {
    icon: "BarChart3",
    title: "Desorganización total",
    text: "Sin un sistema centralizado, los complejos pierden ingresos y los jugadores pierden turnos.",
  },
  {
    icon: "CalendarX2",
    title: "Doble reserva",
    text: "Dos equipos para el mismo horario. Sin sistema digital, los conflictos son constantes.",
  },
];

export const steps = [
  { icon: "Search", title: "Busca", text: "Elige deporte, zona y fecha." },
  { icon: "Clock", title: "Selecciona", text: "Revisa horarios disponibles en tiempo real." },
  { icon: "CreditCard", title: "Paga", text: "Confirma con QR digital al instante." },
  { icon: "Goal", title: "Juega", text: "Llega a la cancha y disfruta tu partido." },
];

export const adminReservations = [
  { client: "Carlos Rojas", court: "Fútbol 7 · Cancha A", time: "19:00", payment: "QR", status: "Confirmado" },
  { client: "María Villanueva", court: "Pádel 2 · Cubierta", time: "20:30", payment: "QR", status: "Confirmado" },
  { client: "Luis Antezana", court: "Tenis 1 · Exterior", time: "18:00", payment: "Pendiente", status: "En espera" },
  { client: "Ana Gutiérrez", court: "Fútbol 5 · Cancha B", time: "21:00", payment: "QR", status: "Confirmado" },
  { client: "Roberto Paz", court: "Pádel 1 · Aire libre", time: "17:30", payment: "Transferencia", status: "Confirmado" },
];
