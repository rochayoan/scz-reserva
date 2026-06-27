import { Wallet, CalendarCheck, Gauge, Inbox, ArrowRight } from "lucide-react";
import { Card, CardContent, Button, Badge, SectionLabel, SectionTitle } from "../ui";
import { getAdminReservations } from "../../lib/dataService";

const STATUS_DOT = {
  default: "bg-emerald-500",
  status: "bg-emerald-500",
  warning: "bg-amber-500",
};

function StatusBadge({ variant, children }) {
  return (
    <Badge variant={variant}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${STATUS_DOT[variant] || STATUS_DOT.default}`} />
      {children}
    </Badge>
  );
}

export default function AdminPanel() {
  const adminReservations = getAdminReservations();
  const kpis = [
    { label: "Ingresos del día", value: "Bs 1.860", change: "+18% vs ayer", icon: Wallet, progress: 85 },
    { label: "Reservas activas", value: "24", change: "6 horarios disponibles", icon: CalendarCheck, progress: 60 },
    { label: "Ocupación", value: "78%", change: "Alta demanda nocturna", icon: Gauge, progress: 78 },
  ];

  return (
    <section id="panel" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200/50 bg-slate-50 p-6 dark:border-slate-800/50 dark:bg-slate-900/50 md:p-10">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel>Panel administrativo</SectionLabel>
            <SectionTitle className="mt-2">Vista para propietarios</SectionTitle>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Dashboard tipo SaaS para gestionar tu complejo deportivo.
            </p>
          </div>
          <Button
            onClick={() => document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" })}
            className="shrink-0"
          >
            Registrar mi complejo
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {kpis.map((kpi) => {
            const KpiIcon = kpi.icon;
            return (
              <Card key={kpi.label}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                      <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{kpi.value}</p>
                      <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{kpi.change}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                      <KpiIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                    </div>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${kpi.progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reservations Table */}
        <Card className="mt-5">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="text-lg font-bold">Reservas recientes</h3>
              <Badge variant="default">En vivo</Badge>
            </div>
            {adminReservations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Inbox className="mx-auto h-8 w-8 text-slate-400" strokeWidth={1.5} />
                <p className="mt-3 text-lg font-bold text-slate-600 dark:text-slate-400">
                  Todavía no hay reservas
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Cuando lleguen reservas de tus clientes, aparecerán aquí en tiempo real.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Cancha
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Hora
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Pago
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminReservations.map((row) => (
                      <tr
                        key={`${row.client}-${row.time}`}
                        className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                              {row.client.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="font-semibold">{row.client}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.court}</td>
                        <td className="px-6 py-4 font-semibold tabular-nums">{row.time}</td>
                        <td className="px-6 py-4">
                          <StatusBadge variant={row.payment === "Pendiente" ? "warning" : "default"}>
                            {row.payment}
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge variant={row.status === "En espera" ? "warning" : "status"}>
                            {row.status}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent dark:from-slate-900 md:hidden" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
