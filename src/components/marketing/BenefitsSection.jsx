import {
  Smartphone,
  BarChart3,
  Search,
  Tag,
  Zap,
  CreditCard,
  ClipboardCheck,
  MonitorSmartphone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, SectionLabel, SectionTitle } from "../ui";
import { getBenefitsUser, getBenefitsOwner } from "../../lib/dataService";

const ICONS = { Search, Tag, Zap, CreditCard, ClipboardCheck, MonitorSmartphone, TrendingDown, TrendingUp };

function BenefitList({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const ItemIcon = ICONS[item.icon];
        return (
          <li key={item.text} className="group flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 transition-transform group-hover:scale-110 dark:bg-emerald-950/30">
              <ItemIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
            </div>
            <span className="pt-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function BenefitsSection() {
  const benefitsUser = getBenefitsUser();
  const benefitsOwner = getBenefitsOwner();
  return (
    <section id="duenos" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <SectionLabel>Beneficios</SectionLabel>
          <SectionTitle className="mt-2">Para deportistas y para complejos</SectionTitle>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card hover className="animate-fade-in-up">
            <CardContent className="p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                  <Smartphone className="h-7 w-7 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Para deportistas</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Reserva sin llamadas, sin esperar y con precios visibles.
                  </p>
                </div>
              </div>
              <BenefitList items={benefitsUser} />
            </CardContent>
          </Card>

          <Card hover className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                  <BarChart3 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Para dueños de complejos</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Un panel web para organizar todo tu negocio deportivo.
                  </p>
                </div>
              </div>
              <BenefitList items={benefitsOwner} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
