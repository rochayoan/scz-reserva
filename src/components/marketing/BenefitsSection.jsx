import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";
import { getBenefitsUser, getBenefitsOwner } from "../../lib/dataService";

export default function BenefitsSection() {
  const benefitsUser = getBenefitsUser();
  const benefitsOwner = getBenefitsOwner();
  return (
    <section id="duenos" className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>Beneficios</SectionLabel>
          <SectionTitle className="mt-2">Para deportistas y para complejos</SectionTitle>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* For Athletes */}
          <Card hover className="animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950/30">
                  📱
                </div>
                <div>
                  <h2 className="text-2xl font-black">Para deportistas</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Reserva sin llamadas, sin esperar y con precios visibles.
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                {benefitsUser.map((item) => (
                  <li key={item.text} className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm transition-transform group-hover:scale-110 dark:bg-emerald-950/30">
                      {item.icon}
                    </div>
                    <span className="text-sm pt-1.5 text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* For Complex Owners */}
          <Card hover className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950/30">
                  📊
                </div>
                <div>
                  <h2 className="text-2xl font-black">Para dueños de complejos</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Un panel web para organizar todo tu negocio deportivo.
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                {benefitsOwner.map((item) => (
                  <li key={item.text} className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm transition-transform group-hover:scale-110 dark:bg-emerald-950/30">
                      {item.icon}
                    </div>
                    <span className="text-sm pt-1.5 text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
