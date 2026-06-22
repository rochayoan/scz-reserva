import { Button } from "./ui";
import { stats } from "../data";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden px-4 py-8 md:px-8 md:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-950 p-6 text-white shadow-2xl shadow-emerald-900/30 md:grid-cols-2 md:p-12 lg:p-16">
        {/* Content */}
        <div className="animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            Santa Cruz de la Sierra
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Reserva tu cancha en segundos.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-emerald-100/90 leading-relaxed">
            Encuentra fútbol, pádel y tenis con disponibilidad en tiempo real, precios visibles y pago por QR.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="white"
              onClick={() => document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-2xl px-7 py-4 text-base font-bold"
            >
              Buscar cancha <span className="ml-2">🔎</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("panel")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-2xl border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white hover:bg-white/20 hover:border-white/50"
            >
              Registrar mi complejo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {stats.map((item, i) => (
              <div
                key={item.label}
                className={`rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/5 animate-fade-in-up animation-delay-${(i + 1) * 100}`}
              >
                <p className="text-2xl font-black">{item.value}</p>
                <p className="text-xs text-emerald-200/80 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative animate-fade-in-up animation-delay-200">
          <div className="rounded-[2rem] bg-white/10 p-3 backdrop-blur-sm border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80"
              alt="Cancha deportiva iluminada en Santa Cruz"
              className="h-64 w-full rounded-[1.5rem] object-cover md:h-80 lg:h-96"
              loading="eager"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-5 left-4 right-4 sm:left-6 sm:right-auto sm:w-72 md:w-80 animate-float">
            <div className="rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/20 dark:bg-slate-900 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">Cancha disponible ahora</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hoy 20:00 · Zona Norte</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <span className="text-emerald-600">✅</span>
                </div>
              </div>
              <button
                onClick={() => document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
