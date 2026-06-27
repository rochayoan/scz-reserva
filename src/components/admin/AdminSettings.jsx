import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Save, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, Button } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import { getOrganization, updateOrganization } from "../../lib/adminSupabase";

const PLANS = {
  trial: { label: "Prueba gratuita", color: "bg-amber-100 text-amber-700" },
  monthly: { label: "Mensual", color: "bg-emerald-100 text-emerald-700" },
};

const STATUSES = {
  trialing: { label: "En prueba", color: "bg-amber-100 text-amber-700" },
  active: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
  past_due: { label: "Vencido", color: "bg-red-100 text-red-700" },
  canceled: { label: "Cancelado", color: "bg-slate-100 text-slate-600" },
};

export default function AdminSettings() {
  const { orgId, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await getOrganization(orgId);
    if (data) {
      setOrg(data);
      setName(data.name ?? "");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateOrganization(org.id, { name });
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  // Calcula días restantes de trial
  const trialEnd = org?.trial_ends_at ? new Date(org.trial_ends_at) : null;
  const trialDaysLeft = trialEnd
    ? Math.max(0, Math.floor((trialEnd - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="mt-1 text-sm text-slate-500">
          Datos de tu organización y suscripción
        </p>
      </div>

      {/* Organization info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold">Organización</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Nombre del complejo
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Identificador único
              </label>
              <p className="flex h-11 items-center rounded-xl bg-slate-50 px-4 text-sm text-slate-500 font-mono">
                {org?.slug}
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-1.5 h-4 w-4" />
              {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold">Suscripción</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Plan
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  PLANS[org?.subscription_plan]?.color ??
                  "bg-slate-100 text-slate-600"
                }`}
              >
                {PLANS[org?.subscription_plan]?.label ?? org?.subscription_plan}
              </span>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Estado
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  STATUSES[org?.subscription_status]?.color ??
                  "bg-slate-100 text-slate-600"
                }`}
              >
                {STATUSES[org?.subscription_status]?.label ??
                  org?.subscription_status}
              </span>
            </div>
            {trialEnd && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Prueba termina
                </label>
                <p className="flex items-center gap-1.5 text-sm text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {trialEnd.toLocaleDateString("es-BO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {trialDaysLeft > 0 && (
                    <span className="text-xs text-amber-600 font-semibold">
                      ({trialDaysLeft} días)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {org?.subscription_status !== "active" && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3">
              <span className="text-xs text-amber-800">
                {org?.subscription_status === "trialing"
                  ? `Te quedan ${trialDaysLeft} días de prueba. Activa tu suscripción para no perder el acceso.`
                  : "Tu suscripción no está activa. Actívala para seguir usando el panel."}
              </span>
              <button
                onClick={() => navigate("/admin/precios")}
                className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Ver planes
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Super admin quick link */}
      {isSuperAdmin && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-bold">Super Admin</h3>
            <p className="mb-4 text-sm text-slate-500">
              Gestiona las suscripciones de todos los complejos
            </p>
            <Button onClick={() => navigate("/admin/super")}>
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Ir al panel Super Admin
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
