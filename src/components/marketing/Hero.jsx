import { useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Button, SegmentedControl } from "../ui";
import { stats } from "../../data";
import HeroPreview from "./HeroPreview";

// Hero desacoplado: no importa nada de components/booking/ ni de lib/dataService.
// El unico puente con el resto de la pantalla es la callback estrecha `onSearch`,
// que App.jsx implementa (setea el filtro de deporte + hace scroll a #canchas).
// `stats` es contenido de marketing estatico importado directo de data.js.
const SPORTS = ["Fútbol", "Pádel", "Tenis"];

export default function Hero({ onSearch }) {
  const [activeSport, setActiveSport] = useState(null);

  const selectSport = (sport) => {
    setActiveSport(sport);
    onSearch?.(sport);
  };

  return (
    <section id="inicio" className="relative overflow-hidden px-4 py-12 md:px-8 md:py-20">
      {/* Halo esmeralda sutil detras del mockup (reemplaza el gradiente saturado) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 lg:gap-16">
        {/* Columna izquierda: mensaje + accion */}
        <div className="animate-fade-in-up">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
            Santa Cruz de la Sierra
          </p>

          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl dark:text-white">
            Reserva tu cancha en segundos.
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-400">
            Encuentra fútbol, pádel y tenis con disponibilidad real y precios visibles, sin llamadas ni esperas.
          </p>

          {/* Segmented control de deportes */}
          <div className="mt-8">
            <p className="mb-2 text-xs font-medium text-slate-400">¿Qué quieres jugar?</p>
            <SegmentedControl options={SPORTS} value={activeSport} onChange={selectSport} />
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onSearch?.(activeSport)}>
              Buscar cancha
              <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("panel")?.scrollIntoView({ behavior: "smooth" })}
            >
              Registrar mi complejo
            </Button>
          </div>

          {/* Stats — elemento de confianza, tenue */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            {stats.map((item) => (
              <div key={item.label}>
                <p className="text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: el producto como protagonista */}
        <div className="animate-fade-in-up animation-delay-200">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
