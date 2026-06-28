import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Save, ExternalLink, Clock, QrCode, Image } from "lucide-react";
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
  const [qrUrl, setQrUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await getOrganization(orgId);
    if (data) {
      setOrg(data);
      setName(data.name ?? "");
      setQrUrl(data.qr_image_url ?? "");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateOrganization(org.id, {
      name,
      qr_image_url: qrUrl || null,
    });
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

      {/* QR de pago */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
              <QrCode className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">QR de pago</h3>
              <p className="mt-1 text-sm text-slate-500">
                Los clientes verán este QR al confirmar su reserva para que puedan pagar escaneando
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Image className="h-3.5 w-3.5" />
                    URL de la imagen QR
                  </label>
                  <input
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    placeholder="https://ejemplo.com/mi-qr.png"
                    className="h-11 w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono text-xs"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Sube tu QR a Imgur, Cloudinary o cualquier hosting y pega el enlace aquí
                  </p>
                </div>

                {qrUrl && (
                  <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
                    <p className="text-xs font-semibold text-slate-500">Vista previa</p>
                    <img
                      src={qrUrl}
                      alt="QR de pago"
                      className="h-40 w-40 rounded-xl border border-slate-100 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <p className="hidden text-xs text-red-500">No se pudo cargar la imagen</p>
                  </div>
                )}
              </div>
            </div>
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
