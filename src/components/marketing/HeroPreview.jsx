import { Check, ArrowRight, Calendar, Clock, CreditCard } from "lucide-react";

// HeroPreview: mockup tipo ventana del booking flow en 3 pasos.
// Muestra el flujo de reserva real: servicio → horario → confirmar.
// Desacoplado del backend — usa data ilustrativa local.

const STEPS = [
  { icon: Calendar, label: "Servicio", desc: "Fútbol 5" },
  { icon: Clock, label: "Horario", desc: "Hoy · 19:00" },
  { icon: CreditCard, label: "Confirmar", desc: "Bs 180" },
];

const SPORTS = ["Fútbol", "Pádel", "Tenis"];
const TIMES = ["18:00", "19:00", "20:00", "21:00"];

export default function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-3 text-[11px] font-medium text-slate-400">scz-reserva.app/reservar</span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Step indicator */}
        <div className="mb-5 flex items-center gap-1">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center gap-1">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <step.icon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" strokeWidth={2} />
              </div>
              <span className="hidden truncate text-[10px] font-semibold text-emerald-700 sm:inline dark:text-emerald-300">
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="mx-1 h-px flex-1 bg-emerald-200 dark:bg-emerald-800" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select sport */}
        <div className="mb-4">
          <p className="mb-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            ¿Qué quieres jugar?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  sport === "Fútbol"
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select time */}
        <div className="mb-4">
          <p className="mb-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Horarios disponibles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TIMES.map((t) => (
              <button
                key={t}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  t === "19:00"
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Confirm */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/20">
          <div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Pentagol · Cancha 1
            </p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              Bs 180
            </p>
          </div>
          <button className="flex items-center gap-1 rounded-lg bg-emerald-700 px-4 py-2 text-[11px] font-bold text-white transition-colors hover:bg-emerald-800">
            Confirmar
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </div>

        {/* Success state (small) */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-100/50 px-3 py-2 dark:bg-emerald-950/30">
          <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
            Reserva confirmada · Recibirás un código QR
          </span>
        </div>
      </div>
    </div>
  );
}
