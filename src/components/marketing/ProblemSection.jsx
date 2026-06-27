import { Smartphone, Clock, BarChart3, CalendarX2 } from "lucide-react";
import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";
import { getProblems } from "../../lib/dataService";

const ICONS = { Smartphone, Clock, BarChart3, CalendarX2 };
const DELAYS = ["animation-delay-100", "animation-delay-200", "animation-delay-300", "animation-delay-400"];

export default function ProblemSection() {
  const problems = getProblems();
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>El problema actual</SectionLabel>
          <SectionTitle className="mt-2">¿Por qué es difícil reservar hoy?</SectionTitle>
          <p className="mt-4 mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            En Santa Cruz, reservar una cancha sigue dependiendo de llamadas, mensajes y la suerte de encontrar disponibilidad.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((item, i) => {
            const ItemIcon = ICONS[item.icon];
            return (
              <Card key={item.title} hover className={`animate-fade-in-up ${DELAYS[i % DELAYS.length]}`}>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
                    <ItemIcon className="h-6 w-6 text-red-600 dark:text-red-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
