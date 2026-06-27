import { useState, useEffect } from "react";
import { Wallet, CalendarCheck, Gauge, Building2, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import { getDashboardKPIs, getAdminReservations } from "../../lib/adminSupabase";

function TrendBadge({ value }) {
  if (value === undefined || value === null || value === 0) return null;
  const isUp = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
      isUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    }`}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(value)}%
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
    checked_in: "bg-indigo-100 text-indigo-700",
  };
  const labels = {
    confirmed: "Confirmada",
    pending: "Pendiente",
    completed: "Completada",
    cancelled: "Cancelada",
    checked_in: "Jugando",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {labels[status] || status}
    </span>
  );
}

export default function AdminDashboard() {
  const { orgId } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [k, r] = await Promise.all([
      getDashboardKPIs(orgId),
      getAdminReservations(orgId),
    ]);
    setKpis(k);
    setRecent(r.slice(0, 6));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" strokeWidth={2} />
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Ingresos del día",
      value: `Bs ${(kpis?.todayRevenue ?? 0).toLocaleString()}`,
      sub: `${kpis?.todayCount ?? 0} reservas hoy`,
      trend: kpis?.revenueTrend,
      icon: Wallet,
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      label: "Reservas activas",
      value: String(kpis?.activeReservations ?? 0),
      sub: "Confirmadas + pendientes",
      trend: kpis?.reservationTrend,
      icon: CalendarCheck,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Canchas activas",
      value: String(kpis?.totalCourts ?? 0),
      sub: "En tu complejo",
      icon: Building2,
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      label: "Ocupación estimada",
      value: kpis?.totalCourts
        ? `${Math.round(((kpis?.activeReservations ?? 0) / (kpis?.totalCourts * 12)) * 100)}%`
        : "—",
      sub: "Slots ocupados vs disponibles",
      icon: Gauge,
      iconBg: "bg-gradient-to-br from-violet-500 to-violet-600",
    },
  ];

  const upcoming = recent.filter((r) => r.status === "confirmed" || r.status === "pending").slice(0, 4);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Resumen de tu complejo deportivo</p>
        </div>
        <button
          onClick={load}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:text-slate-700"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.75} />
          Actualizar
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <div key={kpi.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-emerald-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-3xl font-bold tracking-tight text-slate-800 tabular-nums">{kpi.value}</p>
                    {kpi.trend !== undefined && <TrendBadge value={kpi.trend} />}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{kpi.sub}</p>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${kpi.iconBg}`}>
                  <KpiIcon className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Reservas recientes</h3>
                  <p className="text-xs text-slate-400">Últimas reservas registradas</p>
                </div>
              </div>
              {recent.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">No hay reservas aún</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-50">
                        {["Cliente", "Cancha", "Fecha", "Monto", "Estado"].map((h) => (
                          <th key={h} className="px-6 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((r) => (
                        <tr key={r.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-xs font-bold text-emerald-700">
                                {(r.guest_name || "??").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="font-medium text-slate-700">{r.guest_name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-slate-500">{r.court_name}</td>
                          <td className="px-6 py-3 text-slate-500 tabular-nums">
                            {new Date(r.starts_at).toLocaleDateString("es-BO", { day: "numeric", month: "short"})}{" "}
                            <span className="text-slate-400">{new Date(r.starts_at).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit"})}</span>
                          </td>
                          <td className="px-6 py-3 font-semibold text-slate-700 tabular-nums">
                            Bs {Number(r.price_total).toLocaleString()}
                          </td>
                          <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-base font-bold text-slate-800">Próximas</h3>
                <p className="text-xs text-slate-400">En las próximas horas</p>
              </div>
              <div className="divide-y divide-slate-50 px-5 py-2">
                {upcoming.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">Sin próximas reservas</p>
                ) : (
                  upcoming.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 py-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        r.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {new Date(r.starts_at).getHours()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-700 truncate">{r.court_name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {new Date(r.starts_at).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                          {" — "}
                          {new Date(r.ends_at).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 text-base font-bold text-slate-800">Canchas ahora</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Cancha 1", "Cancha 2", "Cancha 3", "Cancha 4"].map((name, i) => (
                  <div key={name} className={`rounded-xl border p-3 text-center transition-all ${
                    i === 0 || i === 2 ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}>
                    <p className="text-xs font-semibold text-slate-600">{name}</p>
                    <p className={`mt-1 text-[11px] font-semibold ${i === 0 || i === 2 ? "text-emerald-600" : "text-slate-400"}`}>
                      {i === 0 || i === 2 ? "🟢 Ocupada" : "🟢 Disponible"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {i === 0 ? "hasta 18:00" : i === 2 ? "hasta 17:30" : "libre"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
