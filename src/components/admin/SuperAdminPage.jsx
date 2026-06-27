import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { CheckCircle, XCircle, Clock, Search, ArrowLeft } from "lucide-react";

const API_BASE = import.meta.env.DEV ? "" : "";

export default function SuperAdminPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      navigate("/admin", { replace: true });
      return;
    }
    loadOrgs();
  }, [authLoading, isSuperAdmin]);

  const loadOrgs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/superadmin/orgs");
      const json = await res.json();
      if (json.error) {
        setMessage("Error: " + json.error);
      } else {
        setOrgs(json.data || []);
      }
    } catch (err) {
      setMessage("Error de conexión: " + err.message);
    }
    setLoading(false);
  };

  const activateSubscription = async (orgId, durationDays = 30) => {
    setActivating(orgId);
    setMessage("");
    const trialEndsAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("organizations")
      .update({
        subscription_status: "active",
        subscription_plan: "monthly",
        trial_ends_at: trialEndsAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orgId);

    if (error) {
      setMessage(`Error al activar: ${error.message}`);
    } else {
      setMessage("✅ Suscripción activada correctamente");
      loadOrgs();
    }
    setActivating(null);
  };

  const deactivateSubscription = async (orgId) => {
    setActivating(orgId);
    setMessage("");

    const { error } = await supabase
      .from("organizations")
      .update({
        subscription_status: "canceled",
        subscription_plan: "trial",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orgId);

    if (error) {
      setMessage(`Error al desactivar: ${error.message}`);
    } else {
      setMessage("✅ Suscripción desactivada");
      loadOrgs();
    }
    setActivating(null);
  };

  const getStatusBadge = (org) => {
    const isTrialing =
      org.subscription_status === "trialing" &&
      org.trial_ends_at &&
      new Date(org.trial_ends_at) > new Date();
    const isExpired =
      org.subscription_status === "trialing" &&
      org.trial_ends_at &&
      new Date(org.trial_ends_at) <= new Date();

    if (org.subscription_status === "active")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <CheckCircle className="h-3 w-3" /> Activa
        </span>
      );
    if (isTrialing)
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
          <Clock className="h-3 w-3" /> Prueba
        </span>
      );
    if (isExpired || org.subscription_status === "canceled")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <XCircle className="h-3 w-3" /> Inactiva
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
        {org.subscription_status}
      </span>
    );
  };

  const filteredOrgs = orgs.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-sm font-bold">Panel Super Admin</h1>
              <p className="text-xs text-slate-400">Gestionar suscripciones</p>
            </div>
          </div>
          <button
            onClick={loadOrgs}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Recargar
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar complejo..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-black text-emerald-700">
              {orgs.filter((o) => o.subscription_status === "active").length}
            </p>
            <p className="text-xs text-slate-400">Activas</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-black text-blue-600">
              {orgs.filter(
                (o) =>
                  o.subscription_status === "trialing" &&
                  o.trial_ends_at &&
                  new Date(o.trial_ends_at) > new Date()
              ).length}
            </p>
            <p className="text-xs text-slate-400">En prueba</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-black text-slate-700">{orgs.length}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 text-center text-sm font-medium text-slate-700">
            {message}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-400">
              {searchTerm ? "No se encontraron complejos" : "No hay complejos registrados aún"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrgs.map((org) => {
              const trialEnd = org.trial_ends_at
                ? new Date(org.trial_ends_at)
                : null;
              const daysLeft = trialEnd
                ? Math.max(
                    0,
                    Math.floor((trialEnd - new Date()) / (1000 * 60 * 60 * 24))
                  )
                : 0;

              return (
                <div
                  key={org.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800">{org.name}</h3>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Creado:{" "}
                        {new Date(org.created_at).toLocaleDateString("es-BO")}
                        {trialEnd &&
                          ` — Trial hasta: ${trialEnd.toLocaleDateString("es-BO")}`}
                        {daysLeft > 0 &&
                          ` (${daysLeft} días)`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(org)}

                      {org.subscription_status !== "active" && (
                        <button
                          onClick={() => activateSubscription(org.id)}
                          disabled={activating === org.id}
                          className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
                        >
                          {activating === org.id
                            ? "Activando..."
                            : "Activar (30 días)"}
                        </button>
                      )}

                      {org.subscription_status === "active" && (
                        <button
                          onClick={() => deactivateSubscription(org.id)}
                          disabled={activating === org.id}
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          {activating === org.id ? "..." : "Desactivar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
