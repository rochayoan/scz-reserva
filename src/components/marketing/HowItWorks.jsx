import { Search, Clock, CreditCard, Goal, ArrowRight } from "lucide-react";
import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";
import { getSteps } from "../../lib/dataService";

const ICONS = { Search, Clock, CreditCard, Goal };
const DELAYS = ["animation-delay-100", "animation-delay-200", "animation-delay-300", "animation-delay-400"];

export default function HowItWorks() {
  const steps = getSteps();
  return (
    <section id="funciona" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>Cómo funciona</SectionLabel>
          <SectionTitle className="mt-2">Un flujo simple para reservar y administrar</SectionTitle>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => {
            const ItemIcon = ICONS[item.icon];
            return (
              <Card
                key={item.title}
                hover
                className={`relative text-center animate-fade-in-up ${DELAYS[i % DELAYS.length]}`}
              >
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    {i + 1}
                  </div>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                    <ItemIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
                </CardContent>

                {/* Connector (oculto en mobile y en el ultimo paso) */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
