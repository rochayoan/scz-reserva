import { useState, useEffect } from "react";
import { RefreshCw, Save } from "lucide-react";
import { Card, CardContent, Button } from "../ui";
import { useAuth } from "../../lib/AuthContext";
import { getOrganization, updateOrganization } from "../../lib/adminSupabase";

const PLANS = {
  trial: { label: "Prueba", color: "bg-slate-100 text-slate-600" },
  basic: { label: "Básico", color: "bg-blue-100 text-blue-700" },
  pro: { label: "Pro", color: "bg-emerald-100 text-emerald-700" },
};

const STATUSES = {
  trialing: { label: "En prueba", color: "bg-amber-100 text-amber-700" },
  active: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
  past_due: { label: "Vencido", color: "bg-red-100 text-red-700" },
  canceled: { label: "Cancelado", color: "bg-slate-100 text-slate-600" },
};

export default function AdminSettings() {
  const { orgId } = useAuth();
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
                Nombre
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Slug
              </label>
              <p className="h-11 flex items-center rounded-xl bg-slate-50 px-4 text-sm text-slate-500">
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
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold">Suscripción</h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
