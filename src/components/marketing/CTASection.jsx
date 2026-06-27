import { Search } from "lucide-react";
import { Button } from "../ui";

export default function CTASection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-8 text-center text-white shadow-2xl shadow-emerald-900/30 md:p-16">
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
            <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Empieza a reservar mejor desde hoy
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-emerald-100/90">
              Únete a SCZ-RESERVA y descubre la forma más rápida de organizar tus partidos deportivos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                variant="white"
                onClick={() => document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 text-base"
              >
                Buscar cancha
                <Search className="ml-2 h-4 w-4" strokeWidth={2} />
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("panel")?.scrollIntoView({ behavior: "smooth" })}
                className="border-white/30 bg-white/10 px-8 text-base text-white hover:border-white/50 hover:bg-white/20"
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
