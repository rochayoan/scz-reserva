import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";
import { problems } from "../../data";

export default function ProblemSection() {
  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>El problema actual</SectionLabel>
          <SectionTitle className="mt-2">¿Por qué es difícil reservar hoy?</SectionTitle>
          <p className="mt-4 mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            En Santa Cruz, reservar una cancha sigue dependiendo de llamadas, mensajes y la suerte de encontrar disponibilidad.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((item, i) => (
            <Card
              key={item.title}
              hover
              className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl dark:bg-red-950/30">
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
