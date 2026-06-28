import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet, CalendarCheck, Building2, Gauge,
  RefreshCw, TrendingUp, Clock, CheckCircle2,
  DollarSign, User, AlertTriangle, ArrowRight,
  CreditCard, LogIn
} from "lucide-react";
import { Card, CardContent } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import { getDashboardKPIs, updateReservationStatus, updatePaymentStatus } from "../../lib/adminSupabase";

export default function AdminDashboard() {
  const { orgId } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    const k = await getDashboardKPIs(orgId);
    setKpis(k);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleArrived = async (id) => {
    setActionLoading("arrived-" + id);
    await updateReservationStatus(id, "checked_in");
    await load();
    setActionLoading(null);
  };

  const handlePaid = async (id) => {
    setActionLoading("paid-" + id);
    await updatePaymentStatus(id, "paid");
    await load();
    setActionLoading(null);
  };

  const todayReservations = kpis?.todayReservations || [];
  const upcoming = todayReservations.filter(
    (r) => r.status !== "cancelled" && r.status !== "completed"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {new Date().toLocaleDateString("es-BO", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <button onClick={load}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
          <RefreshCw className={`h-4 w-4 transition-transform duration-700 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
          Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Ingresos hoy</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Wallet className="h-4 w-4 text-emerald-700" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800 tabular-nums">
            Bs {kpis?.todayRevenue?.toLocaleString() ?? 0}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Cobrado ·{" "}
            <span className="text-slate-500">
              Bs {kpis?.todayPotential?.toLocaleString() ?? 0} potencial
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Reservas hoy</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <CalendarCheck className="h-4 w-4 text-blue-700" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800 tabular-nums">
            {upcoming.length}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {kpis?.arrived ?? 0} llegaron · {kpis?.todayCount ?? 0} total
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Canchas</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <Building2 className="h-4 w-4 text-amber-700" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800 tabular-nums">
            {kpis?.totalCourts ?? 0}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Activas en tu complejo</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Ocupación hoy</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
              <Gauge className="h-4 w-4 text-violet-700" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800 tabular-nums">
            {kpis?.totalCourts && kpis?.todayCount
              ? `${Math.round((kpis.todayCount / (kpis.totalCourts * 12)) * 100)}%`
              : "—"}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Slots ocupados vs disponibles
          </p>
        </div>
      </div>

      {/* Today's reservations */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                📅 Reservas de hoy
              </h3>
              <p className="text-xs text-slate-400">
                {upcoming.length} pendientes ·{" "}
                {todayReservations.filter((r) => r.status === "checked_in").length} llegaron ·{" "}
                {todayReservations.filter((r) => r.payment_status === "paid").length} pagaron
              </p>
            </div>
          </div>

          {todayReservations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CalendarCheck className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">Sin reservas hoy</p>
              <p className="mt-1 text-xs text-slate-400">Los clientes pueden reservar desde la web</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {todayReservations.map((r) => {
                const start = new Date(r.starts_at);
                const end = new Date(r.ends_at);
                const now = new Date();
                const minsUntilStart = Math.round((start - now) / 60000);
                const isHappening = minsUntilStart <= 0 && end > now;
                const isSoon = minsUntilStart > 0 && minsUntilStart <= 120;
                const isPast = end < now;

                return (
                  <div
                    key={r.id}
                    className={`px-6 py-4 transition-colors ${
                      isHappening ? "bg-emerald-50/80" : isSoon ? "bg-amber-50/60" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Time */}
                      <div className="flex shrink-0 flex-col items-center rounded-xl bg-slate-100 px-3 py-2 min-w-[64px]">
                        <span className="text-lg font-black text-slate-700 tabular-nums leading-none">
                          {start.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="mt-0.5 text-[10px] text-slate-400">
                          {end.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-[10px] font-bold text-emerald-700">
                            {(r.guest_name || "??").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <p className="font-semibold text-slate-700 truncate">{r.guest_name}</p>
                          {r.status === "checked_in" && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                              ✅ Llegó
                            </span>
                          )}
                          {r.payment_status === "paid" && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              💰 Pagó
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {r.court_name} · {r.venue_name}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-700 tabular-nums">
                          Bs {Number(r.price_total).toLocaleString()}
                        </p>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          r.status === "pending" ? "bg-amber-100 text-amber-700" :
                          r.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {r.status === "pending" ? "Pendiente" :
                           r.status === "confirmed" ? "Confirmada" :
                           r.status === "checked_in" ? "Jugando" : r.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5 shrink-0">
                        {r.status !== "cancelled" && r.status !== "checked_in" && r.status !== "completed" && (
                          <>
                            <button
                              onClick={() => handleArrived(r.id)}
                              disabled={actionLoading === "arrived-" + r.id}
                              className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                            >
                              <LogIn className="h-3.5 w-3.5" />
                              Llegó
                            </button>
                            {r.payment_status !== "paid" && (
                              <button
                                onClick={() => handlePaid(r.id)}
                                disabled={actionLoading === "paid-" + r.id}
                                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                              >
                                <DollarSign className="h-3.5 w-3.5" />
                                Pagó
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Alert banner for soon reservations */}
                      {isSoon && !isHappening && (
                        <div className="w-full mt-2 flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5">
                          <Clock className="h-3 w-3 text-amber-700" />
                          <span className="text-[11px] font-semibold text-amber-800">
                            {minsUntilStart <= 0
                              ? "Ya debería haber llegado ⏰"
                              : minsUntilStart < 60
                              ? `En menos de ${minsUntilStart} min ⚠️`
                              : `En ~${Math.round(minsUntilStart / 60)}h ⏳`}
                          </span>
                        </div>
                      )}

                      {isHappening && !r.status.includes("checked") && (
                        <div className="w-full mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5">
                          <AlertTriangle className="h-3 w-3 text-emerald-700" />
                          <span className="text-[11px] font-semibold text-emerald-800">
                            ¡Está pasando ahora! Marca como "Llegó" 🔔
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => navigate("/admin/reservas")}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
            <CalendarCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800">Ver todas las reservas</p>
            <p className="text-xs text-slate-400">Gestiona el historial completo</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
        </button>

        <button
          onClick={() => navigate("/admin/canchas")}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800">Administrar canchas</p>
            <p className="text-xs text-slate-400">Agrega edita o desactiva canchas</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
