import { Search, ChevronDown, Star, MapPin } from "lucide-react";

// HeroPreview: mini-mockup del producto que protagoniza el Hero.
// PRESENTACIONAL y DESACOPLADO a proposito:
//  - no importa nada de components/booking/ ni de lib/dataService.
//  - usa data ILUSTRATIVA local (no el catalogo real): es una ilustracion
//    del producto, no el listado. Cambiar CourtList/dataService no lo afecta.
//  - se mantiene en sync VISUAL porque usa los mismos tokens del Design System
//    (radios, colores, bordes, sombras). Ver DESIGN_SYSTEM.md.
const PREVIEW_COURTS = [
  { name: "Pentagol", sport: "Fútbol", zone: "Centro", price: 180, rating: 4.8 },
  { name: "SC Padel Club", sport: "Pádel", zone: "La Madre", price: 120, rating: 4.9 },
  { name: "La Bombonera", sport: "Fútbol", zone: "Zona Norte", price: 160, rating: 4.6 },
  { name: "Club de Tenis", sport: "Tenis", zone: "Av. Taruma", price: 110, rating: 4.7 },
];

function MiniCourtCard({ court }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="relative flex h-14 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 dark:from-emerald-950/40 dark:to-slate-800">
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-900/80 dark:text-slate-300">
          {court.sport}
        </span>
      </div>
      <div className="p-2.5">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-[11px] font-semibold text-slate-900 dark:text-white">
            {court.name}
          </p>
          <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" strokeWidth={1.75} />
            {court.rating}
          </span>
        </div>
        <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400">
          <MapPin className="h-2.5 w-2.5" strokeWidth={1.75} />
          {court.zone}
        </p>
        <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Bs {court.price}
        </p>
      </div>
    </div>
  );
}

export default function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-950">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <span className="ml-2 text-[10px] text-slate-400">scz-reserva.app/canchas</span>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Mini filter row */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 flex-1 items-center gap-1.5 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-400 dark:border-slate-800">
            <Search className="h-3 w-3" strokeWidth={1.75} />
            Buscar cancha o zona...
          </div>
          <div className="flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Zona
            <ChevronDown className="h-3 w-3" strokeWidth={1.75} />
          </div>
        </div>

        {/* Mini court grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {PREVIEW_COURTS.map((court) => (
            <MiniCourtCard key={court.name} court={court} />
          ))}
        </div>
      </div>
    </div>
  );
}
