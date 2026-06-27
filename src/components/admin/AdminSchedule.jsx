import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Save,
  Sun,
  Moon,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, Button } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import {
  getScheduleData,
  saveOperatingHours,
} from "../../lib/adminSupabase";

const DAYS = [
  { index: 0, label: "Domingo", short: "Dom" },
  { index: 1, label: "Lunes", short: "Lun" },
  { index: 2, label: "Martes", short: "Mar" },
  { index: 3, label: "Miércoles", short: "Mié" },
  { index: 4, label: "Jueves", short: "Jue" },
  { index: 5, label: "Viernes", short: "Vie" },
  { index: 6, label: "Sábado", short: "Sáb" },
];

const HOURS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`
);

const DEFAULT_OPEN = "08:00";
const DEFAULT_CLOSE = "22:00";

export default function AdminSchedule() {
  const { orgId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [hoursConfig, setHoursConfig] = useState({}); // { "courtId_day": { open, close, enabled } }
  const [saved, setSaved] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const load = useCallback(async () => {
    setLoading(true);
    const d = await getScheduleData(orgId);
    setData(d);
    if (d.courts.length > 0 && !selectedCourt) {
      setSelectedCourt(d.courts[0].id);
    }
    // Build config from existing operating hours
    const config = {};
    for (const court of d.courts) {
      for (const day of DAYS) {
        const key = `${court.id}_${day.index}`;
        const existing = d.operatingHours?.filter(
          (h) => h.court_id === court.id && h.day_of_week === day.index
        );
        if (existing && existing.length > 0) {
          config[key] = {
            open: existing[0].open_time,
            close: existing[0].close_time,
            enabled: true,
          };
        } else {
          config[key] = { open: DEFAULT_OPEN, close: DEFAULT_CLOSE, enabled: false };
        }
      }
    }
    setHoursConfig(config);
    setLoading(false);
  }, [orgId, selectedCourt]);

  useEffect(() => {
    load();
  }, [load]);

  const getConfig = (courtId, dayIndex) =>
    hoursConfig[`${courtId}_${dayIndex}`] || {
      open: DEFAULT_OPEN,
      close: DEFAULT_CLOSE,
      enabled: false,
    };

  const toggleDay = (courtId, dayIndex) => {
    const key = `${courtId}_${dayIndex}`;
    setHoursConfig((prev) => ({
      ...prev,
      [key]: {
        ...getConfig(courtId, dayIndex),
        enabled: !prev[key]?.enabled,
      },
    }));
  };

  const updateTime = (courtId, dayIndex, field, value) => {
    const key = `${courtId}_${dayIndex}`;
    setHoursConfig((prev) => ({
      ...prev,
      [key]: {
        ...getConfig(courtId, dayIndex),
        [field]: value,
      },
    }));
  };

  const setAllDays = (courtId, enabled) => {
    const newConfig = { ...hoursConfig };
    for (const day of DAYS) {
      const key = `${courtId}_${day.index}`;
      newConfig[key] = {
        ...getConfig(courtId, day.index),
        enabled,
      };
    }
    setHoursConfig(newConfig);
  };

  const setAllHours = (courtId, open, close) => {
    const newConfig = { ...hoursConfig };
    for (const day of DAYS) {
      const key = `${courtId}_${day.index}`;
      newConfig[key] = {
        ...getConfig(courtId, day.index),
        open,
        close,
      };
    }
    setHoursConfig(newConfig);
  };

  const handleSave = async () => {
    if (!selectedCourt) return;
    setSaving(true);

    // Build entries for this court
    const entries = [];
    for (const day of DAYS) {
      const cfg = getConfig(selectedCourt, day.index);
      if (cfg.enabled) {
        entries.push({
          court_id: selectedCourt,
          day_of_week: day.index,
          open_time: cfg.open,
          close_time: cfg.close,
        });
      }
    }

    const { error } = await saveOperatingHours(entries);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  // Current court data
  const currentCourt = data?.courts?.find((c) => c.id === selectedCourt);

  // Reservations for the schedule view
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
      return (
        r.court_id === courtId &&
        start < slotEnd &&
        end > new Date(start.setHours(hour, 0, 0, 0))
      );
    });
  };

  const COURT_COLORS = [
    "from-emerald-500 to-emerald-600",
    "from-blue-500 to-blue-600",
    "from-amber-500 to-amber-600",
    "from-violet-500 to-violet-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
  ];

  const STATUS_COLORS = {
    confirmed: "bg-emerald-500",
    pending: "bg-amber-400",
    completed: "bg-blue-500",
    cancelled: "bg-red-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!data?.courts?.length) {
    return (
      <div className="py-16 text-center">
        <Clock className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-4 text-lg font-bold text-slate-500">
          No tienes canchas registradas
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Primero agrega canchas desde la sección Canchas
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Horarios
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configura la disponibilidad de tus canchas
          </p>
        </div>
        <button
          onClick={load}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <RefreshCw
            className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180"
            strokeWidth={1.75}
          />
          Recargar
        </button>
      </div>

      {/* Tabs: Court selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {courts.map((court, i) => (
          <button
            key={court.id}
            onClick={() => setSelectedCourt(court.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              selectedCourt === court.id
                ? `bg-gradient-to-r ${COURT_COLORS[i % COURT_COLORS.length]} text-white shadow-sm`
                : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {court.name}
          </button>
        ))}
      </div>

      {selectedCourt && (
        <>
          {/* Availability Editor */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {currentCourt?.name}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {currentCourt?.sport}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAllDays(selectedCourt, true)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50"
                  >
                    Activar todos
                  </button>
                  <button
                    onClick={() => setAllDays(selectedCourt, false)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50"
                  >
                    Desactivar todos
                  </button>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-500">
                  Rellenar horario:
                </span>
                <select
                  value=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const parts = e.target.value.split("-");
                    setAllHours(selectedCourt, parts[0], parts[1]);
                    e.target.value = "";
                  }}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none"
                >
                  <option value="">Seleccionar...</option>
                  <option value="08:00-22:00">Mañana a noche (08-22)</option>
                  <option value="08:00-12:00">Solo mañana (08-12)</option>
                  <option value="14:00-22:00">Solo tarde/noche (14-22)</option>
                  <option value="06:00-18:00">Madrugada a tarde (06-18)</option>
                  <option value="09:00-21:00">Diurno (09-21)</option>
                </select>
              </div>

              {/* Days grid */}
              <div className="space-y-2">
                {DAYS.map((day) => {
                  const cfg = getConfig(selectedCourt, day.index);
                  const isToday = day.index === new Date().getDay();
                  return (
                    <div
                      key={day.index}
                      className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 transition-all ${
                        cfg.enabled
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-slate-100 bg-white"
                      } ${isToday ? "ring-1 ring-emerald-300/30" : ""}`}
                    >
                      {/* Toggle */}
                      <button
                        onClick={() => toggleDay(selectedCourt, day.index)}
                        className={`flex w-20 shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-all ${
                          cfg.enabled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            cfg.enabled ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        {day.short}
                      </button>

                      {/* Time inputs */}
                      {cfg.enabled ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Sun className="h-3.5 w-3.5 text-amber-500" />
                            <select
                              value={cfg.open}
                              onChange={(e) =>
                                updateTime(
                                  selectedCourt,
                                  day.index,
                                  "open",
                                  e.target.value
                                )
                              }
                              className="h-8 w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition-colors focus:border-emerald-400"
                            >
                              {HOURS.map((h) => (
                                <option key={h} value={h}>
                                  {h}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span className="text-xs text-slate-400">→</span>
                          <div className="flex items-center gap-2">
                            <Moon className="h-3.5 w-3.5 text-indigo-400" />
                            <select
                              value={cfg.close}
                              onChange={(e) =>
                                updateTime(
                                  selectedCourt,
                                  day.index,
                                  "close",
                                  e.target.value
                                )
                              }
                              className="h-8 w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition-colors focus:border-emerald-400"
                            >
                              {HOURS.map((h) => (
                                <option key={h} value={h}>
                                  {h}
                                </option>
                              ))}
                            </select>
                          </div>

                          {isToday && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                              Hoy
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Cerrado
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Save */}
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-1.5 h-4 w-4" />
                  {saving
                    ? "Guardando..."
                    : saved
                    ? "✓ Guardado"
                    : "Guardar horarios"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly View */}
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">
                  Vista semanal
                </h3>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    {DAYS[selectedDay]?.label}
                  </span>
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Day pills */}
              <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
                {DAYS.map((day) => (
                  <button
                    key={day.index}
                    onClick={() => setSelectedDay(day.index)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedDay === day.index
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    } ${
                      day.index === new Date().getDay()
                        ? "ring-1 ring-emerald-300"
                        : ""
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>

              {/* Schedule grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Header */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <div className="w-14 shrink-0" />
                    {courts.map((court, i) => (
                      <div
                        key={court.id}
                        className="flex min-w-[120px] flex-1 items-center justify-center border-l border-slate-100 py-2.5"
                      >
                        <p className="text-xs font-bold text-slate-600">
                          {court.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Hour rows (7-22) */}
                  {Array.from({ length: 15 }, (_, i) => i + 7).map((h) => {
                    const hour = `${String(h).padStart(2, "0")}:00`;
                    return (
                      <div
                        key={h}
                        className="flex border-b border-slate-50 transition-colors hover:bg-slate-50/30"
                      >
                        <div className="flex w-14 shrink-0 items-start justify-center pt-2 text-[11px] font-semibold text-slate-400">
                          {hour}
                        </div>
                        {courts.map((court, ci) => {
                          const slot = getSlot(court.id, h);
                          const cfg = getConfig(court.id, selectedDay);
                          const isOpen =
                            cfg.enabled &&
                            parseInt(cfg.open) <= h &&
                            parseInt(cfg.close) > h;
                          return (
                            <div
                              key={court.id}
                              className="relative min-w-[120px] flex-1 border-l border-slate-50"
                              style={{ minHeight: "36px" }}
                            >
                              {slot && (
                                <div
                                  className={`m-0.5 rounded-md bg-gradient-to-r ${
                                    COURT_COLORS[ci % COURT_COLORS.length]
                                  } bg-opacity-90 px-2 py-1 shadow-sm`}
                                  style={{ minHeight: "30px" }}
                                >
                                  <p className="text-[10px] font-bold text-white leading-tight truncate">
                                    {slot.guest_name || "Invitado"}
                                  </p>
                                  <p className="text-[9px] text-white/70">
                                    Bs{" "}
                                    {Number(slot.price_total).toLocaleString()}
                                  </p>
                                </div>
                              )}
                              {!slot && isOpen && (
                                <div className="h-full w-full opacity-0 hover:opacity-100 transition-opacity">
                                  <div className="mx-0.5 h-[30px] rounded-md border border-dashed border-emerald-200 bg-emerald-50/40" />
                                </div>
                              )}
                              {!slot && !isOpen && (
                                <div className="h-full bg-slate-50/50" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <span className="text-xs font-semibold text-slate-500">
                  Estado:
                </span>
                {[
                  { color: "bg-slate-50 border border-slate-200", label: "Cerrado" },
                  { color: "bg-emerald-100", label: "Disponible" },
                  { color: "bg-emerald-500", label: "Ocupado" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <div
                      className={`h-2.5 w-5 rounded ${item.color}`}
                    />
                    {item.label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
