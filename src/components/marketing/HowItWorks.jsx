import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";
import { steps } from "../../data";

export default function HowItWorks() {
  return (
    <section id="funciona" className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>Cómo funciona</SectionLabel>
          <SectionTitle className="mt-2">Un flujo simple para reservar y administrar</SectionTitle>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <Card
              key={item.title}
              hover
              className={`text-center relative animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            >
              <CardContent className="p-6">
                {/* Step number */}
                <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  {i + 1}
                </div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
              </CardContent>

              {/* Connector Arrow (hidden on last and mobile) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block z-10">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
                    →
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
