import { Search, ChevronDown, Star, MapPin, ArrowRight, Flame, SearchX } from "lucide-react";
import { Card, CardContent, Badge, SectionLabel, SectionTitle, SegmentedControl } from "../ui";

// Select estilizado del Design System (altura/radio alineados con inputs y botones).
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={onChange}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-medium text-slate-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={1.75}
      />
    </div>
  );
}

export default function CourtList({
  courts,
  selectedCourt,
  onSelectCourt,
  search,
  setSearch,
  sport,
  setSport,
  zone,
  setZone,
  time,
  setTime,
}) {
  return (
    <section id="canchas" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <SectionLabel>Canchas disponibles</SectionLabel>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <SectionTitle>Encuentra el espacio ideal</SectionTitle>
            <p className="text-sm text-slate-400">
              {courts.length} {courts.length === 1 ? "cancha" : "canchas"}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.75}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cancha o zona..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>

            {/* Sport segmented + zone/time selects */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="-mx-1 overflow-x-auto px-1">
                <SegmentedControl
                  options={["Todos", "Fútbol", "Pádel", "Tenis"]}
                  value={sport}
                  onChange={setSport}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:flex md:shrink-0">
                <FilterSelect
                  label="Filtrar por zona"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  options={["Todas", "Zona Norte", "4to Anillo", "Banzer", "La Guardia"]}
                />
                <FilterSelect
                  label="Filtrar por horario"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  options={["Cualquiera", "Mañana", "Tarde", "Noche"]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Court Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <Card
              key={court.id}
              hover
              onClick={() => {
                onSelectCourt(court);
                document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`group cursor-pointer ${
                selectedCourt.id === court.id
                  ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-950"
                  : ""
              }`}
            >
              <div className="relative">
                <img
                  src={court.image}
                  alt={`${court.name} — ${court.sport} en ${court.zone}`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="sport">{court.sport}</Badge>
                  {court.featured && (
                    <Badge variant="popular">
                      <Flame className="mr-1 h-3 w-3" strokeWidth={2} />
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-tight">{court.name}</h3>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={1.75} />
                    {court.rating}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                  {court.zone}
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400">{court.category}</p>
                    <p className="mt-0.5 text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      Bs {court.price}
                    </p>
                  </div>
                  <p className="text-sm text-slate-400">{court.fields} cancha(s)</p>
                </div>

                {/* Time slots preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {court.times.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                  {court.times.length > 3 && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400 dark:bg-slate-800">
                      +{court.times.length - 3}
                    </span>
                  )}
                </div>

                {/* Afford de accion — la card entera es clickeable */}
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Ver horarios
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <SearchX className="mx-auto h-8 w-8 text-slate-400" strokeWidth={1.5} />
            <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-300">
              No se encontraron canchas con esos filtros
            </p>
            <p className="mt-1 text-sm text-slate-500">Intenta cambiar el deporte o la zona</p>
          </div>
        )}
      </div>
    </section>
  );
}
