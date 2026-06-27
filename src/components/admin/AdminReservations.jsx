import { useState, useEffect } from "react";
import { RefreshCw, Search, CheckCircle, XCircle, Inbox, Filter } from "lucide-react";
import { Card, CardContent, Button } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import {
  getAdminReservations,
  updateReservationStatus,
} from "../../lib/adminSupabase";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200/50",
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200/50",
  completed: "bg-blue-100 text-blue-700 border-blue-200/50",
  cancelled: "bg-red-100 text-red-700 border-red-200/50",
  no_show: "bg-slate-100 text-slate-600 border-slate-200/50",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

const PAYMENT_LABELS = {
  unpaid: "Impago",
  pending: "Pendiente",
  paid: "Pagado",
  refunded: "Reembolsado",
};

const PAYMENT_STYLES = {
  unpaid: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  refunded: "bg-slate-100 text-slate-600",
};

const FILTER_OPTIONS = [
  { value: "todas", label: "Todas", color: "bg-slate-100 text-slate-700" },
  { value: "pending", label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  { value: "confirmed", label: "Confirmada", color: "bg-emerald-100 text-emerald-700" },
  { value: "completed", label: "Completada", color: "bg-blue-100 text-blue-700" },
  { value: "cancelled", label: "Cancelada", color: "bg-red-100 text-red-700" },
];

export default function AdminReservations() {
  const { orgId } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await getAdminReservations(orgId);
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (id, newStatus) => {
    setActionLoading(id);
    const { error } = await updateReservationStatus(id, newStatus);
    if (!error) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
    setActionLoading(null);
  };

  const filtered = reservations.filter((r) => {
    const matchSearch =
      !search ||
      (r.guest_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.guest_phone ?? "").includes(search) ||
      (r.court_name ?? "").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "todas" || r.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reservas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona todas las reservas de tu complejo
          </p>
        </div>
        <button
          onClick={load}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
        >
          <RefreshCw className={`h-4 w-4 transition-transform duration-700 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} strokeWidth={1.75} />
          Actualizar
        </button>
      </div>

      {/* Search + Filtros */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono o cancha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 placeholder:text-slate-400"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                statusFilter === opt.value
                  ? `${opt.color} ring-1 ring-slate-300/30 shadow-sm`
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {statusFilter === opt.value && <Filter className="mr-1 inline h-3 w-3" />}
              {opt.label}
              {statusFilter === opt.value && (
                <span className="ml-1.5 rounded-full bg-white/30 px-1.5 text-[10px]">
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Inbox className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-lg font-bold text-slate-500">
                No hay reservas
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {search || statusFilter !== "todas"
                  ? "Intenta con otros filtros"
                  : "Cuando lleguen reservas, aparecerán aquí"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Cliente", "Cancha", "Fecha / Hora", "Pago", "Estado", "Acciones"].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-xs font-bold text-emerald-700">
                            {(r.guest_name ?? "??").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">
                              {r.guest_name || "Invitado"}
                            </p>
                            {r.guest_phone && (
                              <p className="text-xs text-slate-400">
                                {r.guest_phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{r.court_name}</p>
                        <p className="text-xs capitalize text-slate-400">
                          {r.court_sport}
                        </p>
                      </td>
                      <td className="px-6 py-4 tabular-nums">
                        <p className="text-slate-700">
                          {new Date(r.starts_at).toLocaleDateString("es-BO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(r.starts_at).toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(r.ends_at).toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-700">
                          Bs {Number(r.price_total).toLocaleString()}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            PAYMENT_STYLES[r.payment_status] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {PAYMENT_LABELS[r.payment_status] || r.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            STATUS_STYLES[r.status] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {STATUS_LABELS[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {(r.status === "pending" || r.status === "confirmed") && (
                            <button
                              onClick={() => handleAction(r.id, "completed")}
                              disabled={actionLoading === r.id}
                              className="group flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:shadow-sm disabled:opacity-50"
                            >
                              <CheckCircle className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                              Completar
                            </button>
                          )}
                          {r.status !== "cancelled" && r.status !== "completed" && (
                            <button
                              onClick={() => handleAction(r.id, "cancelled")}
                              disabled={actionLoading === r.id}
                              className="group flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-all duration-200 hover:bg-red-100 hover:shadow-sm disabled:opacity-50"
                            >
                              <XCircle className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
