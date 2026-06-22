import { Button } from "../ui";

export default function CTASection() {
  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-8 text-center text-white shadow-2xl shadow-emerald-900/30 md:p-16">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              Disponible en Santa Cruz
            </div>
            <h2 className="mx-auto max-w-2xl text-3xl font-black leading-tight md:text-5xl tracking-tight">
              Empieza a reservar mejor desde hoy
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-emerald-100/90 leading-relaxed">
              Únete a SCZ-RESERVA y descubre la forma más rápida de organizar tus partidos deportivos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                variant="white"
                onClick={() => document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-2xl px-8 py-4 text-base font-bold"
              >
                Buscar cancha <span className="ml-2">🔎</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("panel")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-2xl border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 hover:border-white/50"
              >
                Registrar complejo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
