import { useState, useEffect } from "react";
import {
  RefreshCw,
  Plus,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Save,
  X,
  MapPin,
  Star,
} from "lucide-react";
import { Card, CardContent, Button } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import {
  getVenuesWithCourts,
  saveCourt,
  saveVenue,
  toggleActiveCourt,
  toggleActiveVenue,
} from "../../lib/adminSupabase";

const SPORTS = [
  { value: "futbol", label: "⚽ Fútbol", color: "bg-emerald-100 text-emerald-700" },
  { value: "padel", label: "🎾 Pádel", color: "bg-blue-100 text-blue-700" },
  { value: "tenis", label: "🏸 Tenis", color: "bg-amber-100 text-amber-700" },
];

function CourtForm({ court, venueId, orgId, onSave, onCancel }) {
  const [name, setName] = useState(court?.name ?? "");
  const [sport, setSport] = useState(court?.sport ?? "futbol");
  const [price, setPrice] = useState(court?.price_per_hour ?? 180);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      venue_id: venueId,
      organization_id: orgId,
      name,
      sport,
      price_per_hour: Number(price),
      ...(court?.id ? { id: court.id } : {}),
    };
    await onSave(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Nombre de la cancha
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
            placeholder="Cancha 1"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Deporte
          </label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
          >
            {SPORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Precio por hora (Bs)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={1}
            required
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function VenueForm({ venue, orgId, onSave, onCancel }) {
  const [name, setName] = useState(venue?.name ?? "");
  const [zone, setZone] = useState(venue?.zone ?? "");
  const [description, setDescription] = useState(venue?.description ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(venue?.id ? { ...venue, name, zone, description } : { name, zone, description, organization_id: orgId });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
          Nombre del complejo
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
          placeholder="Mi Complejo Deportivo"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Zona
          </label>
          <input
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
            placeholder="Santa Cruz"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Descripción
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
            placeholder="Fútbol 5, 6, 7 y 8"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function SportBadge({ sport }) {
  const s = SPORTS.find((s) => s.value === sport);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s?.color || "bg-slate-100 text-slate-600"}`}>
      {s?.label || sport}
    </span>
  );
}

export default function AdminCourts() {
  const { orgId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourt, setEditingCourt] = useState(null); // { venueId, court? }
  const [editingVenue, setEditingVenue] = useState(null); // venue or null (new)
  const [showNewVenue, setShowNewVenue] = useState(false);

  const load = async () => {
    setLoading(true);
    const d = await getVenuesWithCourts(orgId);
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveCourt = async (payload) => {
    const { error } = await saveCourt(payload);
    if (!error) {
      setEditingCourt(null);
      await load();
    }
  };

  const handleSaveVenue = async (payload) => {
    const { error } = await saveVenue(payload);
    if (!error) {
      setEditingVenue(null);
      setShowNewVenue(false);
      await load();
    }
  };

  const handleToggleCourt = async (id, isActive) => {
    await toggleActiveCourt(id, !isActive);
    await load();
  };

  const handleToggleVenue = async (id, isActive) => {
    await toggleActiveVenue(id, !isActive);
    await load();
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Canchas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra tus complejos y canchas
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

      {/* Add venue button */}
      {!showNewVenue && !editingVenue && (
        <Button onClick={() => setShowNewVenue(true)} className="mb-6">
          <Plus className="mr-1.5 h-4 w-4" />
          Agregar complejo
        </Button>
      )}

      {/* New venue form */}
      {showNewVenue && (
        <div className="mb-6">
          <VenueForm
            orgId={orgId}
            onSave={handleSaveVenue}
            onCancel={() => setShowNewVenue(false)}
          />
        </div>
      )}

      {/* Venue list */}
      <div className="space-y-6">
        {data.length === 0 ? (
          <Card>
            <CardContent className="px-6 py-12 text-center">
              <p className="text-lg font-bold text-slate-500">
                No tienes complejos registrados
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Agrega tu primer complejo deportivo
              </p>
            </CardContent>
          </Card>
        ) : (
          data.map((venue) => (
            <Card key={venue.id} className={!venue.is_active ? "opacity-60" : "overflow-hidden"}>
              <CardContent className="p-0">
                {/* Venue header with gradient */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{venue.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-emerald-100">
                        <MapPin className="h-3.5 w-3.5" />
                        {venue.zone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVenue(venue.id, venue.is_active)}
                        className={`rounded-lg p-2 transition-colors ${
                          venue.is_active
                            ? "text-white/80 hover:bg-white/20"
                            : "text-white/50 hover:bg-white/20"
                        }`}
                        title={venue.is_active ? "Desactivar" : "Activar"}
                      >
                        {venue.is_active ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingVenue(venue);
                          setShowNewVenue(false);
                        }}
                        className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                        title="Editar complejo"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit venue form */}
                {editingVenue && editingVenue.id === venue.id && (
                  <div className="border-b border-slate-100 p-6">
                    <VenueForm
                      venue={editingVenue}
                      orgId={orgId}
                      onSave={handleSaveVenue}
                      onCancel={() => setEditingVenue(null)}
                    />
                  </div>
                )}

                {/* Courts */}
                <div className="divide-y divide-slate-50">
                  {venue.courts.length === 0 ? (
                    <p className="px-6 py-5 text-sm text-slate-400">
                      Sin canchas registradas
                    </p>
                  ) : (
                    venue.courts.map((court) => (
                      <div
                        key={court.id}
                        className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/50 ${
                          !court.is_active ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-lg">
                            {court.sport === "futbol" ? "⚽" : court.sport === "padel" ? "🎾" : "🏸"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">{court.name}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <SportBadge sport={court.sport} />
                              <span className="text-sm font-bold text-emerald-600 tabular-nums">
                                Bs {court.price_per_hour}
                              </span>
                              {court.rating && (
                                <span className="flex items-center gap-0.5 text-xs text-amber-500">
                                  <Star className="h-3 w-3 fill-current" /> {court.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCourt(court.id, court.is_active)}
                            className={`rounded-lg p-1.5 transition-colors ${
                              court.is_active
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-400 hover:bg-slate-100"
                            }`}
                          >
                            {court.is_active ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingCourt({ venueId: venue.id, court })}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Edit/add court form */}
                  {editingCourt && editingCourt.venueId === venue.id && (
                    <div className="border-t border-slate-100 p-6">
                      <CourtForm
                        court={editingCourt.court ?? null}
                        venueId={venue.id}
                        orgId={venue.organization_id}
                        onSave={handleSaveCourt}
                        onCancel={() => setEditingCourt(null)}
                      />
                    </div>
                  )}

                  {/* Add court button */}
                  {(!editingCourt || editingCourt.venueId !== venue.id) && (
                    <button
                      onClick={() => setEditingCourt({ venueId: venue.id, court: null })}
                      className="flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50/50"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar cancha
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
