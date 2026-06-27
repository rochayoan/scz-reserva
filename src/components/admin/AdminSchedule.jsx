import { useState, useEffect } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import { getScheduleData } from "../../lib/adminSupabase";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HOURS = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`);

const STATUS_COLORS = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-400",
  completed: "bg-blue-500",
  cancelled: "bg-red-400",
};

const COURT_COLORS = [
  "from-emerald-500 to-emerald-600",
  "from-blue-500 to-blue-600",
  "from-amber-500 to-amber-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
];

export default function AdminSchedule() {
  const { orgId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const load = async () => {
    setLoading(true);
    const d = await getScheduleData(orgId);
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  const reservations = data?.reservations ?? [];
  const courts = data?.courts ?? [];

  const dayReservations = reservations.filter((r) => {
    const d = new Date(r.starts_at);
    return d.getDay() === selectedDay;
  });

  const getSlot = (courtId, hour) => {
    return dayReservations.find((r) => {
      const start = new Date(r.starts_at);
      const end = new Date(r.ends_at);
      const slotEnd = new Date(start);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      return r.court_id === courtId && start < slotEnd && end > new Date(start.setHours(hour, 0, 0, 0));
    });
  };

  const getDuration = (start, end) => {
    return (new Date(end) - new Date(start)) / (1000 * 60 * 60);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Horarios</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista semanal de ocupación por cancha
          </p>
        </div>
        <button
          onClick={load}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.75} />
          Actualizar
        </button>
      </div>

      {/* Day selector */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <button className="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(i)}
            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              selectedDay === i
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm shadow-emerald-300/20"
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span className="text-[10px] block opacity-60">{i === new Date().getDay() ? "Hoy" : day.slice(0, 3)}</span>
            <span className="block">{day.slice(0, 3)}</span>
          </button>
        ))}
        <button className="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Schedule grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header row */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <div className="w-16 shrink-0" />
              {courts.map((court, i) => (
                <div
                  key={court.id}
                  className={`flex min-w-[140px] flex-1 items-center justify-center border-l border-slate-100 py-3`}
                >
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-700">{court.name}</p>
                    <p className="text-[10px] capitalize text-slate-400">{court.sport}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hour rows */}
            {HOURS.map((hour) => {
              const h = parseInt(hour.split(":")[0]);
              const isLunch = h === 12;
              return (
                <div key={hour} className="flex border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <div className={`flex w-16 shrink-0 items-start justify-center pt-3 text-xs font-semibold ${
                    isLunch ? "text-slate-400" : "text-slate-400"
                  }`}>
                    {hour}
                  </div>
                  {courts.map((court, i) => {
                    const slot = getSlot(court.id, h);
                    return (
                      <div
                        key={court.id}
                        className={`relative min-w-[140px] flex-1 border-l border-slate-50 p-1 ${
                          h % 2 === 0 ? "" : ""
                        }`}
                        style={{ minHeight: "52px" }}
                      >
                        {slot && (
                          <div
                            className={`h-full rounded-lg p-2 bg-gradient-to-r ${COURT_COLORS[i % COURT_COLORS.length]} shadow-sm`}
                            style={{ minHeight: "44px" }}
                          >
                            <p className="text-[11px] font-bold text-white leading-tight truncate">
                              {slot.guest_name || "Invitado"}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1">
                              <span className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_COLORS[slot.status] || "bg-white/50"}`} />
                              <span className="text-[9px] text-white/80 font-medium">
                                Bs {Number(slot.price_total).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[9px] text-white/60">
                              {new Date(slot.starts_at).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                              {" - "}
                              {new Date(slot.ends_at).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <p className="text-xs font-semibold text-slate-500">Estado:</p>
        {[
          { color: "bg-emerald-500", label: "Confirmada" },
          { color: "bg-amber-400", label: "Pendiente" },
          { color: "bg-blue-500", label: "Completada" },
          { color: "bg-red-400", label: "Cancelada" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500">
            <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
