import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";

const solutions = [
  { icon: "📍", title: "Canchas centralizadas", text: "Todos los complejos deportivos de Santa Cruz en un solo lugar." },
  { icon: "⏰", title: "Horarios en tiempo real", text: "Ve disponibilidad actualizada al instante, sin esperar respuestas." },
  { icon: "💳", title: "Pago QR digital", text: "Confirma tu reserva con pago digital y bloquea tu horario." },
  { icon: "📊", title: "Panel para complejos", text: "Los propietarios gestionan reservas, ingresos y ocupación desde la web." },
  { icon: "🔔", title: "Confirmación inmediata", text: "Recibe confirmación al instante. Sin llamadas, sin esperas." },
  { icon: "📱", title: "100% móvil", text: "Diseñado mobile-first para reservar desde cualquier dispositivo." },
];

export default function SolutionSection() {
  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>La solución</SectionLabel>
          <SectionTitle className="mt-2">SCZ-RESERVA centraliza todo</SectionTitle>
          <p className="mt-4 mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Una plataforma moderna que conecta deportistas con complejos deportivos de forma rápida, digital y sin fricciones.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item, i) => (
            <Card
              key={item.title}
              hover
              className={`animate-fade-in-up animation-delay-${((i % 3) + 1) * 100}`}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl dark:bg-emerald-950/30">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
