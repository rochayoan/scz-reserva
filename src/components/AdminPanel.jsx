import { Card, CardContent, Button, Badge, SectionLabel, SectionTitle } from "./ui";
import { adminReservations } from "../data";

export default function AdminPanel() {
  const kpis = [
    { label: "Ingresos del día", value: "Bs 1.860", change: "+18% vs ayer", icon: "💰", positive: true },
    { label: "Reservas activas", value: "24", change: "6 horarios disponibles", icon: "📋", positive: true },
    { label: "Ocupación", value: "78%", change: "Alta demanda nocturna", icon: "📊", positive: true },
  ];

  return (
    <section id="panel" className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-50 p-6 dark:bg-slate-900/50 md:p-10 border border-slate-200/50 dark:border-slate-800/50">
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
            className="rounded-2xl px-7 py-4 font-bold shrink-0"
          >
            Registrar mi complejo <span className="ml-2">→</span>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                    <p className="mt-2 text-4xl font-black tracking-tight">{kpi.value}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-600">{kpi.change}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl dark:bg-emerald-950/30">
                    {kpi.icon}
                  </div>
                </div>
                {/* Mini Progress Bar */}
                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                    style={{ width: kpi.label === "Ocupación" ? "78%" : kpi.label === "Reservas activas" ? "60%" : "85%" }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reservations Table */}
        <Card className="mt-5 border-0 shadow-md">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-lg">Reservas recientes</h3>
              <Badge variant="default">En vivo</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Cliente</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Cancha</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Hora</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Pago</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {adminReservations.map((row) => (
                    <tr
                      key={`${row.client}-${row.time}`}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            {row.client.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-semibold">{row.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.court}</td>
                      <td className="px-6 py-4 font-semibold">{row.time}</td>
                      <td className="px-6 py-4">
                        <Badge variant={row.payment === "Pendiente" ? "warning" : "default"}>
                          {row.payment}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={row.status === "En espera" ? "warning" : "status"}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
