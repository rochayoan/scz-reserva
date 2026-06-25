import { Card, CardContent, Badge, Button, SectionLabel, SectionTitle } from "../ui";

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
  const selectClass =
    "w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer";

  return (
    <section id="canchas" className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <SectionLabel>Canchas disponibles</SectionLabel>
          <SectionTitle className="mt-2">Encuentra el espacio ideal</SectionTitle>
        </div>

        {/* Search + Filters Bar */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* Search */}
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔎
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cancha o zona..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 transition-colors placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            {/* Sport */}
            <div className="relative">
              <select
                aria-label="Filtrar por deporte"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className={selectClass}
              >
                <option>Todos</option>
                <option>Fútbol</option>
                <option>Pádel</option>
                <option>Tenis</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
            {/* Zone */}
            <div className="relative">
              <select
                aria-label="Filtrar por zona"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className={selectClass}
              >
                <option>Todas</option>
                <option>Zona Norte</option>
                <option>4to Anillo</option>
                <option>Banzer</option>
                <option>La Guardia</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
            {/* Time */}
            <div className="relative">
              <select
                aria-label="Filtrar por horario"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={selectClass}
              >
                <option>Cualquiera</option>
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Court Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <Card
              key={court.id}
              hover
              onClick={() => {
                onSelectCourt(court);
                document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`cursor-pointer transition-all duration-200 ${
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
                  {court.featured && <Badge variant="popular">⭐ Popular</Badge>}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black leading-tight">{court.name}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {court.zone}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="flex items-center gap-1 font-bold text-sm">
                      <span className="text-amber-500">⭐</span> {court.rating}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{court.category}</p>
                    <p className="mt-0.5 text-lg font-black text-emerald-600">Bs {court.price}</p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{court.fields} cancha(s)</p>
                </div>

                {/* Time slots preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {court.times.slice(0, 3).map((time) => (
                    <span
                      key={time}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    >
                      {time}
                    </span>
                  ))}
                  {court.times.length > 3 && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      +{court.times.length - 3}
                    </span>
                  )}
                </div>

                <Button className="mt-5 w-full rounded-2xl py-3.5 text-sm font-bold">
                  Ver horarios
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {courts.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
            <p className="text-3xl">🏟️</p>
            <p className="mt-3 text-lg font-bold text-slate-600 dark:text-slate-400">
              No se encontraron canchas con esos filtros
            </p>
            <p className="mt-1 text-sm text-slate-500">Intenta cambiar el deporte o la zona</p>
          </div>
        )}
      </div>
    </section>
  );
}
