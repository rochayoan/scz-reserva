import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Save,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Sun,
  Moon,
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

const SPORT_ICONS = { futbol: "⚽", padel: "🎾", tenis: "🏸" };

const COURT_COLORS = [
  "from-emerald-500 to-emerald-600",
  "from-blue-500 to-blue-600",
  "from-amber-500 to-amber-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
];

const PRESETS = [
  { label: "Mañana a noche", open: "08:00", close: "22:00", desc: "14h" },
  { label: "Solo mañana", open: "08:00", close: "12:00", desc: "4h" },
  { label: "Tarde a noche", open: "14:00", close: "22:00", desc: "8h" },
  { label: "Madrugada", open: "06:00", close: "12:00", desc: "6h" },
  { label: "Diurno", open: "09:00", close: "18:00", desc: "9h" },
];

function TimeBar({ open, close }) {
  const openH = parseInt(open) || 8;
  const closeH = parseInt(close) || 22;
  const totalHours = 24;
  const leftPct = (openH / totalHours) * 100;
  const widthPct = ((closeH - openH) / totalHours) * 100;

  return (
    <div className="relative h-6 w-full min-w-[140px] rounded-full bg-slate-100">
      <div
        className="absolute top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <span className="text-[10px] font-bold text-white drop-shadow-sm">
          {open}
        </span>
        <span className="text-[10px] font-bold text-white drop-shadow-sm">
          {close}
        </span>
      </div>
    </div>
  );
}

function WeekSummary({ config, courtId }) {
  const openDays = DAYS.filter(
    (d) => config[`${courtId}_${d.index}`]?.enabled
  );
  const totalHours = openDays.reduce((sum, d) => {
    const cfg = config[`${courtId}_${d.index}`];
    if (!cfg) return sum;
    return sum + (parseInt(cfg.close) - parseInt(cfg.open));
  }, 0);

  return (
    <div className="mb-5 flex flex-wrap items-center gap-4 rounded-2xl bg-emerald-50/70 px-5 py-3">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{openDays.length}</span>
        <span className="text-xs text-slate-500">días abierto</span>
      </div>
      <div className="h-6 w-px bg-emerald-200" />
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{totalHours}</span>
        <span className="text-xs text-slate-500">horas/semana</span>
      </div>
      <div className="h-6 w-px bg-emerald-200" />
      <div className="flex gap-1">
        {DAYS.map((d) => {
          const isOpen = config[`${courtId}_${d.index}`]?.enabled;
          return (
            <div
              key={d.index}
              className={`h-4 w-4 rounded-sm text-[8px] font-bold flex items-center justify-center ${
                isOpen
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
              title={d.label}
            >
              {d.label[0]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminSchedule() {
  const { orgId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [hoursConfig, setHoursConfig] = useState({});
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const d = await getScheduleData(orgId);
    setData(d);
    if (d.courts.length > 0) {
      setSelectedCourt((prev) =>
        prev && d.courts.find((c) => c.id === prev) ? prev : d.courts[0].id
      );
    }
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
          config[key] = {
            open: DEFAULT_OPEN,
            close: DEFAULT_CLOSE,
            enabled: false,
          };
        }
      }
    }
    setHoursConfig(config);
    setLoading(false);
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  const getCfg = (courtId, dayIndex) =>
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
        ...getCfg(courtId, dayIndex),
        enabled: !prev[key]?.enabled,
      },
    }));
  };

  const updateTime = (courtId, dayIndex, field, value) => {
    const key = `${courtId}_${dayIndex}`;
    setHoursConfig((prev) => ({
      ...prev,
      [key]: { ...getCfg(courtId, dayIndex), [field]: value },
    }));
  };

  const applyPreset = (courtId, open, close) => {
    const newConfig = { ...hoursConfig };
    for (const day of DAYS) {
      const key = `${courtId}_${day.index}`;
      newConfig[key] = { ...getCfg(courtId, day.index), open, close };
    }
    setHoursConfig(newConfig);
  };

  const toggleAll = (courtId, enabled) => {
    const newConfig = { ...hoursConfig };
    for (const day of DAYS) {
      const key = `${courtId}_${day.index}`;
      newConfig[key] = { ...getCfg(courtId, day.index), enabled };
    }
    setHoursConfig(newConfig);
  };

  const copyFromDay = (courtId, fromDayIndex) => {
    const src = getCfg(courtId, fromDayIndex);
    const newConfig = { ...hoursConfig };
    for (const day of DAYS) {
      const key = `${courtId}_${day.index}`;
      newConfig[key] = {
        open: src.open,
        close: src.close,
        enabled: day.index === fromDayIndex ? src.enabled : false,
      };
    }
    setHoursConfig(newConfig);
  };

  const handleSave = async () => {
    if (!selectedCourt) return;
    setSaving(true);
    const entries = [];
    for (const day of DAYS) {
      const cfg = getCfg(selectedCourt, day.index);
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

  const currentCourt = data?.courts?.find((c) => c.id === selectedCourt);

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
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Horarios
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configura la disponibilidad de cada cancha por día de la semana
          </p>
        </div>
        <button
          onClick={load}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.75} />
          Recargar
        </button>
      </div>

      {/* Court Cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.courts.map((court, i) => {
          const isSelected = selectedCourt === court.id;
          const openDays = DAYS.filter((d) => getCfg(court.id, d.index).enabled).length;
          const totalH = DAYS.reduce((sum, d) => {
            const cfg = getCfg(court.id, d.index);
            return cfg?.enabled ? sum + (parseInt(cfg.close) - parseInt(cfg.open)) : sum;
          }, 0);

          return (
            <button
              key={court.id}
              onClick={() => setSelectedCourt(court.id)}
              className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-200/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {/* Top accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  COURT_COLORS[i % COURT_COLORS.length]
                } ${isSelected ? "opacity-100" : "opacity-0"}`}
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                      isSelected
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm"
                        : "bg-slate-100"
                    }`}
                  >
                    {SPORT_ICONS[court.sport] || "🏟️"}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${
                        isSelected ? "text-emerald-800" : "text-slate-700"
                      }`}
                    >
                      {court.name}
                    </p>
                    <p className="text-xs capitalize text-slate-400">
                      {court.sport}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                <span>
                  <b className="text-slate-600">{openDays}</b> días
                </span>
                <span>·</span>
                <span>
                  <b className="text-slate-600">{totalH}h</b>/sem
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor */}
      {selectedCourt && currentCourt && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Card header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {SPORT_ICONS[currentCourt.sport] || "🏟️"}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {currentCourt.name}
                    </h2>
                    <p className="text-xs text-emerald-100 capitalize">
                      {currentCourt.sport} · Configuración de horarios
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-white/20 text-white hover:bg-white/30 border-0 shadow-none"
                >
                  <Save className="mr-1.5 h-4 w-4" />
                  {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar"}
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Week summary */}
              <WeekSummary config={hoursConfig} courtId={selectedCourt} />

              {/* Quick actions */}
              <div className="mb-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 mr-1">
                    Acciones rápidas:
                  </span>
                  <button
                    onClick={() => toggleAll(selectedCourt, true)}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100"
                  >
                    Abrir todos los días
                  </button>
                  <button
                    onClick={() => toggleAll(selectedCourt, false)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50"
                  >
                    Cerrar todos
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 mr-1">
                    Rellenar horario:
                  </span>
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(selectedCourt, p.open, p.close)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      title={p.desc}
                    >
                      {p.label} ({p.desc})
                    </button>
                  ))}
                </div>
              </div>

              {/* Day cards */}
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const cfg = getCfg(selectedCourt, day.index);
                  const isToday = day.index === new Date().getDay();

                  return (
                    <div
                      key={day.index}
                      className={`rounded-2xl border transition-all duration-200 ${
                        cfg.enabled
                          ? "border-emerald-200 bg-white"
                          : "border-slate-100 bg-slate-50/50"
                      } ${isToday ? "ring-1 ring-emerald-300/40" : ""}`}
                    >
                      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                        {/* Day label + toggle */}
                        <div className="flex min-w-[100px] items-center gap-3">
                          <button
                            onClick={() => toggleDay(selectedCourt, day.index)}
                            className={`relative flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                              cfg.enabled ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                cfg.enabled
                                  ? "translate-x-[22px]"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                          <div>
                            <p
                              className={`text-sm font-bold ${
                                cfg.enabled ? "text-slate-800" : "text-slate-400"
                              }`}
                            >
                              {day.label}
                            </p>
                            {isToday && (
                              <span className="text-[10px] font-semibold text-emerald-600">
                                Hoy
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Time controls */}
                        {cfg.enabled ? (
                          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                              <Sun className="h-3.5 w-3.5 text-amber-500" />
                              <select
                                value={cfg.open}
                                onChange={(e) =>
                                  updateTime(selectedCourt, day.index, "open", e.target.value)
                                }
                                className="h-8 w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-emerald-400"
                              >
                                {HOURS.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex-1 min-w-0 px-1">
                              <TimeBar open={cfg.open} close={cfg.close} />
                            </div>

                            <div className="flex items-center gap-2">
                              <Moon className="h-3.5 w-3.5 text-indigo-400" />
                              <select
                                value={cfg.close}
                                onChange={(e) =>
                                  updateTime(selectedCourt, day.index, "close", e.target.value)
                                }
                                className="h-8 w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-emerald-400"
                              >
                                {HOURS.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Copy this day to others */}
                            <button
                              onClick={() => copyFromDay(selectedCourt, day.index)}
                              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                              title="Copiar horario a todos los días"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-1 items-center">
                            <span className="flex items-center gap-2 text-xs text-slate-400 italic">
                              <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                              Cerrado este día
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save footer */}
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-3">
                <p className="text-xs text-slate-400">
                  Los cambios se reflejan automáticamente en la página pública
                </p>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-1.5 h-4 w-4" />
                  {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
